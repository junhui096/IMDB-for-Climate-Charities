import psycopg2
import json


class Database:
    def __init__(self, database, user, password, host, port, logger):
        self.logger = logger
        try:
            # To change once db is setup.
            self.conn = psycopg2.connect(database=database, user=user, password=password,
                                    host=host, port=port)
        except Exception as e:
            self.logger.error(e)

    def get_country_by_order(self, query):
        def helper(order):
            with self.conn.cursor() as cursor:
                try:
                    cursor.execute(query.format(order-1))
                    country = cursor.fetchone()
                    country[1]["country_code"] = country[0]
                    return country[1]
                except Exception as e:
                    self.logger.error(e)
                    cursor.execute("rollback;")
                    return None
        return helper

    def get_country_by_name(self, code):
        with self.conn.cursor() as cursor:
            try:
                cursor.execute("select * "
                               "from country "
                               "where country.country_code = %s"
                               "or country.details ->> 'country_name' = %s;", (code, code))
                country = cursor.fetchone()
                country[1]["country_code"] = country[0]
                return country[1]
            except Exception as e:
                self.logger.error(e)
                cursor.execute("rollback;")
                return None

    def get_issue_by_order(self, query):
        def helper(order):
            with self.conn.cursor() as cursor:
                try:
                    cursor.execute(query.format(order-1))
                    issue = cursor.fetchone()
                    issue[1]["issue_name"] = issue[0]
                    return issue[1]
                except Exception as e:
                    self.logger.error(e)
                    cursor.execute("rollback;")
                    return None
        return helper

    def get_issue_by_name(self, code):
        with self.conn.cursor() as cursor:
            try:
                cursor.execute("select * from issues where issues.issue_name = %s;", (code,))
                issue = cursor.fetchone()
                issue[1]["issue_name"] = issue[0]
                return issue[1]
            except Exception as e:
                self.logger.error(e)
                cursor.execute("rollback;")
                return None

    def get_charity_by_order(self, query):
            def helper(order):
                with self.conn.cursor() as cursor:
                    try:
                        cursor.execute(query.format(order - 1))
                        charity = cursor.fetchone()
                        charity[1]["charity_name"] = charity[0]
                        return charity[1]
                    except Exception as e:
                        self.logger.error(e)
                        cursor.execute("rollback;")
                        return None

            return helper

    def get_charity_by_name(self, code):
        with self.conn.cursor() as cursor:
            try:
                cursor.execute("select * from charities where charities.charity_name = %s;", (code,))
                charity = cursor.fetchone()
                charity[1]["charity_name"] = charity[0]
                return charity[1]
            except Exception as e:
                self.logger.error(e)
                cursor.execute("rollback;")
                return None

    def get_instance_count(self, query):
        with self.conn.cursor() as cursor:
            try:
                cursor.execute(query)
                count = cursor.fetchone()
                return count[0]
            except Exception as e:
                self.logger.error(e)
                cursor.execute("rollback;")
                return 0