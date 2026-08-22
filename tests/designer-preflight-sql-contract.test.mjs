import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";

const baseMigrationUrl = new URL("../supabase/migrations/20260816_designer_pattern_preflight.sql", import.meta.url);
const opsMigrationUrl = new URL("../supabase/migrations/20260818_designer_pattern_preflight_ops_hardening.sql", import.meta.url);
const phase2Url = new URL("../docs/designer-preflight-mode-enforcement-phase2.sql", import.meta.url);

test("ops migrations execute with provider-ID-free outbox, safe orphan cleanup, and RPC isolation", async () => {
  const db = new PGlite({ extensions: { pgcrypto } });

  try {
    await db.exec(`
      create role anon;
      create role authenticated;
      create role service_role;
    `);
    await db.exec(await readFile(baseMigrationUrl, "utf8"));
    await db.exec(await readFile(opsMigrationUrl, "utf8"));

    await db.exec(`
      insert into public.designer_preflight_submissions (
        id, request_id, customer_name, customer_email, pattern_title, terminology,
        intended_skill_level, pattern_type, secure_share_url, scope_agreed,
        scope_agreed_at, stripe_livemode, created_at
      ) values
        ('00000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000011',
         'Synthetic Refund', 'refund@example.invalid', 'Synthetic Refund', 'us', 'intermediate',
         'other', 'https://example.invalid/refund', true, pg_catalog.now(), false, pg_catalog.now()),
        ('00000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000012',
         'Synthetic Dispute', 'dispute@example.invalid', 'Synthetic Dispute', 'us', 'intermediate',
         'other', 'https://example.invalid/dispute', true, pg_catalog.now(), false, pg_catalog.now()),
        ('00000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000013',
         'Synthetic Orphan', 'orphan@example.invalid', 'Synthetic Orphan', 'us', 'intermediate',
         'other', 'https://example.invalid/orphan', true, pg_catalog.now(), false,
         pg_catalog.now() - interval '8 days'),
        ('00000000-0000-4000-8000-000000000014', '10000000-0000-4000-8000-000000000014',
         'Synthetic Linked', 'linked@example.invalid', 'Synthetic Linked', 'us', 'intermediate',
         'other', 'https://example.invalid/linked', true, pg_catalog.now(), false,
         pg_catalog.now() - interval '8 days'),
        ('00000000-0000-4000-8000-000000000015', '10000000-0000-4000-8000-000000000015',
         'Synthetic Late', 'late@example.invalid', 'Synthetic Late', 'us', 'intermediate',
         'other', 'https://example.invalid/late', true, pg_catalog.now(), false,
         pg_catalog.now() - interval '8 days'),
        ('00000000-0000-4000-8000-000000000016', '10000000-0000-4000-8000-000000000016',
         'Synthetic Ordered', 'ordered@example.invalid', 'Synthetic Ordered', 'us', 'intermediate',
         'other', 'https://example.invalid/ordered', true, pg_catalog.now(), false, pg_catalog.now());

      select public.save_designer_preflight_checkout(
        '00000000-0000-4000-8000-000000000011', 'cs_test_contract_refund',
        'https://checkout.stripe.com/contract-refund', false, pg_catalog.now() + interval '1 hour'
      );
      select public.save_designer_preflight_checkout(
        '00000000-0000-4000-8000-000000000012', 'cs_test_contract_dispute',
        'https://checkout.stripe.com/contract-dispute', false, pg_catalog.now() + interval '1 hour'
      );
      select public.save_designer_preflight_checkout(
        '00000000-0000-4000-8000-000000000014', 'cs_test_contract_linked',
        'https://checkout.stripe.com/contract-linked', false, pg_catalog.now() + interval '1 hour'
      );
      select public.save_designer_preflight_checkout(
        '00000000-0000-4000-8000-000000000015', 'cs_test_contract_late_original',
        'https://checkout.stripe.com/contract-late-original', false, pg_catalog.now() + interval '1 hour'
      );
      select public.save_designer_preflight_checkout(
        '00000000-0000-4000-8000-000000000016', 'cs_test_contract_ordered',
        'https://checkout.stripe.com/contract-ordered', false, pg_catalog.now() + interval '1 hour'
      );

      select public.process_designer_preflight_stripe_event_v2(
        'evt_test_contract_refund_paid', 'checkout.session.completed',
        '00000000-0000-4000-8000-000000000011', 'cs_test_contract_refund',
        'pi_test_contract_refund', 'cs_test_contract_refund', false, 'paid',
        3900, null, null, null, null
      );
      select public.process_designer_preflight_stripe_event_v2(
        'evt_test_contract_partial', 'charge.refunded',
        '00000000-0000-4000-8000-000000000011', null,
        'pi_test_contract_refund', 'ch_test_contract_refund', false, 'partially_refunded',
        3900, 300, null, null, null
      );
      select public.process_designer_preflight_stripe_event_v2(
        'evt_test_contract_full', 'charge.refunded',
        '00000000-0000-4000-8000-000000000011', null,
        'pi_test_contract_refund', 'ch_test_contract_refund', false, 'refunded',
        3900, 3900, null, null, null
      );

      select public.process_designer_preflight_stripe_event_v2(
        'evt_test_contract_dispute_paid', 'checkout.session.completed',
        '00000000-0000-4000-8000-000000000012', 'cs_test_contract_dispute',
        'pi_test_contract_dispute', 'cs_test_contract_dispute', false, 'paid',
        3900, null, null, null, null
      );
      select public.process_designer_preflight_stripe_event_v2(
        'evt_test_contract_dispute_open', 'charge.dispute.created',
        '00000000-0000-4000-8000-000000000012', null,
        'pi_test_contract_dispute', 'dp_test_contract_dispute', false, 'disputed',
        3900, null, 'dp_test_contract_dispute', 'needs_response', null
      );
      select public.process_designer_preflight_stripe_event_v2(
        'evt_test_contract_dispute_won', 'charge.dispute.closed',
        '00000000-0000-4000-8000-000000000012', null,
        'pi_test_contract_dispute', 'dp_test_contract_dispute', false, 'dispute_won',
        3900, null, 'dp_test_contract_dispute', 'won', null
      );
      select public.process_designer_preflight_stripe_event_v2(
        'evt_test_contract_ordered_partial', 'charge.refunded',
        '00000000-0000-4000-8000-000000000016', null,
        'pi_test_contract_ordered', 'ch_test_contract_ordered', false, 'partially_refunded',
        3900, 300, null, null, null
      );
    `);

    let result = await db.query(`
      select pg_catalog.has_function_privilege(
        'service_role',
        'public.process_designer_preflight_stripe_event(text,text,uuid,text,text,text)',
        'EXECUTE'
      ) as legacy_rpc_executable
    `);
    assert.equal(result.rows[0].legacy_rpc_executable, true);

    result = await db.query(`select pg_catalog.count(*)::integer as count from public.designer_preflight_stripe_events`);
    const eventCount = result.rows[0].count;
    await assert.rejects(
      db.query(`select public.process_designer_preflight_stripe_event_v2(
        'evt_test_contract_null_state', 'checkout.session.completed',
        '00000000-0000-4000-8000-000000000011', 'cs_test_contract_refund',
        'pi_test_contract_refund', 'cs_test_contract_refund', false, null,
        3900, null, null, null, null
      )`),
      /Unsupported payment state/
    );
    await assert.rejects(
      db.query(`select public.process_designer_preflight_stripe_event(
        'evt_test_contract_v1_null', 'checkout.session.completed',
        '00000000-0000-4000-8000-000000000014', 'cs_test_contract_linked',
        'pi_test_contract_linked', null
      )`),
      /Unsupported payment status/
    );
    result = await db.query(`select pg_catalog.count(*)::integer as count from public.designer_preflight_stripe_events`);
    assert.equal(result.rows[0].count, eventCount);
    result = await db.query(`
      select status, payment_status
      from public.designer_preflight_submissions
      where id = '00000000-0000-4000-8000-000000000014'
    `);
    assert.deepEqual(result.rows[0], { status: "awaiting_payment", payment_status: "pending" });

    result = await db.query(`
      select status, payment_status, amount_paid_cents, amount_refunded_cents
      from public.designer_preflight_submissions
      where id = '00000000-0000-4000-8000-000000000016'
    `);
    assert.deepEqual(result.rows[0], {
      status: "paid",
      payment_status: "partially_refunded",
      amount_paid_cents: 3900,
      amount_refunded_cents: 300,
    });
    await db.exec(`select public.process_designer_preflight_stripe_event_v2(
      'evt_test_contract_ordered_paid', 'checkout.session.completed',
      '00000000-0000-4000-8000-000000000016', 'cs_test_contract_ordered',
      'pi_test_contract_ordered', 'cs_test_contract_ordered', false, 'paid',
      3900, null, null, null, null
    )`);
    result = await db.query(`
      select status, payment_status
      from public.designer_preflight_submissions
      where id = '00000000-0000-4000-8000-000000000016'
    `);
    assert.deepEqual(result.rows[0], { status: "paid", payment_status: "partially_refunded" });
    result = await db.query(`select public.start_designer_preflight_review(
      '00000000-0000-4000-8000-000000000016', false, pg_catalog.now() + interval '2 days'
    ) as can_start`);
    assert.equal(result.rows[0].can_start, true);

    result = await db.query(`select * from public.designer_preflight_outbox order by created_at, id`);
    assert.doesNotMatch(JSON.stringify(result.rows), /evt_|cs_(?:test|live)_|pi_|ch_|dp_/);
    const dedupeKeys = result.rows.map((row) => row.dedupe_key);
    assert.ok(dedupeKeys.includes("submission:00000000-0000-4000-8000-000000000011:refund:partial:300"));
    assert.ok(dedupeKeys.includes("submission:00000000-0000-4000-8000-000000000011:payment:refunded"));
    assert.ok(dedupeKeys.includes("submission:00000000-0000-4000-8000-000000000012:dispute:needs_response"));
    assert.ok(dedupeKeys.includes("submission:00000000-0000-4000-8000-000000000012:dispute:won"));
    assert.ok(dedupeKeys.includes("submission:00000000-0000-4000-8000-000000000016:paid"));
    assert.ok(dedupeKeys.includes("submission:00000000-0000-4000-8000-000000000016:refund:partial:300"));

    result = await db.query(`select public.plan_designer_preflight_ops_watchdog(false) as plan`);
    assert.equal(result.rows[0].plan.safe_orphan_cleanup_due, 1);
    await db.exec(`select public.run_designer_preflight_retention(false, 100)`);
    result = await db.query(`
      select status, payment_status, customer_name, customer_email, secure_share_url,
             stripe_checkout_session_id, checkout_url, anonymization_reason, anonymized_at
      from public.designer_preflight_submissions
      where id = '00000000-0000-4000-8000-000000000013'
    `);
    assert.equal(result.rows[0].status, "awaiting_payment");
    assert.equal(result.rows[0].payment_status, "pending");
    assert.equal(result.rows[0].customer_name, null);
    assert.equal(result.rows[0].customer_email, null);
    assert.equal(result.rows[0].secure_share_url, null);
    assert.equal(result.rows[0].stripe_checkout_session_id, null);
    assert.equal(result.rows[0].checkout_url, null);
    assert.equal(result.rows[0].anonymization_reason, "abandoned_checkout");
    assert.ok(result.rows[0].anonymized_at);

    result = await db.query(`
      select status, payment_status, customer_email, stripe_checkout_session_id, checkout_url, anonymized_at
      from public.designer_preflight_submissions
      where id = '00000000-0000-4000-8000-000000000014'
    `);
    assert.deepEqual(result.rows[0], {
      status: "awaiting_payment",
      payment_status: "pending",
      customer_email: "linked@example.invalid",
      stripe_checkout_session_id: "cs_test_contract_linked",
      checkout_url: "https://checkout.stripe.com/contract-linked",
      anonymized_at: null,
    });

    await assert.rejects(
      db.query(`select public.save_designer_preflight_checkout(
        '00000000-0000-4000-8000-000000000015', 'cs_test_contract_late_replacement',
        'https://checkout.stripe.com/contract-late-replacement', false, pg_catalog.now() + interval '1 hour'
      )`),
      /Invalid or mismatched preflight checkout/
    );
    await db.exec(`select public.process_designer_preflight_stripe_event_v2(
      'evt_test_contract_late_paid', 'checkout.session.completed',
      '00000000-0000-4000-8000-000000000015', 'cs_test_contract_late_original',
      'pi_test_contract_late', 'cs_test_contract_late_original', false, 'paid',
      3900, null, null, null, null
    )`);
    result = await db.query(`
      select stripe_checkout_session_id, payment_status
      from public.designer_preflight_submissions
      where id = '00000000-0000-4000-8000-000000000015'
    `);
    assert.deepEqual(result.rows[0], {
      stripe_checkout_session_id: "cs_test_contract_late_original",
      payment_status: "paid",
    });

    for (const invalidClaim of [
      `select * from public.claim_designer_preflight_outbox(null::text, false, 1)`,
      `select * from public.claim_designer_preflight_outbox('contract-worker', null::boolean, 1)`,
      `select * from public.claim_designer_preflight_outbox('contract-worker', false, null::integer)`,
    ]) {
      await assert.rejects(db.query(invalidClaim), /Invalid worker ID|Stripe mode is required|Invalid outbox batch size/);
    }
    await assert.rejects(
      db.query(`select public.run_designer_preflight_retention(false, null::integer)`),
      /Invalid retention batch size/
    );
    result = await db.query(`select * from public.claim_designer_preflight_outbox('contract-worker', false, 1)`);
    assert.equal(result.rows.length, 1);
    const claim = result.rows[0];

    for (const [sql, params, pattern] of [
      [
        `select public.complete_designer_preflight_outbox($1::uuid, $2::text, null::uuid, false)`,
        [claim.outbox_id, "contract-worker"],
        /lease token are required/,
      ],
      [
        `select public.complete_designer_preflight_outbox($1::uuid, $2::text, $3::uuid, null::boolean)`,
        [claim.outbox_id, "contract-worker", claim.lease_token],
        /Stripe mode is required/,
      ],
      [
        `select public.fail_designer_preflight_outbox($1::uuid, $2::text, $3::uuid, false, null::text, 300)`,
        [claim.outbox_id, "contract-worker", claim.lease_token],
        /privacy-safe error code/,
      ],
      [
        `select public.fail_designer_preflight_outbox($1::uuid, $2::text, null::uuid, false, 'safe_code', 300)`,
        [claim.outbox_id, "contract-worker"],
        /lease token are required/,
      ],
      [
        `select public.fail_designer_preflight_outbox($1::uuid, $2::text, $3::uuid, null::boolean, 'safe_code', 300)`,
        [claim.outbox_id, "contract-worker", claim.lease_token],
        /Stripe mode is required/,
      ],
      [
        `select public.fail_designer_preflight_outbox($1::uuid, $2::text, $3::uuid, false, 'safe_code', null::integer)`,
        [claim.outbox_id, "contract-worker", claim.lease_token],
        /Invalid retry delay/,
      ],
    ]) {
      await assert.rejects(db.query(sql, params), pattern);
    }
    result = await db.query(
      `select claimed_by, lease_token::text, delivered_at from public.designer_preflight_outbox where id = $1::uuid`,
      [claim.outbox_id]
    );
    assert.deepEqual(result.rows[0], {
      claimed_by: "contract-worker",
      lease_token: claim.lease_token,
      delivered_at: null,
    });

    await db.exec(await readFile(phase2Url, "utf8"));
    result = await db.query(`
      select conname, convalidated
      from pg_catalog.pg_constraint
      where conname in (
        'designer_preflight_submissions_stripe_mode_required',
        'designer_preflight_stripe_events_stripe_mode_required'
      )
      order by conname
    `);
    assert.deepEqual(result.rows, [
      { conname: "designer_preflight_stripe_events_stripe_mode_required", convalidated: false },
      { conname: "designer_preflight_submissions_stripe_mode_required", convalidated: false },
    ]);
    result = await db.query(`
      select
        pg_catalog.has_function_privilege(
          'service_role',
          'public.process_designer_preflight_stripe_event(text,text,uuid,text,text,text)',
          'EXECUTE'
        ) as legacy_rpc_executable,
        pg_catalog.has_table_privilege('service_role', 'public.designer_preflight_stripe_events', 'SELECT') as events_select,
        pg_catalog.has_table_privilege('service_role', 'public.designer_preflight_stripe_events', 'INSERT') as events_insert,
        pg_catalog.has_table_privilege('service_role', 'public.designer_preflight_stripe_events', 'UPDATE') as events_update,
        pg_catalog.has_table_privilege('service_role', 'public.designer_preflight_stripe_events', 'DELETE') as events_delete,
        pg_catalog.has_table_privilege('service_role', 'public.designer_preflight_submissions', 'INSERT') as submissions_insert,
        pg_catalog.has_table_privilege('service_role', 'public.designer_preflight_submissions', 'SELECT') as submissions_select
    `);
    assert.deepEqual(result.rows[0], {
      legacy_rpc_executable: false,
      events_select: true,
      events_insert: false,
      events_update: false,
      events_delete: false,
      submissions_insert: true,
      submissions_select: true,
    });

    await assert.rejects(
      db.query(`insert into public.designer_preflight_submissions (
          request_id, scope_agreed, scope_agreed_at
        ) values (
          '10000000-0000-4000-8000-000000000099', true, pg_catalog.now()
        )`),
      /designer_preflight_submissions_stripe_mode_required/
    );
    await assert.rejects(
      db.query(`insert into public.designer_preflight_stripe_events (
          stripe_event_id, event_type, submission_id, stripe_object_id, payment_state
        ) values (
          'evt_test_contract_null_mode', 'synthetic.phase2',
          '00000000-0000-4000-8000-000000000014', 'cs_test_contract_null_mode', 'expired'
        )`),
      /designer_preflight_stripe_events_stripe_mode_required/
    );
  } finally {
    await db.close();
  }
});
