"""Run: python tests/test_google_analytics_offline.py (standard library only).

Extract the production class AST without executing imports, __init__, or the
example runner. Request objects and responses are synthetic; no SDK, credentials,
environment, network or provider access is required.
Date semantics: https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/DateRange
"""
import ast
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
        if self.views_per_day is None:
            return Record(rows=[])
        window = request.date_ranges[0]
        offset = lambda value: 0 if value == "today" else 1 if value == "yesterday" else int(value.removesuffix("daysAgo"))
        start, end = offset(window.start_date), offset(window.end_date)
        views = sum(self.views_per_day(day) for day in range(end, start + 1))
        values = lambda items: [Record(value=str(value)) for value in items]
        return Record(rows=[Record(dimension_values=values(["/yarn-calculator", "Synthetic tool"]),
                                   metric_values=values([views, 10, 20, 0.2, 0.8]))])


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
        self.assertEqual(len(ga.client.requests), 4)
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
            windows = [(r.date_ranges[0].start_date, r.date_ranges[0].end_date) for r in ga.client.requests]
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


if __name__ == "__main__":
    unittest.main()
