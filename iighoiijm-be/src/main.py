from flask import Flask, request, redirect
from flask import make_response as flask_response, jsonify as flask_jsonify
import logging
from os import getenv, path
import sys
from functools import wraps
import json
from argparse import ArgumentParser

src_path = path.dirname(path.realpath(__file__))
sys.path.append(src_path)
from database import Database
import sql_builder

app = Flask(__name__)

def make_response(message, code):
    response = flask_response(message, code)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

def jsonify(object):
    response = flask_jsonify(object)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

def validate_input(*keys):
    """
    Decorator for endpoints that validates the GET requests to that endpoint contains all the params.
    :param keys: The params that are needed by the endpoint.
    :return: Error response if the params are not there.
    """

    def real_decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                for key in keys:
                    assert key in request.args
            except AssertionError as e:
                return make_response("Query parameter is not found in request", 400)

            return f(*args, **kwargs)

        return decorated_function

    return real_decorator


def answer_query(model_name, queries, model_by_order, model_by_name):
    """
    Fills up the queries list by making the needed calls to the
    database and returns the answer list.
    :param model_name: Name of the model
    :param queries: List that contains the queries.
    :param model_by_order: Function to request info about the model by order.
    :param model_by_name: Function to request info about the model by name.
    :return: A list that is filled up with instances of model that corresponds to queries.
    """
    result = []
    for query in queries:
        if type(query) is int:
            entry = model_by_order(query)
        elif type(query) is str:
            entry = model_by_name(query)
        else:
            result.append({"error": "Invalid type for query. Please use int or str."})
            continue

        if entry:
            result.append(entry)
        else:
            result.append({"error": "Given key doesn't match any {}.".format(model_name)})
    return result


def get_params(args, default_sort):
    try:
        queries = json.loads(args["query"])
    except json.JSONDecodeError as e:
        raise Exception("Invalid query parameter: {}".format(e))

    sort = default_sort
    if "sort" in args:
        sort["key"] = args["sort"]
    if "order" in args:
        sort["order"] = args["order"]

    try:
        keywords = json.loads(args.get("keywords", '[]'))
    except json.JSONDecodeError as e:
        raise Exception("Invalid keyword parameter: {}".format(e))

    try:
        filters = []
        for key, value in args.items():
            if key not in ("query", "order", "sort", "keywords"):
                filter = {}
                filter["key"] = key
                filter["value"] = json.loads(value)
                filters.append(filter)
        print(filters)
    except json.JSONDecodeError as e:
        raise Exception("Invalid filter parameter: {}".format(e))

    return queries, sort, keywords, filters


@app.route('/country')
@validate_input('query')
def country():
    try:
        queries, sort, keywords, filters = get_params(request.args, {"key": "EPI", "order": "desc"})
    except Exception as e:
        return make_response("{}".format(e), 400)

    try:
        order_sql, count_sql = sql_builder.build_country_query(sort, keywords, filters)
    except Exception as e:
        return make_response("Invalid parameters: {}".format(e), 400)

    app.logger.debug(order_sql, count_sql)
    result = {}
    result["count"] = database.get_instance_count(count_sql)
    result["results"] = answer_query('country', queries, database.get_country_by_order(order_sql),
                                     database.get_country_by_name)
    return jsonify(result)


@app.route('/issue')
@validate_input('query')
def issue():
    try:
        queries, sort, keywords, filters = get_params(request.args, {"key": "country", "order": "desc"})
    except Exception as e:
        return make_response("{}".format(e), 400)

    try:
        order_sql, count_sql = sql_builder.build_issue_query(sort, keywords, filters)
    except Exception as e:
        return make_response("Invalid parameters: {}".format(e), 400)

    app.logger.debug(order_sql, count_sql)
    result = {}
    result["count"] = database.get_instance_count(count_sql)
    result["results"] = answer_query('issue', queries, database.get_issue_by_order(order_sql),
                                     database.get_issue_by_name)
    return jsonify(result)


@app.route('/charity')
@validate_input('query')
def charity():
    try:
        queries, sort, keywords, filters = get_params(request.args, {"key": "charity_name", "order": "asc"})
    except Exception as e:
        return make_response("{}".format(e), 400)

    try:
        order_sql, count_sql = sql_builder.build_charity_query(sort, keywords, filters)
    except Exception as e:
        return make_response("Invalid parameters: {}".format(e), 400)

    app.logger.debug(order_sql, count_sql)
    result = {}
    result["count"] = database.get_instance_count(count_sql)
    result["results"] = answer_query('charity', queries, database.get_charity_by_order(order_sql),
                                     database.get_charity_by_name)
    return jsonify(result)


@app.route('/')
def index():
    return redirect("https://documenter.getpostman.com/view/5497939/RWgm2LED", code=302)


if __name__ == "__main__":
    port = int(getenv('PORT', '6000'))
    logging.basicConfig(format='%(asctime)s %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s')

    parser = ArgumentParser(description='Backend server for the iighoiijm project.')
    parser.add_argument('database', type=str, help='Name of the database.')
    parser.add_argument('user', type=str, help='User of the database.')
    parser.add_argument('password', type=str, help='Password of the database.')
    parser.add_argument('host', type=str, help='Host address of the database.')
    parser.add_argument('port', type=str, help='Port of the database.')
    args = parser.parse_args()

    app.logger.setLevel(logging.DEBUG)
    database = Database(args.database, args.user, args.password, args.host, args.port, app.logger)
    app.run(host='0.0.0.0', port=port, threaded=True, debug=True)
