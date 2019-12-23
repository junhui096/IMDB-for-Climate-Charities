import unittest
import sys
import os
import json

src_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
sys.path.append(src_path)
from src import main
from src.sql_builder import build_country_query, build_issue_query, build_charity_query


class MockedDatabase:
    def __init__(self):
        pass

    def get_country_by_order(self, query):
        def helper(order):
            if order == 1:
                return {"country_name": "CHE"}
            return {}

        return helper

    def get_country_by_name(self, name):
        return {}

    def get_issue_by_order(self, query):
        def helper(order):
            if order == 1:
                return {"issue_name": "Pollution"}
            return {}

        return helper

    def get_issue_by_name(self, code):
        return {}

    def get_charity_by_order(self, query):
        def helper(order):
            if order == 1:
                return {"charity_name": "UNESCO"}
            return {}

        return helper

    def get_charity_by_name(self, code):
        return {}

    def get_instance_count(self, query):
        return 1


class BackendTestCase(unittest.TestCase):
    def setUp(self):
        self.app = main.app.test_client()
        main.database = MockedDatabase()
        self.sql_builders = [build_country_query, build_issue_query, build_charity_query]

    # @csavk
    def test_country_no_json(self):
        resp = self.app.get('/country')
        assert resp.status_code == 400
        assert resp.get_data().decode() == "Query parameter is not found in request"

    # @csavk
    def test_country_no_query(self):
        resp = self.app.get('/country', query_string={})
        assert resp.status_code == 400
        assert resp.get_data().decode() == "Query parameter is not found in request"

    # @csavk
    def test_country_with_query(self):
        resp = self.app.get('/country', query_string={"query": json.dumps([1, 1.0, None, "USA"])})
        assert resp.status_code == 200

    # @csavk
    def test_issue_with_query(self):
        resp = self.app.get('/issue', query_string={"query": json.dumps([1, 1.0, None, "Pollution"])})
        assert resp.status_code == 200

    # @csavk
    def test_charity_with_query(self):
        resp = self.app.get('/charity', query_string={"query": json.dumps([1, 1.0, None, "UNESCO"])})
        assert resp.status_code == 200

    # @csavk
    def test_build_country_valid(self):
        order_sql, count_sql = build_country_query({"key": "EPI", "order": "desc"}, [], {})
        self.assertEqual(order_sql, "select * "
                                    "from country "
                                    "order by cast(country.details ->> 'EPI' as float) desc, "
                                    "country.country_code asc "
                                    "limit 1 offset {};")

        self.assertEqual(count_sql, "select count(*) "
                                    "from country;")

    # @csavk
    def test_build_sql_invalid_sort(self):
        for sql_builder in self.sql_builders:
            self.assertRaises(Exception, sql_builder, {"key": "invalid", "order": "asc"}, [], {})

    # @csavk
    def test_build_sql_invalid_order(self):
        self.assertRaises(Exception, build_country_query, {"key": "EPI", "order": "invalid"}, [], {})
        self.assertRaises(Exception, build_issue_query, {"key": "issue_name", "order": "invalid"}, [], {})
        self.assertRaises(Exception, build_charity_query, {"key": "charity_name", "order": "invalid"}, [], {})

    # @csavk
    def test_build_sql_invalid_keywords(self):
        self.assertRaises(Exception, build_country_query, {"key": "EPI", "order": "desc"}, "invalid", {})
        self.assertRaises(Exception, build_issue_query, {"key": "issue_name", "order": "asc"}, "invalid", {})
        self.assertRaises(Exception, build_charity_query, {"key": "charity_name", "order": "asc"}, "invalid", {})

    # @csavk
    def test_build_sql_invalid_filter_dictionary(self):
        self.assertRaises(Exception, build_country_query, {"key": "EPI", "order": "desc"}, [], {"test": 0})
        self.assertRaises(Exception, build_issue_query, {"key": "issue_name", "order": "asc"}, [], {"test": 0})
        self.assertRaises(Exception, build_charity_query, {"key": "charity_name", "order": "asc"}, [], {"test": 0})
        self.assertRaises(Exception, build_country_query, {"key": "EPI", "order": "desc"}, [], {"key": "EPI"})
        self.assertRaises(Exception, build_issue_query, {"key": "issue_name", "order": "asc"}, [], {"key": "issue_name"})
        self.assertRaises(Exception, build_charity_query, {"key": "charity_name", "order": "asc"}, [], {"key": "charity_name"})

    # @csavk
    def test_build_sql_invalid_filter_key(self):
        self.assertRaises(Exception, build_country_query, {"key": "EPI", "order": "desc"}, [], {"key": 0})
        self.assertRaises(Exception, build_issue_query, {"key": "issue_name", "order": "asc"}, [], {"key": 0})
        self.assertRaises(Exception, build_charity_query, {"key": "charity_name", "order": "asc"}, [], {"key": 0})

    # @csavk
    def test_build_sql_invalid_filter_value(self):
        self.assertRaises(Exception, build_country_query, {"key": "EPI", "order": "desc"}, [], {"key": "EPI", "value": 0})
        self.assertRaises(Exception, build_issue_query, {"key": "issue_name", "order": "asc"}, [],
                          {"key": "issue_name", "value": 0})
        self.assertRaises(Exception, build_charity_query, {"key": "charity_name", "order": "asc"}, [],
                          {"key": "charity_name", "value": 0})


if __name__ == "__main__":
    unittest.main()
