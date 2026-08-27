-- Minimal private payment ledger. No pattern, project title, raw claim secret,
-- customer details, request bodies, checkout URLs, or arbitrary access expiry.
-- This migration is local preparation until an approved provider release.

create table public.stitchproof_purchase_projects (
  project_id uuid not null check (project_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'),
  stripe_livemode boolean not null,
  claim_sha256 text not null check (claim_sha256 ~ '^[0-9a-f]{64}$'),
  active_attempt_id uuid,
  created_at timestamptz not null default pg_catalog.now(),
  primary key (project_id, stripe_livemode)
);

create table public.stitchproof_purchase_attempts (
  id uuid primary key check (id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'),
  project_id uuid not null,
  stripe_livemode boolean not null,
  stripe_account_id text not null check (stripe_account_id = 'acct_1U5HWnD2Of3MIt94'),
  product_id text not null check (product_id ~ '^prod_[A-Za-z0-9]+$'),
  price_id text not null check (price_id ~ '^price_[A-Za-z0-9]+$'),
  offer_version text not null check (offer_version = 'STITCHPROOF-PROJECT-V1'),
  amount_cents integer not null check (amount_cents = 900),
  currency text not null check (currency = 'usd'),
  tax_mode text not null,
  tax_behavior text not null,
  status text not null default 'creating' check (status in ('creating', 'pending', 'paid', 'expired', 'refunded', 'disputed', 'unavailable')),
  stripe_checkout_session_id text,
  stripe_payment_intent_id text check (stripe_payment_intent_id is null or stripe_payment_intent_id ~ '^pi_[A-Za-z0-9]+$'),
  checkout_expires_at timestamptz,
  created_at timestamptz not null default pg_catalog.now(),
  last_verified_at timestamptz,
  constraint stitchproof_purchase_attempt_tax_contract check (
    (tax_mode = 'none' and tax_behavior = 'not_applicable') or
    (tax_mode = 'automatic' and tax_behavior in ('inclusive', 'exclusive'))
  ),
  constraint stitchproof_purchase_session_mode check (
    stripe_checkout_session_id is null or
    (stripe_livemode and stripe_checkout_session_id ~ '^cs_live_[A-Za-z0-9]+$') or
    (not stripe_livemode and stripe_checkout_session_id ~ '^cs_test_[A-Za-z0-9]+$')
  ),
  foreign key (project_id, stripe_livemode)
    references public.stitchproof_purchase_projects (project_id, stripe_livemode),
  unique (project_id, stripe_livemode, id),
  unique (stripe_livemode, stripe_checkout_session_id),
  unique (stripe_livemode, stripe_payment_intent_id)
);

alter table public.stitchproof_purchase_projects add constraint stitchproof_purchase_active_attempt
  foreign key (project_id, stripe_livemode, active_attempt_id)
  references public.stitchproof_purchase_attempts (project_id, stripe_livemode, id);

create table public.stitchproof_purchase_webhook_events (
  event_id text not null check (event_id ~ '^evt_[A-Za-z0-9]+$'),
  stripe_livemode boolean not null,
  project_id uuid not null,
  attempt_id uuid not null,
  event_type text not null check (event_type in (
    'checkout.session.completed', 'checkout.session.expired',
    'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed',
    'charge.refunded', 'refund.created', 'refund.updated', 'refund.failed',
    'charge.dispute.created', 'charge.dispute.updated', 'charge.dispute.closed'
  )),
  processed_at timestamptz not null default pg_catalog.now(),
  primary key (event_id, stripe_livemode),
  foreign key (project_id, stripe_livemode, attempt_id)
    references public.stitchproof_purchase_attempts (project_id, stripe_livemode, id)
);

alter table public.stitchproof_purchase_projects enable row level security;
alter table public.stitchproof_purchase_projects force row level security;
alter table public.stitchproof_purchase_attempts enable row level security;
alter table public.stitchproof_purchase_attempts force row level security;
alter table public.stitchproof_purchase_webhook_events enable row level security;
alter table public.stitchproof_purchase_webhook_events force row level security;

revoke all on public.stitchproof_purchase_projects, public.stitchproof_purchase_attempts,
  public.stitchproof_purchase_webhook_events from public, anon, authenticated, service_role;

-- Internal serializer; never executable by a browser or the service-role client.
create function public.stitchproof_purchase_snapshot(p_project_id uuid, p_stripe_livemode boolean, p_attempt_id uuid)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select pg_catalog.jsonb_build_object(
    'projectId', p.project_id, 'claimSha256', p.claim_sha256, 'stripeLivemode', p.stripe_livemode,
    'attempt', pg_catalog.jsonb_build_object(
      'id', a.id, 'stripeAccountId', a.stripe_account_id, 'productId', a.product_id,
      'priceId', a.price_id, 'offerVersion', a.offer_version, 'amountCents', a.amount_cents,
      'currency', a.currency, 'taxMode', a.tax_mode, 'taxBehavior', a.tax_behavior,
      'status', a.status, 'checkoutSessionId', a.stripe_checkout_session_id,
      'paymentIntentId', a.stripe_payment_intent_id, 'createdAt', a.created_at,
      'checkoutExpiresAt', a.checkout_expires_at
    )
  ) from public.stitchproof_purchase_projects p
  join public.stitchproof_purchase_attempts a on a.project_id = p.project_id
    and a.stripe_livemode = p.stripe_livemode and a.id = p_attempt_id
  where p.project_id = p_project_id and p.stripe_livemode = p_stripe_livemode;
$$;

create function public.stitchproof_purchase_schema_version()
returns text language sql stable security definer set search_path = public, pg_temp as $$
  select case when pg_catalog.count(*) = 3
    and pg_catalog.bool_and(c.relrowsecurity and c.relforcerowsecurity)
    and not pg_catalog.bool_or(pg_catalog.has_table_privilege('anon', c.oid, 'SELECT,INSERT,UPDATE,DELETE'))
    and not pg_catalog.bool_or(pg_catalog.has_table_privilege('authenticated', c.oid, 'SELECT,INSERT,UPDATE,DELETE'))
    and not pg_catalog.bool_or(pg_catalog.has_table_privilege('service_role', c.oid, 'SELECT,INSERT,UPDATE,DELETE'))
    then '20260826_stitchproof_project_entitlements' else null end
  from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname in (
    'stitchproof_purchase_projects', 'stitchproof_purchase_attempts', 'stitchproof_purchase_webhook_events'
  );
$$;

create function public.stitchproof_purchase_load(p_project_id uuid, p_claim_sha256 text, p_stripe_livemode boolean)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select public.stitchproof_purchase_snapshot(p.project_id, p.stripe_livemode, p.active_attempt_id)
  from public.stitchproof_purchase_projects p
  where p.project_id = p_project_id and p.claim_sha256 = p_claim_sha256
    and p.stripe_livemode = p_stripe_livemode;
$$;

create function public.stitchproof_purchase_load_webhook(
  p_project_id uuid, p_attempt_id uuid, p_claim_sha256 text, p_stripe_livemode boolean
) returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select public.stitchproof_purchase_snapshot(p.project_id, p.stripe_livemode, p_attempt_id)
  from public.stitchproof_purchase_projects p
  where p.project_id = p_project_id and p.claim_sha256 = p_claim_sha256
    and p.stripe_livemode = p_stripe_livemode;
$$;

-- The project row lock and immutable attempt ID survive HTTP retries and Stripe's
-- idempotency retention window. An unknown/orphaned attempt is never replaced.
create function public.stitchproof_purchase_reserve(
  p_project_id uuid, p_claim_sha256 text, p_stripe_livemode boolean,
  p_attempt_id uuid, p_expected_attempt_id uuid, p_contract jsonb
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_project public.stitchproof_purchase_projects%rowtype;
  v_attempt public.stitchproof_purchase_attempts%rowtype;
begin
  if p_project_id is null or p_stripe_livemode is null or p_attempt_id is null
    or p_claim_sha256 is null or p_claim_sha256 !~ '^[0-9a-f]{64}$'
    or p_contract is null or pg_catalog.jsonb_typeof(p_contract) <> 'object'
    or not coalesce(
      p_contract->>'stripeAccountId' = 'acct_1U5HWnD2Of3MIt94'
      and p_contract->>'productId' ~ '^prod_[A-Za-z0-9]+$'
      and p_contract->>'priceId' ~ '^price_[A-Za-z0-9]+$'
      and p_contract->>'offerVersion' = 'STITCHPROOF-PROJECT-V1'
      and p_contract->'amountCents' = '900'::jsonb and p_contract->>'currency' = 'usd'
      and ((p_contract->>'taxMode' = 'none' and p_contract->>'taxBehavior' = 'not_applicable')
        or (p_contract->>'taxMode' = 'automatic' and p_contract->>'taxBehavior' in ('inclusive', 'exclusive'))), false)
    or (select pg_catalog.count(*) from pg_catalog.jsonb_object_keys(p_contract)) <> 8
  then raise exception 'Invalid purchase reservation'; end if;

  insert into public.stitchproof_purchase_projects (project_id, stripe_livemode, claim_sha256)
    values (p_project_id, p_stripe_livemode, p_claim_sha256)
    on conflict (project_id, stripe_livemode) do nothing;
  select * into v_project from public.stitchproof_purchase_projects
    where project_id = p_project_id and stripe_livemode = p_stripe_livemode for update;
  if v_project.claim_sha256 <> p_claim_sha256 then return null; end if;
  if v_project.active_attempt_id is not null then
    select * into v_attempt from public.stitchproof_purchase_attempts where id = v_project.active_attempt_id;
    if v_attempt.status <> 'expired' or p_expected_attempt_id is distinct from v_attempt.id then
      return public.stitchproof_purchase_snapshot(p_project_id, p_stripe_livemode, v_attempt.id);
    end if;
    -- Only a provider-verified, attached, unpaid expired session is renewable.
    if v_attempt.stripe_checkout_session_id is null or v_attempt.last_verified_at is null then return null; end if;
  elsif p_expected_attempt_id is not null then return null;
  end if;

  insert into public.stitchproof_purchase_attempts (
    id, project_id, stripe_livemode, stripe_account_id, product_id, price_id, offer_version,
    amount_cents, currency, tax_mode, tax_behavior
  ) values (
    p_attempt_id, p_project_id, p_stripe_livemode, p_contract->>'stripeAccountId',
    p_contract->>'productId', p_contract->>'priceId', p_contract->>'offerVersion',
    900, 'usd', p_contract->>'taxMode', p_contract->>'taxBehavior'
  );
  update public.stitchproof_purchase_projects set active_attempt_id = p_attempt_id
    where project_id = p_project_id and stripe_livemode = p_stripe_livemode;
  return public.stitchproof_purchase_snapshot(p_project_id, p_stripe_livemode, p_attempt_id);
end;
$$;

create function public.stitchproof_purchase_attach_checkout(
  p_project_id uuid, p_stripe_livemode boolean, p_attempt_id uuid,
  p_session_id text, p_payment_intent_id text, p_expires_at timestamptz
) returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare v_changed integer;
begin
  if p_stripe_livemode is null or p_session_id is null or p_expires_at is null
    or p_session_id !~ (case when p_stripe_livemode then '^cs_live_[A-Za-z0-9]+$' else '^cs_test_[A-Za-z0-9]+$' end)
    or (p_payment_intent_id is not null and p_payment_intent_id !~ '^pi_[A-Za-z0-9]+$')
  then return false; end if;
  update public.stitchproof_purchase_attempts set
    stripe_checkout_session_id = p_session_id,
    stripe_payment_intent_id = coalesce(stripe_payment_intent_id, p_payment_intent_id),
    checkout_expires_at = coalesce(checkout_expires_at, p_expires_at),
    status = case when status = 'creating' then 'pending' else status end
  where id = p_attempt_id and project_id = p_project_id and stripe_livemode = p_stripe_livemode
    and (stripe_checkout_session_id is null or stripe_checkout_session_id = p_session_id)
    and (stripe_payment_intent_id is null or p_payment_intent_id is null or stripe_payment_intent_id = p_payment_intent_id);
  get diagnostics v_changed = row_count;
  return v_changed = 1;
end;
$$;

create function public.stitchproof_purchase_record_verification(
  p_project_id uuid, p_stripe_livemode boolean, p_attempt_id uuid, p_session_id text,
  p_payment_intent_id text, p_status text, p_verified_at timestamptz
) returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare v_attempt public.stitchproof_purchase_attempts%rowtype;
begin
  if p_stripe_livemode is null or p_verified_at is null or p_session_id is null or p_status is null
    or p_status not in ('pending', 'paid', 'expired', 'refunded', 'disputed', 'unavailable')
    or (p_payment_intent_id is not null and p_payment_intent_id !~ '^pi_[A-Za-z0-9]+$')
    or (p_status in ('paid', 'refunded', 'disputed') and p_payment_intent_id is null)
  then return false; end if;
  select * into v_attempt from public.stitchproof_purchase_attempts
    where id = p_attempt_id and project_id = p_project_id and stripe_livemode = p_stripe_livemode for update;
  if not found or v_attempt.stripe_checkout_session_id is distinct from p_session_id
    or (v_attempt.stripe_payment_intent_id is not null and p_payment_intent_id is not null
      and v_attempt.stripe_payment_intent_id <> p_payment_intent_id) then return false; end if;
  -- A caller must not authorize from a paid observation discarded behind a
  -- newer refund/dispute. Equal-time conflicting observations also fail closed;
  -- equal-time identical retries remain idempotent.
  if v_attempt.last_verified_at is not null and (v_attempt.last_verified_at > p_verified_at
    or (v_attempt.last_verified_at = p_verified_at and v_attempt.status <> p_status)) then return false; end if;
  update public.stitchproof_purchase_attempts set status = p_status,
    stripe_payment_intent_id = coalesce(stripe_payment_intent_id, p_payment_intent_id), last_verified_at = p_verified_at
    where id = p_attempt_id;
  return true;
end;
$$;

create function public.stitchproof_purchase_has_event(p_event_id text, p_stripe_livemode boolean)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists(select 1 from public.stitchproof_purchase_webhook_events
    where event_id = p_event_id and stripe_livemode = p_stripe_livemode);
$$;

-- Event receipt and the fresh financial observation commit together. Event
-- payload order is not used to decide entitlement; handlers re-read Stripe.
create function public.stitchproof_purchase_record_event(
  p_event_id text, p_event_type text, p_project_id uuid, p_stripe_livemode boolean,
  p_attempt_id uuid, p_session_id text, p_payment_intent_id text, p_status text, p_verified_at timestamptz
) returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare v_inserted integer;
begin
  insert into public.stitchproof_purchase_webhook_events (event_id, stripe_livemode, project_id, attempt_id, event_type)
    values (p_event_id, p_stripe_livemode, p_project_id, p_attempt_id, p_event_type)
    on conflict (event_id, stripe_livemode) do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then return false; end if;
  if not public.stitchproof_purchase_record_verification(p_project_id, p_stripe_livemode, p_attempt_id,
    p_session_id, p_payment_intent_id, p_status, p_verified_at)
  then raise exception 'Purchase verification could not be recorded'; end if;
  return true;
end;
$$;

revoke all on function public.stitchproof_purchase_snapshot(uuid, boolean, uuid) from public, anon, authenticated, service_role;
revoke all on function public.stitchproof_purchase_schema_version() from public, anon, authenticated;
revoke all on function public.stitchproof_purchase_load(uuid, text, boolean) from public, anon, authenticated;
revoke all on function public.stitchproof_purchase_load_webhook(uuid, uuid, text, boolean) from public, anon, authenticated;
revoke all on function public.stitchproof_purchase_reserve(uuid, text, boolean, uuid, uuid, jsonb) from public, anon, authenticated;
revoke all on function public.stitchproof_purchase_attach_checkout(uuid, boolean, uuid, text, text, timestamptz) from public, anon, authenticated;
revoke all on function public.stitchproof_purchase_record_verification(uuid, boolean, uuid, text, text, text, timestamptz) from public, anon, authenticated;
revoke all on function public.stitchproof_purchase_has_event(text, boolean) from public, anon, authenticated;
revoke all on function public.stitchproof_purchase_record_event(text, text, uuid, boolean, uuid, text, text, text, timestamptz) from public, anon, authenticated;

grant execute on function public.stitchproof_purchase_schema_version() to service_role;
grant execute on function public.stitchproof_purchase_load(uuid, text, boolean) to service_role;
grant execute on function public.stitchproof_purchase_load_webhook(uuid, uuid, text, boolean) to service_role;
grant execute on function public.stitchproof_purchase_reserve(uuid, text, boolean, uuid, uuid, jsonb) to service_role;
grant execute on function public.stitchproof_purchase_attach_checkout(uuid, boolean, uuid, text, text, timestamptz) to service_role;
grant execute on function public.stitchproof_purchase_record_verification(uuid, boolean, uuid, text, text, text, timestamptz) to service_role;
grant execute on function public.stitchproof_purchase_has_event(text, boolean) to service_role;
grant execute on function public.stitchproof_purchase_record_event(text, text, uuid, boolean, uuid, text, text, text, timestamptz) to service_role;
