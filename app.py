import logging
import json
import os
from flask import Flask, render_template, request, jsonify, send_file
from crawler import web_crawl
from ranker import start_ranking
from searcher import searching
# app = Flask(__name__,template_folder='html')
app = Flask(__name__)

deep_ocean_data = {"crawling_result":{}, "seed_URL":"", "indexed" :{}, "ranks":{}, "url_page_title_map":{}}

@app.route('/')
def crawl():
	return render_template("crawler.html")

@app.route('/page_searching')
def page_search():
	return render_template("searcher.html")

@app.route('/start_searching', methods=['POST'])
def page_searching():
    if request.method == 'POST':
        params = request.json
        query = params["query"]
        global deep_ocean_data
        pages_list = searching(query,deep_ocean_data["indexed"] ,deep_ocean_data["ranks"], deep_ocean_data["url_page_title_map"] )
        print(pages_list)
        return json.dumps({"res":pages_list})
    return json.dumps({"status" : "OK"})

@app.route('/page_ranking')
def ranker():
    return render_template("ranker.html")

@app.route('/start-scrapping', methods=['POST'])
def scrap():
    if request.method == 'POST':
        params = request.json
        seed_url = params["seed_url"]
        max_iteration= int(params["max_iteration"])
        json_data = web_crawl(seed_url, max_iteration)
        global deep_ocean_data
        deep_ocean_data["crawling_result"] = json_data["crawling_result"]
        deep_ocean_data["indexed"] = json_data["indexed"]
        deep_ocean_data["seed_URL"] = seed_url
        deep_ocean_data["url_page_title_map"] = json_data["url_page_title_map"]
        return jsonify(deep_ocean_data["crawling_result"])
    return jsonify({"status" : "OK"})

@app.route('/remove-file')
def remove_file():
    os.remove("static/json/data.json")
    return jsonify({"status" : "OK"})

@app.route('/start-ranking')
def rank():
    global deep_ocean_data
    ranks = start_ranking(deep_ocean_data["crawling_result"])
    deep_ocean_data["ranks"] = ranks["ranks_keep"]
    return jsonify({"seed_url": deep_ocean_data["seed_URL"], "ranks": ranks["ranks_send"]})
    
@app.errorhandler(500)
def server_error(e):
	# Log the error and stacktrace.
	logging.exception(e)
	return 'An internal error occurred.', 500

@app.errorhandler(404)
def page_not_found(e):
	# note that we set the 404 status explicitly
	return 'You are looking for something else', 404


if __name__ == '__main__':
    
		# @app.route('/js/<fname>')
		# def send_js(fname):
		# 	final_path=os.path.abspath("js/%s"%fname)
		# 	return send_file(final_path)

		# @app.route('/imgs/<fname>')
		# def send_ings(fname):
		# 	final_path=os.path.abspath("imgs/%s"%fname)
		# 	return send_file(final_path)

		# @app.route('/css/<fname>')
		# def send_css(fname):
		# 	final_path=os.path.abspath("css/%s"%fname)
		# 	return send_file(final_path)
			# This is used when running locally only. When deploying to Google App
			# Engine, a webserver process such as Gunicorn will serve the app. This
			# can be configured by adding an `entrypoint` to app.yaml.
		app.run(host='127.0.0.1', port=8080, debug=True)

# [END app]
