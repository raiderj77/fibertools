-- OWNER-GATED POST-DEPLOY PHASE 2 — DO NOT add this file to automatic migrations.
--
-- Preconditions that must be verified by the owner in the target environment:
--   1. 20260818 phase 1 was applied successfully after remote-ledger reconciliation.
--   2. Every active deployment/Preview that writes this database runs the
--      mode-aware application code and supplies stripe_livemode explicitly.
--   3. Legacy NULL-mode rows have been inventoried; they may remain NULL, but
--      any future update to one must set a provider-verified mode in that update.
--   4. The deployed webhook uses only process_designer_preflight_stripe_event_v2;
--      no active deployment writes designer_preflight_stripe_events directly.
--
-- A NOT VALID check is still enforced for new/updated rows while allowing the
-- inventoried legacy NULL rows to remain until individually reconciled.

begin;

do $phase2$
begin
  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conrelid = 'public.designer_preflight_submissions'::pg_catalog.regclass
      and conname = 'designer_preflight_submissions_stripe_mode_required'
  ) then
    alter table public.designer_preflight_submissions
      add constraint designer_preflight_submissions_stripe_mode_required
      check (stripe_livemode is not null) not valid;
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conrelid = 'public.designer_preflight_stripe_events'::pg_catalog.regclass
      and conname = 'designer_preflight_stripe_events_stripe_mode_required'
  ) then
    alter table public.designer_preflight_stripe_events
      add constraint designer_preflight_stripe_events_stripe_mode_required
      check (stripe_livemode is not null) not valid;
  end if;
end;
$phase2$;

revoke execute on function public.process_designer_preflight_stripe_event(
  text, text, uuid, text, text, text
) from service_role;

-- v2 is SECURITY DEFINER and is the only supported event mutation boundary.
-- Keep read access for owner reconciliation, but close direct event writes.
revoke insert, update, delete on table public.designer_preflight_stripe_events from service_role;

commit;

-- Residual least-privilege boundary: service_role still has direct CRUD on
-- designer_preflight_submissions because the current application creates and
-- reads those rows directly. A later owner-reviewed rollout should replace
-- that access with narrow create/read RPCs before revoking direct submission
-- CRUD. Phase 2 does not claim to close that separate boundary.
--
-- Later, only after the corresponding NULL count returns 0:
-- alter table public.designer_preflight_submissions
--   validate constraint designer_preflight_submissions_stripe_mode_required;
-- alter table public.designer_preflight_stripe_events
--   validate constraint designer_preflight_stripe_events_stripe_mode_required;
