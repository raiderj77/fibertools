"""Run: python tests/test_google_analytics_offline.py (standard library only).

Extract the production class AST without executing imports, __init__, or the
example runner. Request objects and responses are synthetic; no SDK, credentials,
environment, network or provider access is required.
Date semantics: https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/DateRange
"""
import ast
from datetime import date, timedelta
from pathlib import Path
from types import SimpleNamespace
from typing import Any, Dict, List, Optional
import unittest


SOURCE = Path(__file__).resolve().parents[1] / "data_sources/modules/google_analytics.py"
TREE = ast.parse(SOURCE.read_text(encoding="utf-8"))
CLASS = next(n for n in TREE.body if isinstance(n, ast.ClassDef) and n.name == "GoogleAnalytics")


class Record(SimpleNamespace):
    pass


class FakeFilter(Record):
    class StringFilter(Record):
        MatchType = SimpleNamespace(CONTAINS="CONTAINS", EXACT="EXACT")


NAMESPACE = dict(Any=Any, Dict=Dict, List=List, Optional=Optional,
                 DateRange=Record, Dimension=Record, Metric=Record,
                 RunReportRequest=Record, FilterExpression=Record, Filter=FakeFilter)
exec(compile(ast.Module(body=[CLASS], type_ignores=[]), str(SOURCE), "exec"), NAMESPACE)
GoogleAnalytics = NAMESPACE["GoogleAnalytics"]


class FakeClient:
    def __init__(self, views_per_day=None):
        self.requests = []
        self.views_per_day = views_per_day

    def run_report(self, request):
        self.requests.append(request)
        multiple = len(request.date_ranges) > 1
        headers = [Record(name="pagePath"), Record(name="pageTitle")]
        if multiple:
            headers.append(Record(name="dateRange"))
        rows = []
        offset = lambda value: 0 if value == "today" else 1 if value == "yesterday" else int(value.removesuffix("daysAgo"))
        values = lambda items: [Record(value=str(value)) for value in items]
        for window in request.date_ranges:
            if self.views_per_day is None:
                continue
            start, end = offset(window.start_date), offset(window.end_date)
            views = sum(self.views_per_day(day) for day in range(end, start + 1))
            dimensions = ["/yarn-calculator", "Synthetic tool"]
            if multiple:
                dimensions.append(window.name)
            rows.append(Record(dimension_values=values(dimensions), metric_values=values([views, 10, 20, 0.2, 0.8])))
        return Record(rows=rows, row_count=len(rows), dimension_headers=headers)


def instance(views_per_day=None):
    ga = object.__new__(GoogleAnalytics)
    ga.property_id = "synthetic-property"
    ga.client = FakeClient(views_per_day)
    return ga


class OfflineReportTests(unittest.TestCase):
    def test_generic_reports_do_not_implicitly_filter_blog(self):
        ga = instance()
        ga.get_top_pages()
        ga.get_conversions()
        ga.get_declining_pages()
        self.assertEqual(len(ga.client.requests), 3)
        self.assertTrue(all(not hasattr(r, "dimension_filter") for r in ga.client.requests))

    def test_explicit_filter_is_preserved_for_all_requests(self):
        ga = instance()
        ga.get_top_pages(path_filter="/blog/")
        ga.get_conversions(path_filter="/blog/")
        ga.get_declining_pages(path_filter="/blog/")
        for request in ga.client.requests:
            filter_ = request.dimension_filter.filter
            self.assertEqual(filter_.field_name, "pagePath")
            self.assertEqual(filter_.string_filter.value, "/blog/")
            self.assertEqual(filter_.string_filter.match_type, "CONTAINS")

    def test_top_pages_default_is_thirty_complete_days(self):
        ga = instance()
        ga.get_top_pages()
        window = ga.client.requests[0].date_ranges[0]
        self.assertEqual((window.start_date, window.end_date), ("30daysAgo", "1daysAgo"))

    def test_decline_windows_are_adjacent_equal_complete_days(self):
        for days in (1, 7, 30):
            ga = instance()
            ga.get_declining_pages(comparison_days=days)
            self.assertEqual(len(ga.client.requests), 1)
            windows = [(r.start_date, r.end_date) for r in ga.client.requests[0].date_ranges]
            self.assertEqual(windows, [(f"{days}daysAgo", "1daysAgo"),
                                       (f"{2 * days}daysAgo", f"{days + 1}daysAgo")])

    def test_constant_traffic_is_not_a_decline(self):
        self.assertEqual(instance(lambda day: 100).get_declining_pages(), [])

    def test_real_decline_and_growth(self):
        decline = instance(lambda day: 50 if day <= 30 else 100).get_declining_pages()
        self.assertEqual(len(decline), 1)
        self.assertEqual(decline[0]["pageviews"], 1500)
        self.assertEqual(decline[0]["previous_pageviews"], 3000)
        self.assertEqual(decline[0]["change_percent"], -50)
        self.assertEqual(instance(lambda day: 200 if day <= 30 else 100).get_declining_pages(), [])

    def test_invalid_windows_fail_before_any_request(self):
        for bad in (0, -1, True, 1.5, "30", None):
            ga = instance()
            with self.assertRaises(ValueError):
                ga.get_declining_pages(comparison_days=bad)
            self.assertEqual(ga.client.requests, [])
        for bad in (0, -1, True, 1.5, "1", None):
            ga = instance()
            with self.assertRaises(ValueError):
                ga.get_top_pages(end_days_ago=bad)
            self.assertEqual(ga.client.requests, [])

    def test_blog_demo_explicitly_requests_blog(self):
        demo = next(n for n in TREE.body if isinstance(n, ast.If))
        calls = [n for n in ast.walk(demo) if isinstance(n, ast.Call)
                 and isinstance(n.func, ast.Attribute)
                 and n.func.attr in ("get_top_pages", "get_declining_pages")]
        self.assertEqual(len(calls), 2)
        for call in calls:
            self.assertTrue(any(k.arg == "path_filter" and isinstance(k.value, ast.Constant)
                                and k.value.value == "/blog/" for k in call.keywords))

    def test_property_midnight_cannot_shift_second_window(self):
        class MidnightClient(FakeClient):
            def __init__(self):
                super().__init__(lambda day: 100)
                self.resolved = []

            def run_report(self, request):
                # The synthetic property crosses midnight after every request.
                # Each range within one request shares that request's date.
                today = date(2026, 10, 14) + timedelta(days=len(self.requests))
                for window in request.date_ranges:
                    offset = lambda value: int(value.removesuffix("daysAgo"))
                    self.resolved.append((today - timedelta(days=offset(window.start_date)),
                                          today - timedelta(days=offset(window.end_date))))
                return super().run_report(request)

        for days in (1, 7, 30, 90):
            ga = instance()
            ga.client = MidnightClient()
            self.assertEqual(ga.get_declining_pages(comparison_days=days), [])
            recent, previous = ga.client.resolved
            self.assertEqual(previous[1] + timedelta(days=1), recent[0])
            self.assertEqual((recent[1] - recent[0]).days + 1, days)
            self.assertEqual((previous[1] - previous[0]).days + 1, days)
            self.assertEqual(len(ga.client.requests), 1)

    def test_empty_ranges_and_empty_filter(self):
        ga = instance()
        self.assertEqual(ga.get_declining_pages(path_filter=""), [])
        self.assertEqual(len(ga.client.requests), 1)
        self.assertFalse(hasattr(ga.client.requests[0], "dimension_filter"))

    def test_named_interleaved_ranges_use_headers_not_column_positions(self):
        ga = instance()
        response = report([("previous", "/tool-b", 100), ("recent", "/tool-a", 50),
                           ("previous", "/tool-a", 100), ("recent", "/tool-b", 150)])
        ga.client.run_report = lambda request: response
        result = ga.get_declining_pages()
        self.assertEqual([(p['path'], p['change_percent']) for p in result], [("/tool-a", -50)])

    def test_top_hundred_selected_per_range_not_combined(self):
        ga = instance()
        rows = [(period, f"/tool-{i}", (1000 if period == "previous" else 200) - i)
                for i in reversed(range(101)) for period in ["recent", "previous"]]
        ga.client.run_report = lambda request: report(rows)
        result = ga.get_declining_pages()
        self.assertEqual(len(result), 100)
        self.assertNotIn('/tool-100', {p['path'] for p in result})

    def test_truncated_response_is_not_silently_compared_or_paginated(self):
        ga = instance()
        response = report([("recent", "/tool", 50), ("previous", "/tool", 100)])
        response.row_count = 10001
        requests = []
        def run(request):
            requests.append(request)
            return response
        ga.client.run_report = run
        with self.assertRaisesRegex(ValueError, "truncated"):
            ga.get_declining_pages()
        self.assertEqual(len(requests), 1)
        self.assertEqual(requests[0].limit, 10000)

    def test_missing_or_unknown_date_range_fails_clearly(self):
        for response in [report([("unknown", "/tool", 50)]), report([])]:
            if not response.rows:
                response.dimension_headers = [Record(name="pagePath"), Record(name="pageTitle")]
            ga = instance()
            ga.client.run_report = lambda request: response
            with self.assertRaisesRegex(ValueError, "date.range|dateRange"):
                ga.get_declining_pages()

    def test_invalid_windows_and_provider_errors_do_not_substitute_data(self):
        for bad in (0, -1, True, 1.5, "30", None, ""):
            ga = instance()
            with self.assertRaises(ValueError):
                ga.get_declining_pages(comparison_days=bad)
            self.assertEqual(ga.client.requests, [])
        ga = instance()
        def fail(request):
            raise RuntimeError("synthetic provider failure")
        ga.client.run_report = fail
        with self.assertRaisesRegex(RuntimeError, "synthetic provider failure"):
            ga.get_declining_pages()


def report(rows):
    # Deliberately reordered headers and interleaved rows, like a valid API table.
    values = lambda items: [Record(value=str(value)) for value in items]
    return Record(dimension_headers=[Record(name=n) for n in ["dateRange", "pageTitle", "pagePath"]],
                  row_count=len(rows), rows=[Record(dimension_values=values([period, "Synthetic tool", path]),
                  metric_values=values([views, 10, 20, .2, .8])) for period, path, views in rows])


if __name__ == "__main__":
    unittest.main()
