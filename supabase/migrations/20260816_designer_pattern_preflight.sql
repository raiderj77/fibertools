-- Designer Pattern Preflight manual pilot.
-- Apply through the Supabase SQL editor or CLI before enabling the checkout route.

create extension if not exists pgcrypto;

create table if not exists public.designer_preflight_submissions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  customer_email text not null check (char_length(customer_email) between 3 and 254),
  pattern_title text not null check (char_length(pattern_title) between 2 and 160),
  terminology text not null check (terminology in ('us', 'uk', 'mixed', 'unsure')),
  intended_skill_level text not null check (intended_skill_level in ('beginner', 'intermediate', 'advanced', 'all-levels')),
  pattern_type text not null check (pattern_type in ('amigurumi', 'accessory', 'garment', 'home-decor', 'blanket', 'other')),
  customer_comments text check (customer_comments is null or char_length(customer_comments) <= 1000),
  secure_share_url text not null check (secure_share_url ~ '^https://'),
  scope_agreed boolean not null check (scope_agreed = true),
  scope_agreed_at timestamptz not null,
  status text not null default 'awaiting_payment' check (status in ('draft', 'awaiting_payment', 'paid', 'in_review', 'report_ready', 'delivered', 'refunded', 'closed')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'expired', 'refunded')),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  checkout_url text,
  paid_at timestamptz,
  delivered_at timestamptz,
  retention_delete_by timestamptz,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.designer_preflight_stripe_events (
  stripe_event_id text primary key,
  event_type text not null,
  submission_id uuid not null references public.designer_preflight_submissions(id) on delete cascade,
  checkout_session_id text not null,
  payment_intent_id text,
  processed_at timestamptz not null default now()
);

create index if not exists designer_preflight_submissions_status_idx
  on public.designer_preflight_submissions (status, created_at);
create index if not exists designer_preflight_submissions_retention_idx
  on public.designer_preflight_submissions (retention_delete_by)
  where retention_delete_by is not null;

alter table public.designer_preflight_submissions enable row level security;
alter table public.designer_preflight_stripe_events enable row level security;

revoke all on table public.designer_preflight_submissions from public, anon, authenticated;
revoke all on table public.designer_preflight_stripe_events from public, anon, authenticated;
grant select, insert, update, delete on table public.designer_preflight_submissions to service_role;
grant select, insert, update, delete on table public.designer_preflight_stripe_events to service_role;

create or replace function public.set_designer_preflight_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists designer_preflight_updated_at on public.designer_preflight_submissions;
create trigger designer_preflight_updated_at
before update on public.designer_preflight_submissions
for each row execute function public.set_designer_preflight_updated_at();

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
set search_path = public, pg_temp
as $$
declare
  inserted_rows integer;
begin
  if p_payment_status not in ('paid', 'expired') then
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
    set payment_status = 'paid',
        status = case when status = 'awaiting_payment' then 'paid' else status end,
        stripe_checkout_session_id = p_checkout_session_id,
        stripe_payment_intent_id = coalesce(p_payment_intent_id, stripe_payment_intent_id),
        paid_at = coalesce(paid_at, now())
    where id = p_submission_id and stripe_checkout_session_id = p_checkout_session_id;
  else
    update public.designer_preflight_submissions
    set payment_status = 'expired'
    where id = p_submission_id
      and stripe_checkout_session_id = p_checkout_session_id
      and payment_status = 'pending';
  end if;

  if not found then
    raise exception 'Invalid or mismatched preflight submission';
  end if;
  return true;
end;
$$;

revoke all on function public.set_designer_preflight_updated_at() from public, anon, authenticated;
revoke all on function public.process_designer_preflight_stripe_event(text, text, uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.process_designer_preflight_stripe_event(text, text, uuid, text, text, text) to service_role;
