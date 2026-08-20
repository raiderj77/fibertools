-- Designer Pattern Preflight operational hardening.
--
-- UNAPPLIED DRAFT / BASELINE REQUIRED: the production migration ledger has not
-- been verified from this worktree. Before applying this file anywhere, first
-- reconcile that environment's remote migration history and confirm the base
-- 20260816 migration is present exactly once. This file has not been applied
-- to test or live Supabase by this change.
--
-- This migration is intentionally provider-neutral. It records privacy-safe work
-- items in a durable outbox, but it does not choose or configure an email,
-- paging, or job-scheduling provider.
--
-- PHASE 1 COMPATIBILITY: this additive phase deliberately leaves legacy NULL
-- modes and the v1 webhook RPC usable so the current deployment is not broken.
-- It does not by itself enforce database-wide mode isolation. After mode-aware
-- code is deployed everywhere, the owner must separately run the reviewed SQL
-- in docs/designer-preflight-mode-enforcement-phase2.sql.

begin;

alter table public.designer_preflight_submissions
  add column if not exists stripe_livemode boolean,
  add column if not exists checkout_expires_at timestamptz,
  add column if not exists owner_acknowledged_at timestamptz,
  add column if not exists working_access_confirmed_at timestamptz,
  add column if not exists fulfillment_due_at timestamptz,
  add column if not exists amount_paid_cents integer,
  add column if not exists amount_refunded_cents integer,
  add column if not exists refunded_at timestamptz,
  add column if not exists disputed_at timestamptz,
  add column if not exists stripe_dispute_id text,
  add column if not exists stripe_dispute_status text,
  add column if not exists payment_failure_code text,
  add column if not exists adverse_case_resolved_at timestamptz,
  add column if not exists adverse_case_resolution text,
  add column if not exists fulfillment_status_before_adverse_resolution text,
  add column if not exists anonymized_at timestamptz,
  add column if not exists anonymization_reason text;

-- Existing rows predate explicit mode recording. Do not guess whether those
-- rows were test or live. New application code always supplies the mode.
comment on column public.designer_preflight_submissions.stripe_livemode is
  'NULL only for legacy rows whose Stripe mode was not recorded; never infer or backfill without provider evidence.';

-- These fields must be nullable so the published retention promise can be
-- fulfilled without deleting the minimum payment/audit record.
alter table public.designer_preflight_submissions
  alter column customer_name drop not null,
  alter column customer_email drop not null,
  alter column pattern_title drop not null,
  alter column terminology drop not null,
  alter column intended_skill_level drop not null,
  alter column pattern_type drop not null,
  alter column secure_share_url drop not null,
  alter column checkout_url drop not null;

alter table public.designer_preflight_submissions
  drop constraint if exists designer_preflight_submissions_status_check,
  drop constraint if exists designer_preflight_submissions_payment_status_check,
  drop constraint if exists designer_preflight_submissions_amount_paid_cents_check,
  drop constraint if exists designer_preflight_submissions_amount_refunded_cents_check,
  drop constraint if exists designer_preflight_submissions_refund_not_overpaid_check,
  drop constraint if exists designer_preflight_submissions_anonymization_reason_check,
  drop constraint if exists designer_preflight_submissions_adverse_resolution_check,
  drop constraint if exists designer_preflight_submissions_anonymized_pii_check;

alter table public.designer_preflight_submissions
  add constraint designer_preflight_submissions_status_check
    check (status in ('draft', 'awaiting_payment', 'paid', 'in_review', 'report_ready', 'delivered', 'refunded', 'disputed', 'cancelled', 'closed')),
  add constraint designer_preflight_submissions_payment_status_check
    check (payment_status in ('pending', 'paid', 'expired', 'failed', 'partially_refunded', 'refunded', 'disputed', 'dispute_won', 'dispute_lost')),
  add constraint designer_preflight_submissions_amount_paid_cents_check
    check (amount_paid_cents is null or amount_paid_cents >= 0),
  add constraint designer_preflight_submissions_amount_refunded_cents_check
    check (amount_refunded_cents is null or amount_refunded_cents >= 0),
  add constraint designer_preflight_submissions_refund_not_overpaid_check
    check (
      amount_paid_cents is null
      or amount_refunded_cents is null
      or amount_refunded_cents <= amount_paid_cents
    ),
  add constraint designer_preflight_submissions_anonymization_reason_check
    check (anonymization_reason is null or anonymization_reason in ('retention_due', 'abandoned_checkout', 'owner_request')),
  add constraint designer_preflight_submissions_adverse_resolution_check
    check (
      (
        adverse_case_resolved_at is null
        and adverse_case_resolution is null
        and fulfillment_status_before_adverse_resolution is null
      )
      or (
        adverse_case_resolved_at is not null
        and adverse_case_resolution in ('cancelled', 'fulfilled_before_adverse_event')
        and (
          (
            adverse_case_resolution = 'cancelled'
            and fulfillment_status_before_adverse_resolution in ('awaiting_payment', 'paid', 'in_review', 'report_ready')
          )
          or (
            adverse_case_resolution = 'fulfilled_before_adverse_event'
            and fulfillment_status_before_adverse_resolution is null
          )
        )
      )
    ),
  add constraint designer_preflight_submissions_anonymized_pii_check
    check (
      anonymized_at is null
      or (
        anonymization_reason is not null
        and customer_name is null
        and customer_email is null
        and pattern_title is null
        and terminology is null
        and intended_skill_level is null
        and pattern_type is null
        and customer_comments is null
        and secure_share_url is null
        and checkout_url is null
        and internal_notes is null
      )
    );

create index if not exists designer_preflight_submissions_mode_queue_idx
  on public.designer_preflight_submissions (stripe_livemode, status, paid_at)
  where anonymized_at is null;
create index if not exists designer_preflight_submissions_fulfillment_due_idx
  on public.designer_preflight_submissions (stripe_livemode, fulfillment_due_at)
  where fulfillment_due_at is not null and anonymized_at is null;

alter table public.designer_preflight_stripe_events
  alter column checkout_session_id drop not null,
  add column if not exists stripe_livemode boolean,
  add column if not exists stripe_object_id text,
  add column if not exists payment_state text,
  add column if not exists amount_paid_cents integer,
  add column if not exists amount_refunded_cents integer,
  add column if not exists dispute_id text,
  add column if not exists dispute_status text;

comment on column public.designer_preflight_stripe_events.stripe_livemode is
  'NULL only for legacy events; all v2 webhook processing records test/live explicitly.';

alter table public.designer_preflight_stripe_events
  drop constraint if exists designer_preflight_stripe_events_submission_id_fkey,
  add constraint designer_preflight_stripe_events_submission_id_fkey
    foreign key (submission_id) references public.designer_preflight_submissions(id) on delete restrict;

create table if not exists public.designer_preflight_outbox (
  id uuid primary key default gen_random_uuid(),
  dedupe_key text not null unique check (dedupe_key ~ '^[a-z0-9:_-]{3,200}$'),
  event_type text not null check (event_type ~ '^[a-z][a-z0-9_]{2,63}$'),
  submission_id uuid not null references public.designer_preflight_submissions(id) on delete restrict,
  stripe_livemode boolean not null,
  available_at timestamptz not null default pg_catalog.now(),
  claimed_at timestamptz,
  claimed_by text,
  lease_token uuid,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  delivered_at timestamptz,
  last_error_code text check (last_error_code is null or last_error_code ~ '^[a-z0-9_.-]{1,80}$'),
  created_at timestamptz not null default pg_catalog.now()
);

comment on table public.designer_preflight_outbox is
  'Provider-neutral, privacy-safe operational events. Never add customer names, email, comments, share URLs, pattern titles, or provider error messages.';

create index if not exists designer_preflight_outbox_available_idx
  on public.designer_preflight_outbox (available_at, created_at)
  where delivered_at is null;

alter table public.designer_preflight_outbox enable row level security;
revoke all on table public.designer_preflight_outbox from public, anon, authenticated, service_role;

create or replace function public.enqueue_designer_preflight_outbox(
  p_dedupe_key text,
  p_event_type text,
  p_submission_id uuid,
  p_stripe_livemode boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_rows integer;
begin
  if p_dedupe_key is null or p_dedupe_key !~ '^[a-z0-9:_-]{3,200}$' then
    raise exception 'Invalid outbox dedupe key';
  end if;
  if p_event_type is null or p_event_type !~ '^[a-z][a-z0-9_]{2,63}$' then
    raise exception 'Invalid outbox event type';
  end if;
  if p_submission_id is null then
    raise exception 'Submission ID is required';
  end if;
  if p_stripe_livemode is null then
    raise exception 'Stripe mode is required';
  end if;

  insert into public.designer_preflight_outbox (
    dedupe_key, event_type, submission_id, stripe_livemode, available_at
  ) values (
    p_dedupe_key, p_event_type, p_submission_id, p_stripe_livemode, pg_catalog.now()
  ) on conflict (dedupe_key) do nothing;

  get diagnostics inserted_rows = row_count;
  return inserted_rows = 1;
end;
$$;

create or replace function public.save_designer_preflight_checkout(
  p_submission_id uuid,
  p_checkout_session_id text,
  p_checkout_url text,
  p_stripe_livemode boolean,
  p_checkout_expires_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_rows integer;
begin
  if p_submission_id is null then
    raise exception 'Submission ID is required';
  end if;
  if p_stripe_livemode is null then
    raise exception 'Stripe mode is required';
  end if;
  if p_checkout_session_id is null
     or p_checkout_url is null
     or p_checkout_url !~ '^https://checkout\.stripe\.com/' then
    raise exception 'Invalid checkout session';
  end if;
  if p_checkout_expires_at is null
     or p_checkout_expires_at <= pg_catalog.now()
     or p_checkout_expires_at > pg_catalog.now() + interval '25 hours' then
    raise exception 'Invalid checkout expiration';
  end if;

  update public.designer_preflight_submissions
  set stripe_checkout_session_id = p_checkout_session_id,
      checkout_url = p_checkout_url,
      checkout_expires_at = p_checkout_expires_at,
      payment_status = 'pending'
  where id = p_submission_id
    and payment_status = 'pending'
    and stripe_livemode = p_stripe_livemode
    and (
      (stripe_checkout_session_id is null and checkout_url is null)
      or (
        stripe_checkout_session_id = p_checkout_session_id
        and checkout_url = p_checkout_url
      )
    );

  get diagnostics updated_rows = row_count;
  if updated_rows <> 1 then
    raise exception 'Invalid or mismatched preflight checkout';
  end if;
  return true;
end;
$$;

-- Transitional phase-1 compatibility for the currently deployed webhook.
-- This v1 boundary cannot enforce test/live mode because its original
-- signature has no mode argument. Keep it null-safe until owner-gated phase 2
-- revokes service_role execution after every writer uses v2.
create or replace function public.process_designer_preflight_stripe_event(
  p_event_id text,
  p_event_type text,
  p_submission_id uuid,
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_payment_status text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_rows integer;
  transitioned_rows integer;
begin
  if p_event_id is null
     or char_length(p_event_id) < 3
     or char_length(p_event_id) > 255
     or p_event_type is null
     or char_length(p_event_type) < 3
     or char_length(p_event_type) > 255
     or p_submission_id is null
     or p_checkout_session_id is null
     or char_length(p_checkout_session_id) < 3 then
    raise exception 'Invalid Stripe event identity';
  end if;
  if p_payment_status is null or p_payment_status not in ('paid', 'expired') then
    raise exception 'Unsupported payment status';
  end if;

  insert into public.designer_preflight_stripe_events (
    stripe_event_id, event_type, submission_id, checkout_session_id, payment_intent_id
  ) values (
    p_event_id, p_event_type, p_submission_id, p_checkout_session_id, p_payment_intent_id
  ) on conflict (stripe_event_id) do nothing;

  get diagnostics inserted_rows = row_count;
  if inserted_rows = 0 then
    return false;
  end if;

  if p_payment_status = 'paid' then
    update public.designer_preflight_submissions
    set payment_status = case
          when payment_status in ('partially_refunded', 'refunded', 'disputed', 'dispute_won', 'dispute_lost')
            then payment_status
          else 'paid'
        end,
        status = case
          when status = 'awaiting_payment'
               and payment_status not in ('expired', 'failed', 'refunded', 'disputed', 'dispute_won', 'dispute_lost')
            then 'paid'
          else status
        end,
        stripe_checkout_session_id = p_checkout_session_id,
        stripe_payment_intent_id = coalesce(p_payment_intent_id, stripe_payment_intent_id),
        paid_at = coalesce(paid_at, pg_catalog.now())
    where id = p_submission_id
      and stripe_checkout_session_id = p_checkout_session_id
      and payment_status not in ('expired', 'failed');
  else
    update public.designer_preflight_submissions
    set payment_status = 'expired'
    where id = p_submission_id
      and stripe_checkout_session_id = p_checkout_session_id
      and payment_status = 'pending';
  end if;

  get diagnostics transitioned_rows = row_count;
  if transitioned_rows <> 1 then
    raise exception 'Invalid or mismatched preflight submission';
  end if;
  return true;
end;
$$;

create or replace function public.process_designer_preflight_stripe_event_v2(
  p_event_id text,
  p_event_type text,
  p_submission_id uuid,
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_stripe_object_id text,
  p_stripe_livemode boolean,
  p_payment_state text,
  p_amount_paid_cents integer default null,
  p_amount_refunded_cents integer default null,
  p_dispute_id text default null,
  p_dispute_status text default null,
  p_failure_code text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_rows integer;
  transitioned_rows integer := 0;
  current_submission public.designer_preflight_submissions%rowtype;
  resulting_payment_status text;
  outbox_event_type text;
  outbox_dedupe_key text;
begin
  if p_event_id is null
     or char_length(p_event_id) < 3
     or char_length(p_event_id) > 255
     or p_event_type is null
     or char_length(p_event_type) < 3
     or char_length(p_event_type) > 255 then
    raise exception 'Invalid Stripe event identity';
  end if;
  if p_submission_id is null or p_stripe_object_id is null or char_length(p_stripe_object_id) < 3 then
    raise exception 'Invalid Stripe event object';
  end if;
  if p_stripe_livemode is null then
    raise exception 'Stripe mode is required';
  end if;
  if p_payment_state is null
     or p_payment_state not in ('paid', 'expired', 'failed', 'partially_refunded', 'refunded', 'disputed', 'dispute_won', 'dispute_lost') then
    raise exception 'Unsupported payment state';
  end if;
  if p_payment_state in ('paid', 'expired', 'failed')
     and (p_checkout_session_id is null or char_length(p_checkout_session_id) < 3) then
    raise exception 'Checkout session ID is required';
  end if;
  if p_payment_state in ('partially_refunded', 'refunded', 'disputed', 'dispute_won', 'dispute_lost')
     and (p_payment_intent_id is null or char_length(p_payment_intent_id) < 3) then
    raise exception 'Payment intent ID is required';
  end if;
  if p_amount_paid_cents is not null and p_amount_paid_cents < 0 then
    raise exception 'Invalid paid amount';
  end if;
  if p_amount_refunded_cents is not null and p_amount_refunded_cents < 0 then
    raise exception 'Invalid refunded amount';
  end if;
  if p_payment_state in ('paid', 'partially_refunded', 'refunded')
     and (p_amount_paid_cents is null or p_amount_paid_cents <= 0) then
    raise exception 'Authoritative paid amount is required';
  end if;
  if p_payment_state in ('partially_refunded', 'refunded')
     and (
       p_amount_refunded_cents is null
       or p_amount_refunded_cents <= 0
       or p_amount_refunded_cents > p_amount_paid_cents
     ) then
    raise exception 'Authoritative refunded amount is required';
  end if;
  if p_payment_state in ('disputed', 'dispute_won', 'dispute_lost')
     and (
       p_dispute_id is null
       or char_length(p_dispute_id) < 3
       or p_dispute_status is null
       or p_dispute_status not in (
         'lost', 'needs_response', 'prevented', 'under_review',
         'warning_closed', 'warning_needs_response', 'warning_under_review', 'won'
       )
     ) then
    raise exception 'Valid dispute identity and status are required';
  end if;
  if p_payment_state = 'failed' and p_failure_code is null then
    raise exception 'Failure code is required';
  end if;
  if p_failure_code is not null and p_failure_code !~ '^[a-z0-9_.-]{1,80}$' then
    raise exception 'Invalid failure code';
  end if;

  select * into current_submission
  from public.designer_preflight_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'Unknown preflight submission';
  end if;
  if current_submission.stripe_livemode is not null
     and current_submission.stripe_livemode <> p_stripe_livemode then
    raise exception 'Stripe mode mismatch';
  end if;
  if p_checkout_session_id is not null
     and current_submission.stripe_checkout_session_id is not null
     and current_submission.stripe_checkout_session_id <> p_checkout_session_id then
    raise exception 'Checkout session mismatch';
  end if;
  if p_payment_intent_id is not null
     and current_submission.stripe_payment_intent_id is not null
     and current_submission.stripe_payment_intent_id <> p_payment_intent_id then
    raise exception 'Payment intent mismatch';
  end if;

  insert into public.designer_preflight_stripe_events (
    stripe_event_id,
    event_type,
    submission_id,
    checkout_session_id,
    payment_intent_id,
    stripe_livemode,
    stripe_object_id,
    payment_state,
    amount_paid_cents,
    amount_refunded_cents,
    dispute_id,
    dispute_status
  ) values (
    p_event_id,
    p_event_type,
    p_submission_id,
    p_checkout_session_id,
    p_payment_intent_id,
    p_stripe_livemode,
    p_stripe_object_id,
    p_payment_state,
    p_amount_paid_cents,
    p_amount_refunded_cents,
    p_dispute_id,
    p_dispute_status
  ) on conflict (stripe_event_id) do nothing;

  get diagnostics inserted_rows = row_count;
  if inserted_rows = 0 then
    return false;
  end if;

  if p_payment_state = 'paid' then
    update public.designer_preflight_submissions
    set stripe_livemode = coalesce(stripe_livemode, p_stripe_livemode),
        payment_status = case
          when payment_status in ('expired', 'failed', 'partially_refunded', 'refunded', 'disputed', 'dispute_won', 'dispute_lost') then payment_status
          else 'paid'
        end,
        status = case
          when status = 'awaiting_payment' and payment_status not in ('expired', 'failed', 'partially_refunded', 'refunded', 'disputed', 'dispute_won', 'dispute_lost') then 'paid'
          else status
        end,
        stripe_checkout_session_id = coalesce(p_checkout_session_id, stripe_checkout_session_id),
        stripe_payment_intent_id = coalesce(p_payment_intent_id, stripe_payment_intent_id),
        amount_paid_cents = greatest(coalesce(amount_paid_cents, p_amount_paid_cents), p_amount_paid_cents),
        paid_at = coalesce(paid_at, pg_catalog.now()),
        payment_failure_code = null
    where id = p_submission_id
      and payment_status not in ('expired', 'failed');
    get diagnostics transitioned_rows = row_count;
    outbox_event_type := 'payment_paid';
    outbox_dedupe_key := 'submission:' || p_submission_id::text || ':paid';
  elsif p_payment_state in ('expired', 'failed') then
    update public.designer_preflight_submissions
    set stripe_livemode = coalesce(stripe_livemode, p_stripe_livemode),
        payment_status = p_payment_state,
        status = 'closed',
        stripe_checkout_session_id = coalesce(p_checkout_session_id, stripe_checkout_session_id),
        stripe_payment_intent_id = coalesce(p_payment_intent_id, stripe_payment_intent_id),
        checkout_expires_at = coalesce(checkout_expires_at, pg_catalog.now()),
        retention_delete_by = case
          when retention_delete_by is null or retention_delete_by > pg_catalog.now() + interval '7 days'
            then pg_catalog.now() + interval '7 days'
          else retention_delete_by
        end,
        payment_failure_code = case when p_payment_state = 'failed' then p_failure_code else payment_failure_code end
    where id = p_submission_id and payment_status = 'pending';
    get diagnostics transitioned_rows = row_count;
    outbox_event_type := case when p_payment_state = 'failed' then 'payment_failed' else 'payment_expired' end;
    outbox_dedupe_key := 'submission:' || p_submission_id::text || ':payment:' || p_payment_state;
  elsif p_payment_state = 'partially_refunded' then
    update public.designer_preflight_submissions
    set stripe_livemode = coalesce(stripe_livemode, p_stripe_livemode),
        stripe_payment_intent_id = coalesce(p_payment_intent_id, stripe_payment_intent_id),
        amount_paid_cents = greatest(coalesce(amount_paid_cents, p_amount_paid_cents), p_amount_paid_cents),
        amount_refunded_cents = greatest(coalesce(amount_refunded_cents, p_amount_refunded_cents), p_amount_refunded_cents),
        paid_at = coalesce(paid_at, pg_catalog.now()),
        status = case
          when status = 'awaiting_payment'
               and payment_status not in ('expired', 'failed', 'refunded', 'disputed', 'dispute_won', 'dispute_lost')
            then 'paid'
          else status
        end,
        payment_status = case
          when payment_status in ('expired', 'failed', 'refunded', 'disputed', 'dispute_won', 'dispute_lost') then payment_status
          else 'partially_refunded'
        end
    where id = p_submission_id;
    get diagnostics transitioned_rows = row_count;
    outbox_event_type := 'payment_partially_refunded';
    outbox_dedupe_key := 'submission:' || p_submission_id::text || ':refund:partial:' || p_amount_refunded_cents::text;
  elsif p_payment_state = 'refunded' then
    update public.designer_preflight_submissions
    set stripe_livemode = coalesce(stripe_livemode, p_stripe_livemode),
        stripe_payment_intent_id = coalesce(p_payment_intent_id, stripe_payment_intent_id),
        amount_paid_cents = greatest(coalesce(amount_paid_cents, p_amount_paid_cents), p_amount_paid_cents),
        amount_refunded_cents = greatest(coalesce(amount_refunded_cents, p_amount_refunded_cents), p_amount_refunded_cents),
        paid_at = coalesce(paid_at, pg_catalog.now()),
        payment_status = 'refunded',
        status = case
          when status in ('awaiting_payment', 'paid') then 'refunded'
          else status
        end,
        refunded_at = coalesce(refunded_at, pg_catalog.now()),
        retention_delete_by = case
          when status in ('awaiting_payment', 'paid')
            then coalesce(retention_delete_by, pg_catalog.now() + interval '30 days')
          else retention_delete_by
        end
    where id = p_submission_id;
    get diagnostics transitioned_rows = row_count;
    outbox_event_type := 'payment_refunded';
    outbox_dedupe_key := 'submission:' || p_submission_id::text || ':payment:refunded';
  elsif p_payment_state = 'disputed' then
    update public.designer_preflight_submissions
    set stripe_livemode = coalesce(stripe_livemode, p_stripe_livemode),
        stripe_payment_intent_id = coalesce(p_payment_intent_id, stripe_payment_intent_id),
        payment_status = 'disputed',
        paid_at = coalesce(paid_at, pg_catalog.now()),
        stripe_dispute_id = p_dispute_id,
        stripe_dispute_status = p_dispute_status,
        disputed_at = coalesce(disputed_at, pg_catalog.now())
    where id = p_submission_id
      and payment_status not in ('refunded', 'dispute_won', 'dispute_lost');
    get diagnostics transitioned_rows = row_count;
    outbox_event_type := 'payment_disputed';
    outbox_dedupe_key := 'submission:' || p_submission_id::text || ':dispute:' || p_dispute_status;
  elsif p_payment_state = 'dispute_won' then
    update public.designer_preflight_submissions
    set stripe_livemode = coalesce(stripe_livemode, p_stripe_livemode),
        stripe_payment_intent_id = coalesce(p_payment_intent_id, stripe_payment_intent_id),
        payment_status = 'dispute_won',
        paid_at = coalesce(paid_at, pg_catalog.now()),
        stripe_dispute_id = p_dispute_id,
        stripe_dispute_status = p_dispute_status
    where id = p_submission_id
      and payment_status not in ('refunded', 'dispute_won', 'dispute_lost');
    get diagnostics transitioned_rows = row_count;
    outbox_event_type := 'payment_dispute_won';
    outbox_dedupe_key := 'submission:' || p_submission_id::text || ':dispute:' || p_dispute_status;
  else
    update public.designer_preflight_submissions
    set stripe_livemode = coalesce(stripe_livemode, p_stripe_livemode),
        stripe_payment_intent_id = coalesce(p_payment_intent_id, stripe_payment_intent_id),
        payment_status = 'dispute_lost',
        paid_at = coalesce(paid_at, pg_catalog.now()),
        stripe_dispute_id = p_dispute_id,
        stripe_dispute_status = p_dispute_status
    where id = p_submission_id
      and payment_status not in ('refunded', 'dispute_won', 'dispute_lost');
    get diagnostics transitioned_rows = row_count;
    outbox_event_type := 'payment_dispute_lost';
    outbox_dedupe_key := 'submission:' || p_submission_id::text || ':dispute:' || p_dispute_status;
  end if;

  if transitioned_rows > 0 then
    if p_payment_state in ('paid', 'partially_refunded', 'disputed', 'dispute_won', 'dispute_lost') then
      select payment_status into resulting_payment_status
      from public.designer_preflight_submissions
      where id = p_submission_id;
      if resulting_payment_status <> p_payment_state then
        transitioned_rows := 0;
      end if;
    end if;
  end if;

  if transitioned_rows > 0 then
    if p_payment_state = 'partially_refunded' then
      perform public.enqueue_designer_preflight_outbox(
        'submission:' || p_submission_id::text || ':paid',
        'payment_paid',
        p_submission_id,
        p_stripe_livemode
      );
    end if;
    perform public.enqueue_designer_preflight_outbox(
      outbox_dedupe_key,
      outbox_event_type,
      p_submission_id,
      p_stripe_livemode
    );
  end if;

  return true;
end;
$$;

create or replace function public.acknowledge_designer_preflight_paid_order(
  p_submission_id uuid,
  p_stripe_livemode boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_rows integer;
begin
  if p_submission_id is null or p_stripe_livemode is null then
    raise exception 'Submission ID and Stripe mode are required';
  end if;
  update public.designer_preflight_submissions
  set owner_acknowledged_at = coalesce(owner_acknowledged_at, pg_catalog.now())
  where id = p_submission_id
    and stripe_livemode = p_stripe_livemode
    and payment_status in ('paid', 'partially_refunded')
    and anonymized_at is null;
  get diagnostics updated_rows = row_count;
  return updated_rows = 1;
end;
$$;

create or replace function public.start_designer_preflight_review(
  p_submission_id uuid,
  p_stripe_livemode boolean,
  p_fulfillment_due_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_rows integer;
begin
  if p_submission_id is null or p_stripe_livemode is null then
    raise exception 'Submission ID and Stripe mode are required';
  end if;
  if p_fulfillment_due_at is null
     or p_fulfillment_due_at <= pg_catalog.now()
     or p_fulfillment_due_at > pg_catalog.now() + interval '30 days' then
    raise exception 'Invalid fulfillment window';
  end if;

  update public.designer_preflight_submissions
  set status = 'in_review',
      owner_acknowledged_at = coalesce(owner_acknowledged_at, pg_catalog.now()),
      working_access_confirmed_at = pg_catalog.now(),
      fulfillment_due_at = p_fulfillment_due_at
  where id = p_submission_id
    and stripe_livemode = p_stripe_livemode
    and status = 'paid'
    and payment_status in ('paid', 'partially_refunded')
    and anonymized_at is null;
  get diagnostics updated_rows = row_count;
  return updated_rows = 1;
end;
$$;

create or replace function public.mark_designer_preflight_report_ready(
  p_submission_id uuid,
  p_stripe_livemode boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_rows integer;
begin
  if p_submission_id is null or p_stripe_livemode is null then
    raise exception 'Submission ID and Stripe mode are required';
  end if;
  update public.designer_preflight_submissions
  set status = 'report_ready'
  where id = p_submission_id
    and stripe_livemode = p_stripe_livemode
    and status = 'in_review'
    and payment_status in ('paid', 'partially_refunded')
    and anonymized_at is null;
  get diagnostics updated_rows = row_count;
  return updated_rows = 1;
end;
$$;

create or replace function public.mark_designer_preflight_delivered(
  p_submission_id uuid,
  p_stripe_livemode boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_rows integer;
begin
  if p_submission_id is null or p_stripe_livemode is null then
    raise exception 'Submission ID and Stripe mode are required';
  end if;
  update public.designer_preflight_submissions
  set status = 'delivered',
      delivered_at = pg_catalog.now(),
      retention_delete_by = pg_catalog.now() + interval '30 days'
  where id = p_submission_id
    and stripe_livemode = p_stripe_livemode
    and status = 'report_ready'
    and payment_status in ('paid', 'partially_refunded')
    and anonymized_at is null;

  get diagnostics updated_rows = row_count;
  if updated_rows = 1 then
    perform public.enqueue_designer_preflight_outbox(
      'submission:' || p_submission_id::text || ':delivered',
      'report_delivered',
      p_submission_id,
      p_stripe_livemode
    );
    return true;
  end if;
  return false;
end;
$$;

create or replace function public.anonymize_designer_preflight_submission(
  p_submission_id uuid,
  p_stripe_livemode boolean,
  p_reason text default 'owner_request',
  p_owner_confirmed boolean default false
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_rows integer;
  current_submission public.designer_preflight_submissions%rowtype;
begin
  if p_submission_id is null then
    raise exception 'Submission ID is required';
  end if;
  if p_reason is null or p_reason not in ('retention_due', 'abandoned_checkout', 'owner_request') then
    raise exception 'Invalid anonymization reason';
  end if;
  if p_stripe_livemode is null then
    raise exception 'Stripe mode is required';
  end if;

  select * into current_submission
  from public.designer_preflight_submissions
  where id = p_submission_id
    and stripe_livemode = p_stripe_livemode
  for update;

  if not found then
    raise exception 'Unknown or mismatched preflight submission';
  end if;
  if current_submission.anonymized_at is not null then
    return false;
  end if;

  if p_reason = 'owner_request' then
    if p_owner_confirmed is not true then
      raise exception 'Owner confirmation is required';
    end if;
    if current_submission.status not in ('delivered', 'refunded', 'cancelled', 'closed') then
      raise exception 'Active preflight work must be resolved before owner-request anonymization';
    end if;
  elsif p_reason = 'abandoned_checkout' then
    if not (
      (
        current_submission.status = 'closed'
        and current_submission.payment_status in ('expired', 'failed')
        and current_submission.paid_at is null
        and current_submission.retention_delete_by is not null
        and current_submission.retention_delete_by <= pg_catalog.now()
      )
      or (
        current_submission.status = 'awaiting_payment'
        and current_submission.payment_status = 'pending'
        and current_submission.paid_at is null
        and current_submission.stripe_checkout_session_id is null
        and current_submission.checkout_url is null
        and current_submission.created_at <= pg_catalog.now() - interval '7 days'
      )
    ) then
      raise exception 'Submission is not a verified or safely orphaned abandoned checkout';
    end if;
  elsif current_submission.retention_delete_by is null
        or current_submission.retention_delete_by > pg_catalog.now() then
    raise exception 'Retention deadline is not due';
  elsif current_submission.status not in ('delivered', 'refunded', 'cancelled', 'closed') then
    raise exception 'Active preflight work is not retention eligible';
  end if;

  update public.designer_preflight_submissions
  set customer_name = null,
      customer_email = null,
      pattern_title = null,
      terminology = null,
      intended_skill_level = null,
      pattern_type = null,
      customer_comments = null,
      secure_share_url = null,
      checkout_url = null,
      internal_notes = null,
      anonymized_at = coalesce(anonymized_at, pg_catalog.now()),
      anonymization_reason = coalesce(anonymization_reason, p_reason)
  where id = p_submission_id
    and stripe_livemode = p_stripe_livemode
    and anonymized_at is null;

  get diagnostics updated_rows = row_count;
  if updated_rows = 1 then
    perform public.enqueue_designer_preflight_outbox(
      'retention:' || p_submission_id::text,
      'retention_anonymized',
      p_submission_id,
      p_stripe_livemode
    );
    return true;
  end if;
  return false;
end;
$$;

create or replace function public.resolve_designer_preflight_adverse_case(
  p_submission_id uuid,
  p_stripe_livemode boolean,
  p_resolution text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_rows integer;
begin
  if p_submission_id is null or p_stripe_livemode is null then
    raise exception 'Submission ID and Stripe mode are required';
  end if;
  if p_resolution is null or p_resolution not in ('cancelled', 'fulfilled_before_adverse_event') then
    raise exception 'Invalid adverse-case resolution';
  end if;

  update public.designer_preflight_submissions
  set fulfillment_status_before_adverse_resolution = case
        when p_resolution = 'cancelled'
             and status in ('awaiting_payment', 'paid', 'in_review', 'report_ready')
          then status
        else fulfillment_status_before_adverse_resolution
      end,
      status = case
        when p_resolution = 'cancelled'
             and status in ('awaiting_payment', 'paid', 'in_review', 'report_ready')
          then 'cancelled'
        else status
      end,
      adverse_case_resolved_at = pg_catalog.now(),
      adverse_case_resolution = p_resolution,
      retention_delete_by = case
        when retention_delete_by is null or retention_delete_by > pg_catalog.now() + interval '30 days'
          then pg_catalog.now() + interval '30 days'
        else retention_delete_by
      end
  where id = p_submission_id
    and stripe_livemode = p_stripe_livemode
    and payment_status in ('refunded', 'dispute_won', 'dispute_lost')
    and (
      (p_resolution = 'cancelled' and status in ('awaiting_payment', 'paid', 'in_review', 'report_ready'))
      or (p_resolution = 'fulfilled_before_adverse_event' and status = 'delivered')
    )
    and adverse_case_resolved_at is null
    and anonymized_at is null;

  get diagnostics updated_rows = row_count;
  if updated_rows = 1 then
    perform public.enqueue_designer_preflight_outbox(
      'submission:' || p_submission_id::text || ':adverse-resolved',
      'adverse_case_resolved',
      p_submission_id,
      p_stripe_livemode
    );
    return true;
  end if;
  return false;
end;
$$;

create or replace function public.run_designer_preflight_retention(
  p_stripe_livemode boolean,
  p_limit integer default 100
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  abandoned_scheduled integer := 0;
  delivered_scheduled integer := 0;
  orphan_anonymized_count integer := 0;
  anonymized_count integer := 0;
  remaining_limit integer := 0;
  last_rows integer := 0;
  anonymized_row record;
  effective_now constant timestamptz := pg_catalog.now();
begin
  if p_stripe_livemode is null then
    raise exception 'Stripe mode is required';
  end if;
  if p_limit is null or p_limit < 1 or p_limit > 500 then
    raise exception 'Invalid retention batch size';
  end if;

  -- A row that is still pending but has no stored Stripe session or Checkout
  -- URL after seven days is a safe pre-session/save-failure orphan. This does
  -- not infer or alter provider payment state, and session-linked rows are
  -- deliberately excluded from this clock-based privacy cleanup.
  for anonymized_row in
    select id, stripe_livemode
    from public.designer_preflight_submissions
    where stripe_livemode = p_stripe_livemode
      and status = 'awaiting_payment'
      and payment_status = 'pending'
      and paid_at is null
      and stripe_checkout_session_id is null
      and checkout_url is null
      and created_at <= effective_now - interval '7 days'
      and anonymized_at is null
    order by created_at, id
    limit p_limit
    for update skip locked
  loop
    if public.anonymize_designer_preflight_submission(
      anonymized_row.id,
      anonymized_row.stripe_livemode,
      'abandoned_checkout',
      false
    ) then
      orphan_anonymized_count := orphan_anonymized_count + 1;
      anonymized_count := anonymized_count + 1;
    end if;
  end loop;

  remaining_limit := p_limit - orphan_anonymized_count;

  update public.designer_preflight_submissions
  set retention_delete_by = effective_now + interval '7 days'
  where stripe_livemode = p_stripe_livemode
    and payment_status in ('expired', 'failed')
    and paid_at is null
    and retention_delete_by is null
    and anonymized_at is null;
  get diagnostics last_rows = row_count;
  abandoned_scheduled := last_rows;

  update public.designer_preflight_submissions
  set retention_delete_by = delivered_at + interval '30 days'
  where stripe_livemode = p_stripe_livemode
    and status = 'delivered'
    and delivered_at is not null
    and retention_delete_by is null
    and anonymized_at is null;
  get diagnostics delivered_scheduled = row_count;

  for anonymized_row in
    with due as (
      select id
      from public.designer_preflight_submissions
      where stripe_livemode = p_stripe_livemode
        and retention_delete_by <= effective_now
        and anonymized_at is null
        and (
          (
            status in ('delivered', 'refunded', 'cancelled', 'closed')
            and ((paid_at is null and payment_status in ('expired', 'failed')) or paid_at is not null)
          )
        )
      order by retention_delete_by, id
      limit remaining_limit
      for update skip locked
    )
    update public.designer_preflight_submissions as submissions
    set customer_name = null,
        customer_email = null,
        pattern_title = null,
        terminology = null,
        intended_skill_level = null,
        pattern_type = null,
        customer_comments = null,
        secure_share_url = null,
        checkout_url = null,
        internal_notes = null,
        anonymized_at = effective_now,
        anonymization_reason = case when paid_at is null then 'abandoned_checkout' else 'retention_due' end
    from due
    where submissions.id = due.id
    returning submissions.id, submissions.stripe_livemode
  loop
    anonymized_count := anonymized_count + 1;
    perform public.enqueue_designer_preflight_outbox(
      'retention:' || anonymized_row.id::text,
      'retention_anonymized',
      anonymized_row.id,
      anonymized_row.stripe_livemode
    );
  end loop;

  return pg_catalog.jsonb_build_object(
    'abandoned_scheduled', abandoned_scheduled,
    'delivered_scheduled', delivered_scheduled,
    'orphan_anonymized', orphan_anonymized_count,
    'anonymized', anonymized_count
  );
end;
$$;

create or replace function public.enqueue_designer_preflight_watchdog_events(
  p_stripe_livemode boolean
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_rows integer := 0;
  last_rows integer := 0;
  effective_now constant timestamptz := pg_catalog.now();
  daily_key text := pg_catalog.to_char(effective_now at time zone 'UTC', 'YYYY-MM-DD');
begin
  if p_stripe_livemode is null then
    raise exception 'Stripe mode is required';
  end if;

  -- Local clock time is only a reconciliation signal. Only a verified Stripe
  -- expired/failed webhook may transition a pending payment to a terminal state.
  insert into public.designer_preflight_outbox (
    dedupe_key, event_type, submission_id, stripe_livemode, available_at
  )
  select 'watchdog:' || submissions.id::text || ':checkout:' || daily_key,
         'checkout_reconciliation_due',
         submissions.id,
         submissions.stripe_livemode,
         effective_now
  from public.designer_preflight_submissions as submissions
  where submissions.stripe_livemode = p_stripe_livemode
    and submissions.status = 'awaiting_payment'
    and submissions.payment_status = 'pending'
    and submissions.paid_at is null
    and submissions.anonymized_at is null
    and (
      submissions.checkout_expires_at <= effective_now
      or (submissions.checkout_expires_at is null and submissions.created_at <= effective_now - interval '48 hours')
    )
  on conflict (dedupe_key) do nothing;
  get diagnostics inserted_rows = row_count;

  insert into public.designer_preflight_outbox (
    dedupe_key, event_type, submission_id, stripe_livemode, available_at
  )
  select 'watchdog:' || submissions.id::text || ':paid:' || daily_key,
         'paid_queue_stale',
         submissions.id,
         submissions.stripe_livemode,
         effective_now
  from public.designer_preflight_submissions as submissions
  where submissions.stripe_livemode = p_stripe_livemode
    and submissions.status = 'paid'
    and submissions.payment_status in ('paid', 'partially_refunded')
    and submissions.owner_acknowledged_at is null
    and submissions.paid_at <= effective_now - interval '1 hour'
    and submissions.anonymized_at is null
  on conflict (dedupe_key) do nothing;
  get diagnostics last_rows = row_count;
  inserted_rows := inserted_rows + last_rows;

  insert into public.designer_preflight_outbox (
    dedupe_key, event_type, submission_id, stripe_livemode, available_at
  )
  select 'watchdog:' || submissions.id::text || ':adverse:' || daily_key,
         'adverse_case_unresolved',
         submissions.id,
         submissions.stripe_livemode,
         effective_now
  from public.designer_preflight_submissions as submissions
  where submissions.stripe_livemode = p_stripe_livemode
    and submissions.payment_status in ('refunded', 'dispute_won', 'dispute_lost')
    and submissions.adverse_case_resolved_at is null
    and submissions.status in ('awaiting_payment', 'paid', 'in_review', 'report_ready')
    and submissions.anonymized_at is null
  on conflict (dedupe_key) do nothing;
  get diagnostics last_rows = row_count;
  inserted_rows := inserted_rows + last_rows;

  insert into public.designer_preflight_outbox (
    dedupe_key, event_type, submission_id, stripe_livemode, available_at
  )
  select 'watchdog:' || submissions.id::text || ':fulfillment:' || daily_key,
         'fulfillment_overdue',
         submissions.id,
         submissions.stripe_livemode,
         effective_now
  from public.designer_preflight_submissions as submissions
  where submissions.stripe_livemode = p_stripe_livemode
    and submissions.status in ('in_review', 'report_ready')
    and submissions.fulfillment_due_at is not null
    and submissions.fulfillment_due_at <= effective_now
    and submissions.anonymized_at is null
  on conflict (dedupe_key) do nothing;
  get diagnostics last_rows = row_count;
  inserted_rows := inserted_rows + last_rows;

  insert into public.designer_preflight_outbox (
    dedupe_key, event_type, submission_id, stripe_livemode, available_at
  )
  select 'watchdog:' || submissions.id::text || ':retention:' || daily_key,
         'retention_overdue',
         submissions.id,
         submissions.stripe_livemode,
         effective_now
  from public.designer_preflight_submissions as submissions
  where submissions.stripe_livemode = p_stripe_livemode
    and submissions.retention_delete_by is not null
    and submissions.retention_delete_by <= effective_now
    and submissions.anonymized_at is null
  on conflict (dedupe_key) do nothing;
  get diagnostics last_rows = row_count;
  inserted_rows := inserted_rows + last_rows;

  return inserted_rows;
end;
$$;

create or replace function public.plan_designer_preflight_ops_watchdog(
  p_stripe_livemode boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  effective_now constant timestamptz := pg_catalog.now();
  pending_reconciliation integer;
  stale_paid integer;
  fulfillment_overdue integer;
  retention_overdue integer;
  verified_abandoned_missing_deadline integer;
  delivered_missing_deadline integer;
  safe_orphan_cleanup_due integer;
  retention_due_eligible integer;
begin
  if p_stripe_livemode is null then
    raise exception 'Stripe mode is required';
  end if;

  select pg_catalog.count(*) into pending_reconciliation
  from public.designer_preflight_submissions
  where stripe_livemode = p_stripe_livemode
    and status = 'awaiting_payment'
    and payment_status = 'pending'
    and paid_at is null
    and anonymized_at is null
    and (
      checkout_expires_at <= effective_now
      or (checkout_expires_at is null and created_at <= effective_now - interval '48 hours')
    );

  select pg_catalog.count(*) into stale_paid
  from public.designer_preflight_submissions
  where stripe_livemode = p_stripe_livemode
    and status = 'paid'
    and payment_status in ('paid', 'partially_refunded')
    and owner_acknowledged_at is null
    and paid_at <= effective_now - interval '1 hour'
    and anonymized_at is null;

  select pg_catalog.count(*) into fulfillment_overdue
  from public.designer_preflight_submissions
  where stripe_livemode = p_stripe_livemode
    and status in ('in_review', 'report_ready')
    and fulfillment_due_at <= effective_now
    and anonymized_at is null;

  select pg_catalog.count(*) into retention_overdue
  from public.designer_preflight_submissions
  where stripe_livemode = p_stripe_livemode
    and retention_delete_by <= effective_now
    and anonymized_at is null;

  select pg_catalog.count(*) into verified_abandoned_missing_deadline
  from public.designer_preflight_submissions
  where stripe_livemode = p_stripe_livemode
    and status = 'closed'
    and payment_status in ('expired', 'failed')
    and paid_at is null
    and retention_delete_by is null
    and anonymized_at is null;

  select pg_catalog.count(*) into delivered_missing_deadline
  from public.designer_preflight_submissions
  where stripe_livemode = p_stripe_livemode
    and status = 'delivered'
    and delivered_at is not null
    and retention_delete_by is null
    and anonymized_at is null;

  select pg_catalog.count(*) into safe_orphan_cleanup_due
  from public.designer_preflight_submissions
  where stripe_livemode = p_stripe_livemode
    and status = 'awaiting_payment'
    and payment_status = 'pending'
    and paid_at is null
    and stripe_checkout_session_id is null
    and checkout_url is null
    and created_at <= effective_now - interval '7 days'
    and anonymized_at is null;

  select pg_catalog.count(*) into retention_due_eligible
  from public.designer_preflight_submissions
  where stripe_livemode = p_stripe_livemode
    and retention_delete_by <= effective_now
    and anonymized_at is null
    and (
      (
        status in ('delivered', 'refunded', 'cancelled', 'closed')
        and ((paid_at is null and payment_status in ('expired', 'failed')) or paid_at is not null)
      )
    );

  return pg_catalog.jsonb_build_object(
    'stripe_livemode', p_stripe_livemode,
    'pending_reconciliation', pending_reconciliation,
    'stale_paid', stale_paid,
    'fulfillment_overdue', fulfillment_overdue,
    'retention_overdue', retention_overdue,
    'verified_abandoned_missing_deadline', verified_abandoned_missing_deadline,
    'delivered_missing_deadline', delivered_missing_deadline,
    'safe_orphan_cleanup_due', safe_orphan_cleanup_due,
    'retention_due_eligible', retention_due_eligible
  );
end;
$$;

create or replace function public.run_designer_preflight_ops_watchdog(
  p_stripe_livemode boolean,
  p_retention_limit integer default 100
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  retention_result jsonb;
  alerts_enqueued integer;
begin
  if p_stripe_livemode is null then
    raise exception 'Stripe mode is required';
  end if;
  if p_retention_limit is null or p_retention_limit < 1 or p_retention_limit > 500 then
    raise exception 'Invalid retention batch size';
  end if;
  retention_result := public.run_designer_preflight_retention(p_stripe_livemode, p_retention_limit);
  alerts_enqueued := public.enqueue_designer_preflight_watchdog_events(p_stripe_livemode);
  return pg_catalog.jsonb_build_object(
    'stripe_livemode', p_stripe_livemode,
    'retention', retention_result,
    'alerts_enqueued', alerts_enqueued
  );
end;
$$;

create or replace function public.claim_designer_preflight_outbox(
  p_worker_id text,
  p_stripe_livemode boolean,
  p_limit integer default 25
)
returns table (
  outbox_id uuid,
  event_type text,
  submission_id uuid,
  stripe_livemode boolean,
  attempt_count integer,
  lease_token uuid
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_worker_id is null or p_worker_id !~ '^[a-zA-Z0-9_.-]{1,80}$' then
    raise exception 'Invalid worker ID';
  end if;
  if p_stripe_livemode is null then
    raise exception 'Stripe mode is required';
  end if;
  if p_limit is null or p_limit < 1 or p_limit > 100 then
    raise exception 'Invalid outbox batch size';
  end if;

  return query
  with candidates as (
    select outbox.id
    from public.designer_preflight_outbox as outbox
    where outbox.delivered_at is null
      and outbox.stripe_livemode = p_stripe_livemode
      and outbox.available_at <= pg_catalog.now()
      and (outbox.claimed_at is null or outbox.claimed_at <= pg_catalog.now() - interval '15 minutes')
    order by outbox.created_at, outbox.id
    limit p_limit
    for update skip locked
  )
  update public.designer_preflight_outbox as outbox
  set claimed_at = pg_catalog.now(),
      claimed_by = p_worker_id,
      lease_token = pg_catalog.gen_random_uuid(),
      attempt_count = outbox.attempt_count + 1,
      last_error_code = null
  from candidates
  where outbox.id = candidates.id
  returning outbox.id,
            outbox.event_type,
            outbox.submission_id,
            outbox.stripe_livemode,
            outbox.attempt_count,
            outbox.lease_token;
end;
$$;

create or replace function public.complete_designer_preflight_outbox(
  p_outbox_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_stripe_livemode boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_rows integer;
begin
  if p_outbox_id is null or p_worker_id is null or p_lease_token is null then
    raise exception 'Outbox ID, worker ID, and lease token are required';
  end if;
  if p_worker_id !~ '^[a-zA-Z0-9_.-]{1,80}$' then
    raise exception 'Invalid worker ID';
  end if;
  if p_stripe_livemode is null then
    raise exception 'Stripe mode is required';
  end if;
  update public.designer_preflight_outbox
  set delivered_at = pg_catalog.now(),
      lease_token = null
  where id = p_outbox_id
    and claimed_by = p_worker_id
    and lease_token = p_lease_token
    and stripe_livemode = p_stripe_livemode
    and claimed_at > pg_catalog.now() - interval '15 minutes'
    and delivered_at is null;
  get diagnostics updated_rows = row_count;
  return updated_rows = 1;
end;
$$;

create or replace function public.fail_designer_preflight_outbox(
  p_outbox_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_stripe_livemode boolean,
  p_error_code text,
  p_retry_seconds integer default 300
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_rows integer;
begin
  if p_outbox_id is null or p_worker_id is null or p_lease_token is null then
    raise exception 'Outbox ID, worker ID, and lease token are required';
  end if;
  if p_worker_id !~ '^[a-zA-Z0-9_.-]{1,80}$' then
    raise exception 'Invalid worker ID';
  end if;
  if p_stripe_livemode is null then
    raise exception 'Stripe mode is required';
  end if;
  if p_error_code is null or p_error_code !~ '^[a-z0-9_.-]{1,80}$' then
    raise exception 'Use a privacy-safe error code, not a provider message';
  end if;
  if p_retry_seconds is null or p_retry_seconds < 60 or p_retry_seconds > 86400 then
    raise exception 'Invalid retry delay';
  end if;
  update public.designer_preflight_outbox
  set claimed_at = null,
      claimed_by = null,
      lease_token = null,
      last_error_code = p_error_code,
      available_at = pg_catalog.now() + pg_catalog.make_interval(secs => p_retry_seconds)
  where id = p_outbox_id
    and claimed_by = p_worker_id
    and lease_token = p_lease_token
    and stripe_livemode = p_stripe_livemode
    and claimed_at > pg_catalog.now() - interval '15 minutes'
    and delivered_at is null;
  get diagnostics updated_rows = row_count;
  return updated_rows = 1;
end;
$$;

revoke all on function public.enqueue_designer_preflight_outbox(text, text, uuid, boolean) from public, anon, authenticated, service_role;
revoke all on function public.save_designer_preflight_checkout(uuid, text, text, boolean, timestamptz) from public, anon, authenticated;
revoke all on function public.process_designer_preflight_stripe_event(text, text, uuid, text, text, text) from public, anon, authenticated;
revoke all on function public.process_designer_preflight_stripe_event_v2(text, text, uuid, text, text, text, boolean, text, integer, integer, text, text, text) from public, anon, authenticated;
revoke all on function public.acknowledge_designer_preflight_paid_order(uuid, boolean) from public, anon, authenticated;
revoke all on function public.start_designer_preflight_review(uuid, boolean, timestamptz) from public, anon, authenticated;
revoke all on function public.mark_designer_preflight_report_ready(uuid, boolean) from public, anon, authenticated;
revoke all on function public.mark_designer_preflight_delivered(uuid, boolean) from public, anon, authenticated;
revoke all on function public.anonymize_designer_preflight_submission(uuid, boolean, text, boolean) from public, anon, authenticated;
revoke all on function public.resolve_designer_preflight_adverse_case(uuid, boolean, text) from public, anon, authenticated;
revoke all on function public.run_designer_preflight_retention(boolean, integer) from public, anon, authenticated;
revoke all on function public.enqueue_designer_preflight_watchdog_events(boolean) from public, anon, authenticated;
revoke all on function public.plan_designer_preflight_ops_watchdog(boolean) from public, anon, authenticated;
revoke all on function public.run_designer_preflight_ops_watchdog(boolean, integer) from public, anon, authenticated;
revoke all on function public.claim_designer_preflight_outbox(text, boolean, integer) from public, anon, authenticated;
revoke all on function public.complete_designer_preflight_outbox(uuid, text, uuid, boolean) from public, anon, authenticated;
revoke all on function public.fail_designer_preflight_outbox(uuid, text, uuid, boolean, text, integer) from public, anon, authenticated;

grant execute on function public.save_designer_preflight_checkout(uuid, text, text, boolean, timestamptz) to service_role;
grant execute on function public.process_designer_preflight_stripe_event(text, text, uuid, text, text, text) to service_role;
grant execute on function public.process_designer_preflight_stripe_event_v2(text, text, uuid, text, text, text, boolean, text, integer, integer, text, text, text) to service_role;
grant execute on function public.acknowledge_designer_preflight_paid_order(uuid, boolean) to service_role;
grant execute on function public.start_designer_preflight_review(uuid, boolean, timestamptz) to service_role;
grant execute on function public.mark_designer_preflight_report_ready(uuid, boolean) to service_role;
grant execute on function public.mark_designer_preflight_delivered(uuid, boolean) to service_role;
grant execute on function public.anonymize_designer_preflight_submission(uuid, boolean, text, boolean) to service_role;
grant execute on function public.resolve_designer_preflight_adverse_case(uuid, boolean, text) to service_role;
grant execute on function public.run_designer_preflight_retention(boolean, integer) to service_role;
grant execute on function public.enqueue_designer_preflight_watchdog_events(boolean) to service_role;
grant execute on function public.plan_designer_preflight_ops_watchdog(boolean) to service_role;
grant execute on function public.run_designer_preflight_ops_watchdog(boolean, integer) to service_role;
grant execute on function public.claim_designer_preflight_outbox(text, boolean, integer) to service_role;
grant execute on function public.complete_designer_preflight_outbox(uuid, text, uuid, boolean) to service_role;
grant execute on function public.fail_designer_preflight_outbox(uuid, text, uuid, boolean, text, integer) to service_role;

commit;
