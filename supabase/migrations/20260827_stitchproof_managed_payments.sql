-- Additive, apply-once migration; apply inside a transaction after the reviewed
-- 20260826_stitchproof_project_entitlements migration. Do not edit or reapply it.
-- This is local preparation, not Managed Payments enrollment or activation.
-- The existing three private tables and v1 RPC definitions remain in place.
-- Only a country code, approved market-policy version, and owner-classified
-- product tax code are added; never store a billing address or pattern content.

do $stitchproof_managed_precondition$
begin
  if public.stitchproof_purchase_schema_version()
    is distinct from '20260826_stitchproof_project_entitlements' then
    raise exception 'The verified original StitchProof purchase schema is required';
  end if;
end;
$stitchproof_managed_precondition$;

alter table public.stitchproof_purchase_attempts
  add column purchase_country text,
  add column market_policy_version text,
  add column product_tax_code text;

-- The replacement constraints are a strict superset for legacy rows: legacy
-- contracts require all three new fields to remain null. Explicit COALESCE
-- prevents a missing managed value from passing a CHECK through SQL NULL.
alter table public.stitchproof_purchase_attempts
  drop constraint stitchproof_purchase_attempts_offer_version_check,
  drop constraint stitchproof_purchase_attempt_tax_contract,
  add constraint stitchproof_purchase_attempts_offer_version_check check (
    offer_version in ('STITCHPROOF-PROJECT-V1', 'STITCHPROOF-PROJECT-MANAGED-V1')
  ),
  add constraint stitchproof_purchase_attempt_contract_v2 check (coalesce(
    (
      offer_version = 'STITCHPROOF-PROJECT-V1'
      and ((tax_mode = 'none' and tax_behavior = 'not_applicable')
        or (tax_mode = 'automatic' and tax_behavior in ('inclusive', 'exclusive')))
      and purchase_country is null and market_policy_version is null and product_tax_code is null
    ) or (
      offer_version = 'STITCHPROOF-PROJECT-MANAGED-V1'
      and tax_mode = 'managed' and tax_behavior in ('inclusive', 'exclusive')
      and purchase_country in (
        'US', 'CA', 'GB', 'AU', 'NZ', 'AT', 'BE', 'DK', 'FI', 'FR', 'DE', 'IS',
        'IE', 'IT', 'LU', 'NL', 'NO', 'PT', 'ES', 'SE', 'CH', 'JP', 'SG', 'KR'
      )
      and market_policy_version = 'STITCHPROOF-MARKETS-2026-08-27'
      and product_tax_code ~ '^txcd_[0-9]{8}$'
    ), false
  ));

-- Internal serializer: no direct browser or service-role execution. Historical
-- attempts retain their existing values and expose null new fields in v2.
create function public.stitchproof_purchase_snapshot_v2(
  p_project_id uuid, p_stripe_livemode boolean, p_attempt_id uuid
) returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select pg_catalog.jsonb_build_object(
    'projectId', p.project_id, 'claimSha256', p.claim_sha256, 'stripeLivemode', p.stripe_livemode,
    'attempt', pg_catalog.jsonb_build_object(
      'id', a.id, 'stripeAccountId', a.stripe_account_id, 'productId', a.product_id,
      'priceId', a.price_id, 'offerVersion', a.offer_version, 'amountCents', a.amount_cents,
      'currency', a.currency, 'taxMode', a.tax_mode, 'taxBehavior', a.tax_behavior,
      'purchaseCountry', a.purchase_country, 'marketPolicyVersion', a.market_policy_version,
      'productTaxCode', a.product_tax_code,
      'status', a.status, 'checkoutSessionId', a.stripe_checkout_session_id,
      'paymentIntentId', a.stripe_payment_intent_id, 'createdAt', a.created_at,
      'checkoutExpiresAt', a.checkout_expires_at
    )
  ) from public.stitchproof_purchase_projects p
  join public.stitchproof_purchase_attempts a on a.project_id = p.project_id
    and a.stripe_livemode = p.stripe_livemode and a.id = p_attempt_id
  where p.project_id = p_project_id and p.stripe_livemode = p_stripe_livemode;
$$;

create function public.stitchproof_purchase_load_v2(
  p_project_id uuid, p_claim_sha256 text, p_stripe_livemode boolean
) returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select public.stitchproof_purchase_snapshot_v2(p.project_id, p.stripe_livemode, p.active_attempt_id)
  from public.stitchproof_purchase_projects p
  where p.project_id = p_project_id and p.claim_sha256 = p_claim_sha256
    and p.stripe_livemode = p_stripe_livemode;
$$;

create function public.stitchproof_purchase_load_webhook_v2(
  p_project_id uuid, p_attempt_id uuid, p_claim_sha256 text, p_stripe_livemode boolean
) returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select public.stitchproof_purchase_snapshot_v2(p.project_id, p.stripe_livemode, p_attempt_id)
  from public.stitchproof_purchase_projects p
  where p.project_id = p_project_id and p.claim_sha256 = p_claim_sha256
    and p.stripe_livemode = p_stripe_livemode;
$$;

-- Reuse the SAME project lock and ledger as v1. Exact contract equality keeps
-- unresolved retries bound to their original market and merchant/tax contract.
-- An attached, freshly provider-verified unpaid expiry is the only renewal path.
create function public.stitchproof_purchase_reserve_v2(
  p_project_id uuid, p_claim_sha256 text, p_stripe_livemode boolean,
  p_attempt_id uuid, p_expected_attempt_id uuid, p_contract jsonb
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_project public.stitchproof_purchase_projects%rowtype;
  v_attempt public.stitchproof_purchase_attempts%rowtype;
  v_existing_contract jsonb;
  v_managed boolean;
begin
  if p_project_id is null or p_stripe_livemode is null or p_attempt_id is null
    or p_project_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or p_attempt_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or (p_expected_attempt_id is not null and p_expected_attempt_id::text
      !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$')
    or p_claim_sha256 is null or p_claim_sha256 !~ '^[0-9a-f]{64}$'
    or p_contract is null or pg_catalog.jsonb_typeof(p_contract) <> 'object'
  then raise exception 'Invalid purchase reservation'; end if;

  v_managed := p_contract->>'taxMode' = 'managed';
  if not coalesce(
    p_contract->>'stripeAccountId' = 'acct_1U5HWnD2Of3MIt94'
    and p_contract->>'productId' ~ '^prod_[A-Za-z0-9]+$'
    and p_contract->>'priceId' ~ '^price_[A-Za-z0-9]+$'
    and p_contract->'amountCents' = '900'::jsonb and p_contract->>'currency' = 'usd'
    and (
      (
        p_contract->>'offerVersion' = 'STITCHPROOF-PROJECT-V1'
        and ((p_contract->>'taxMode' = 'none' and p_contract->>'taxBehavior' = 'not_applicable')
          or (p_contract->>'taxMode' = 'automatic' and p_contract->>'taxBehavior' in ('inclusive', 'exclusive')))
        and (select pg_catalog.count(*) from pg_catalog.jsonb_object_keys(p_contract)) = 8
      ) or (
        p_contract->>'offerVersion' = 'STITCHPROOF-PROJECT-MANAGED-V1'
        and v_managed and p_contract->>'taxBehavior' in ('inclusive', 'exclusive')
        and p_contract->>'purchaseCountry' in (
          'US', 'CA', 'GB', 'AU', 'NZ', 'AT', 'BE', 'DK', 'FI', 'FR', 'DE', 'IS',
          'IE', 'IT', 'LU', 'NL', 'NO', 'PT', 'ES', 'SE', 'CH', 'JP', 'SG', 'KR'
        )
        and p_contract->>'marketPolicyVersion' = 'STITCHPROOF-MARKETS-2026-08-27'
        and p_contract->>'productTaxCode' ~ '^txcd_[0-9]{8}$'
        and (select pg_catalog.count(*) from pg_catalog.jsonb_object_keys(p_contract)) = 11
      )
    ), false
  ) then raise exception 'Invalid purchase reservation'; end if;

  insert into public.stitchproof_purchase_projects (project_id, stripe_livemode, claim_sha256)
    values (p_project_id, p_stripe_livemode, p_claim_sha256)
    on conflict (project_id, stripe_livemode) do nothing;
  select * into v_project from public.stitchproof_purchase_projects
    where project_id = p_project_id and stripe_livemode = p_stripe_livemode for update;
  if v_project.claim_sha256 <> p_claim_sha256 then return null; end if;
  if v_project.active_attempt_id is not null then
    -- Serialize against shared financial mutators as well as checkout retries.
    select * into v_attempt from public.stitchproof_purchase_attempts
      where id = v_project.active_attempt_id for update;
    if not found then return null; end if;
    if v_attempt.status <> 'expired' or p_expected_attempt_id is distinct from v_attempt.id then
      v_existing_contract := pg_catalog.jsonb_build_object(
        'stripeAccountId', v_attempt.stripe_account_id, 'productId', v_attempt.product_id,
        'priceId', v_attempt.price_id, 'offerVersion', v_attempt.offer_version,
        'amountCents', v_attempt.amount_cents, 'currency', v_attempt.currency,
        'taxMode', v_attempt.tax_mode, 'taxBehavior', v_attempt.tax_behavior
      );
      if v_attempt.tax_mode = 'managed' then
        v_existing_contract := v_existing_contract || pg_catalog.jsonb_build_object(
          'purchaseCountry', v_attempt.purchase_country, 'marketPolicyVersion', v_attempt.market_policy_version,
          'productTaxCode', v_attempt.product_tax_code
        );
      end if;
      if p_contract is distinct from v_existing_contract then return null; end if;
      return public.stitchproof_purchase_snapshot_v2(p_project_id, p_stripe_livemode, v_attempt.id);
    end if;
    if v_attempt.stripe_checkout_session_id is null or v_attempt.last_verified_at is null then return null; end if;
  elsif p_expected_attempt_id is not null then return null;
  end if;

  insert into public.stitchproof_purchase_attempts (
    id, project_id, stripe_livemode, stripe_account_id, product_id, price_id, offer_version,
    amount_cents, currency, tax_mode, tax_behavior, purchase_country, market_policy_version, product_tax_code
  ) values (
    p_attempt_id, p_project_id, p_stripe_livemode, p_contract->>'stripeAccountId',
    p_contract->>'productId', p_contract->>'priceId', p_contract->>'offerVersion',
    900, 'usd', p_contract->>'taxMode', p_contract->>'taxBehavior',
    p_contract->>'purchaseCountry', p_contract->>'marketPolicyVersion', p_contract->>'productTaxCode'
  );
  update public.stitchproof_purchase_projects set active_attempt_id = p_attempt_id
    where project_id = p_project_id and stripe_livemode = p_stripe_livemode;
  return public.stitchproof_purchase_snapshot_v2(p_project_id, p_stripe_livemode, p_attempt_id);
end;
$$;

-- Metadata-only readiness: no customer or purchase rows are queried. Both RPC
-- generations stay private. A v1 application can still use its unchanged RPCs.
create function public.stitchproof_purchase_schema_version_v2()
returns text language plpgsql stable security definer set search_path = public, pg_temp as $$
declare
  v_table record;
  v_function record;
  v_role record;
  v_oid oid;
begin
  if (select pg_catalog.count(*) from pg_catalog.pg_roles
    where rolname in ('anon', 'authenticated', 'service_role')) <> 3 then return null; end if;
  for v_table in select * from (values
    ('stitchproof_purchase_projects', 5),
    ('stitchproof_purchase_attempts', 20),
    ('stitchproof_purchase_webhook_events', 6)
  ) as expected(table_name, column_count) loop
    v_oid := pg_catalog.to_regclass('public.' || v_table.table_name);
    if v_oid is null or not exists(select 1 from pg_catalog.pg_class
      where oid = v_oid and relkind = 'r' and relrowsecurity and relforcerowsecurity) then return null; end if;
    if (select pg_catalog.count(*) from pg_catalog.pg_attribute
      where attrelid = v_oid and attnum > 0 and not attisdropped) <> v_table.column_count then return null; end if;
    if exists(select 1 from pg_catalog.pg_constraint where conrelid = v_oid and not convalidated) then return null; end if;
    for v_role in select oid from pg_catalog.pg_roles
      where rolname in ('anon', 'authenticated', 'service_role') loop
      if pg_catalog.has_table_privilege(v_role.oid, v_oid,
          'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
        or pg_catalog.has_any_column_privilege(v_role.oid, v_oid, 'SELECT,INSERT,UPDATE,REFERENCES') then return null; end if;
    end loop;
  end loop;

  if (select pg_catalog.count(*) from pg_catalog.pg_attribute
    where attrelid = pg_catalog.to_regclass('public.stitchproof_purchase_attempts')
      and attname in ('purchase_country', 'market_policy_version', 'product_tax_code')
      and atttypid = 'pg_catalog.text'::regtype and attnum > 0 and not attisdropped and not attnotnull) <> 3 then return null; end if;
  -- Compare normalized catalog definitions, not constraint names alone. This
  -- also detects an accidentally weakened CHECK that still has the right name.
  if not exists(select 1 from pg_catalog.pg_constraint
    where conrelid = pg_catalog.to_regclass('public.stitchproof_purchase_attempts')
      and conname = 'stitchproof_purchase_attempts_offer_version_check' and contype = 'c' and convalidated
      and pg_catalog.md5(pg_catalog.regexp_replace(pg_catalog.pg_get_constraintdef(oid), '\s+', '', 'g'))
        = '268b1c215a246b84e37f59b1e6f4d189')
    or not exists(select 1 from pg_catalog.pg_constraint
    where conrelid = pg_catalog.to_regclass('public.stitchproof_purchase_attempts')
      and conname = 'stitchproof_purchase_attempt_contract_v2' and contype = 'c' and convalidated
      and pg_catalog.md5(pg_catalog.regexp_replace(pg_catalog.pg_get_constraintdef(oid), '\s+', '', 'g'))
        = '54c73c92c5fdd1b90444077f8b9e406f') then return null; end if;

  for v_function in select * from (values
    ('public.stitchproof_purchase_snapshot(uuid,boolean,uuid)', 'jsonb', false),
    ('public.stitchproof_purchase_schema_version()', 'text', true),
    ('public.stitchproof_purchase_load(uuid,text,boolean)', 'jsonb', true),
    ('public.stitchproof_purchase_load_webhook(uuid,uuid,text,boolean)', 'jsonb', true),
    ('public.stitchproof_purchase_reserve(uuid,text,boolean,uuid,uuid,jsonb)', 'jsonb', true),
    ('public.stitchproof_purchase_attach_checkout(uuid,boolean,uuid,text,text,timestamptz)', 'boolean', true),
    ('public.stitchproof_purchase_record_verification(uuid,boolean,uuid,text,text,text,timestamptz)', 'boolean', true),
    ('public.stitchproof_purchase_has_event(text,boolean)', 'boolean', true),
    ('public.stitchproof_purchase_record_event(text,text,uuid,boolean,uuid,text,text,text,timestamptz)', 'boolean', true),
    ('public.stitchproof_purchase_snapshot_v2(uuid,boolean,uuid)', 'jsonb', false),
    ('public.stitchproof_purchase_load_v2(uuid,text,boolean)', 'jsonb', true),
    ('public.stitchproof_purchase_load_webhook_v2(uuid,uuid,text,boolean)', 'jsonb', true),
    ('public.stitchproof_purchase_reserve_v2(uuid,text,boolean,uuid,uuid,jsonb)', 'jsonb', true),
    ('public.stitchproof_purchase_schema_version_v2()', 'text', true)
  ) as expected(signature, return_type, service_execute_expected) loop
    v_oid := pg_catalog.to_regprocedure(v_function.signature);
    if v_oid is null or not exists(select 1 from pg_catalog.pg_proc p
      join pg_catalog.pg_roles owner_role on owner_role.oid = p.proowner
      where p.oid = v_oid and p.prosecdef and p.prorettype = pg_catalog.to_regtype(v_function.return_type)
        and p.proconfig @> array['search_path=public, pg_temp']::text[]
        and (owner_role.rolsuper or owner_role.rolbypassrls)) then return null; end if;
    if exists(select 1 from pg_catalog.pg_proc p,
      lateral pg_catalog.aclexplode(coalesce(p.proacl, pg_catalog.acldefault('f', p.proowner))) acl
      where p.oid = v_oid and acl.grantee = 0 and acl.privilege_type = 'EXECUTE') then return null; end if;
    for v_role in select oid, rolname from pg_catalog.pg_roles
      where rolname in ('anon', 'authenticated', 'service_role') loop
      if pg_catalog.has_function_privilege(v_role.oid, v_oid, 'EXECUTE')
        is distinct from (v_role.rolname = 'service_role' and v_function.service_execute_expected) then return null; end if;
    end loop;
  end loop;
  return '20260827_stitchproof_managed_payments';
end;
$$;

revoke all on function public.stitchproof_purchase_snapshot_v2(uuid, boolean, uuid) from public, anon, authenticated, service_role;
revoke all on function public.stitchproof_purchase_load_v2(uuid, text, boolean) from public, anon, authenticated;
revoke all on function public.stitchproof_purchase_load_webhook_v2(uuid, uuid, text, boolean) from public, anon, authenticated;
revoke all on function public.stitchproof_purchase_reserve_v2(uuid, text, boolean, uuid, uuid, jsonb) from public, anon, authenticated;
revoke all on function public.stitchproof_purchase_schema_version_v2() from public, anon, authenticated;

grant execute on function public.stitchproof_purchase_load_v2(uuid, text, boolean) to service_role;
grant execute on function public.stitchproof_purchase_load_webhook_v2(uuid, uuid, text, boolean) to service_role;
grant execute on function public.stitchproof_purchase_reserve_v2(uuid, text, boolean, uuid, uuid, jsonb) to service_role;
grant execute on function public.stitchproof_purchase_schema_version_v2() to service_role;
