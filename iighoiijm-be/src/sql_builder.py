def query_build(table_name, primary_key, sort, keywords, filters, filter_helper, sort_helper):
    if filters:
        filter_string = " and ".join([filter_helper(**filter) for filter in filters])
        filter_query = ("(select * from {table} where {filter_string}) {table}".format(table=table_name,
                                                                                       filter_string=filter_string))
    else:
        filter_query = table_name

    if type(keywords) is not list:
        raise Exception("Keywords should be a list not {}.".format(type(keywords)))

    if keywords:
        regexes = " and ".join(["(cast({table}.details as text) ilike '%{keyword}%' "
                                "or {table}.{primary_key} ilike '%{keyword}%')".format(table=table_name,
                                                                                       keyword=keyword,
                                                                                       primary_key=primary_key)
                                for keyword in keywords])
        keyword_query = ("(select * "
                         "from {filter_query} where "
                         "{regexes}) {table}".format(filter_query=filter_query, regexes=regexes, table=table_name)
                         )
    else:
        keyword_query = filter_query

    order_query = ("select * "
                   "from {keyword_query} "
                   "order by {sort_string}, {table}.{primary_key} asc "
                   "limit 1 offset {{}};".format(keyword_query=keyword_query,
                                                 sort_string=sort_helper(**sort),
                                                 table=table_name,
                                                 primary_key=primary_key)
                   )

    count_query = ("select count(*) "
                   "from {keyword_query};".format(keyword_query=keyword_query)
                   )
    if order_query.count(";") > 1 or count_query.count(";") > 1:
        raise Exception("Please don't try SQL injections.")
    return order_query, count_query


def build_country_query(sort, keywords, filters):
    def filter_helper(*, key, value):
        if key == "country_name":
            return "(country.country_name between '{}' and '{}')".format(value[0], value[1])
        elif key == "EPI":
            return "(cast(country.details ->> 'EPI' as float) between {} and {})".format(value[0], value[1])
        elif key == "latitude":
            return "(cast(country.details ->> 'latitude' as float) between {} and {})".format(value[0], value[1])
        elif key == "longitude":
            return "(cast(country.details ->> 'longtitude' as float) between {} and {})".format(value[0], value[1])

        raise Exception("Invalid filter key for countries.")

    def sort_helper(*, key, order):
        if order.lower() not in ('asc', 'desc'):
            raise Exception("order should be either asc or desc.")

        if key == "country_code":
            return "country.country_code {}".format(order)
        elif key == "country_name":
            return "country.details ->> 'country_name' {}".format(order)
        elif key == "EPI":
            return "cast(country.details ->> 'EPI' as float) {}".format(order)
        raise Exception("Invalid sort key for countries.")

    return query_build('country', 'country_code', sort, keywords, filters, filter_helper, sort_helper)


def build_issue_query(sort, keywords, filters):
    def filter_helper(*, key, value):
        if key == "issue_name":
            return "(issues.issue_name between '{}' and '{}')".format(value[0], value[1])
        elif key == "country":
            return "((issues.details -> 'countries') ?| array[{}])".format(','.join(repr(val) for val in value))
        raise Exception("Invalid filter key for issues.")

    def sort_helper(*, key, order):
        if order.lower() not in ('asc', 'desc'):
            raise Exception("order should be either asc or desc.")

        if key == "issue_name":
            return "issues.issue_name {}".format(order)
        elif key == "country":
            return "JSONB_ARRAY_LENGTH(issues.details -> 'countries') {}".format(order)
        elif key == "charity":
            return "JSONB_ARRAY_LENGTH(issues.details -> 'charities') {}".format(order)
        raise Exception("Invalid sort key for issues.")

    return query_build('issues', 'issue_name', sort, keywords, filters, filter_helper, sort_helper)


def build_charity_query(sort, keywords, filters):
    def filter_helper(*, key, value):
        if key == "charity_name":
            return "(charities.charity_name between '{}' and '{}')".format(value[0], value[1])
        elif key == "country":
            return "((charities.details -> 'country') ?| array[{}])".format(','.join(repr(val) for val in value))

        raise Exception("Invalid filter key for Charities.")

    def sort_helper(*, key, order):
        if order.lower() not in ('asc', 'desc'):
            raise Exception("order should be either asc or desc.")

        if key == "charity_name":
            return "charities.charity_name {}".format(order)
        elif key == "country":
            return "JSONB_ARRAY_LENGTH(charities.details -> 'country') {}".format(order)
        elif key == "issue":
            return "JSONB_ARRAY_LENGTH(charities.details -> 'issues') {}".format(order)
        raise Exception("Invalid sort key for issues.")

    return query_build('charities', 'charity_name', sort, keywords, filters, filter_helper, sort_helper)
