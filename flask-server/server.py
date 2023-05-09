from flask import Flask, make_response, send_from_directory, request, send_file, flash, redirect, url_for, session, jsonify
#import sql_functions as zonk
#import api_add as add
import mosaic
#from create_musaic import create_function
import sys
import os, os.path
import requests
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import werkzeug.datastructures
import secrets
import time
import datetime
from functools import reduce

import spotipy
from spotipy.oauth2 import SpotifyOAuth

from flask_sqlalchemy import SQLAlchemy
from db_manager import db_session
from classes import Artist, User
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import IntegrityError




app = Flask(__name__)
cors = CORS(app, origins="*")
DOWNLOAD_DIRECTORY = os.getcwd()
UPLOAD_FOLDER = 'target_images'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SESSION_COOKIE_NAME'] = 'my cookie'
TOKEN_INFO = "token_info"
secret = secrets.token_urlsafe(32)
app.secret_key = secret

headers = werkzeug.datastructures.Headers()
headers.add('Content-Type', 'image/png')

engine = create_engine('postgresql://tynsxjqtfhievn:2d2cebfcec88756323909dbbad2323a7695b38d55161d3083f4c7ab06ea8a683@ec2-52-5-167-89.compute-1.amazonaws.com:5432/dfoch0qct6ehfr')
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit = False))



@app.route("/redirect")
@cross_origin()
def redirectPage():
    print("we at the redirect page!!!")
    sp_oauth = create_spotify_oauth()
    session.clear()
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session[TOKEN_INFO] = token_info
    print("token info in redirect page", token_info)
    return redirect(url_for("get_user_info", _external=True))

def add_scores(ps, ms, user, timestamp):
    return

@app.route("/user-info", methods=['POST', 'GET'])
@cross_origin()
def get_user_info():

    args = request.get_json()
    print(args)
    print(args['data'])
    sp = spotipy.Spotify(auth=args['data'])
    print("logged in as : ", sp.current_user())


    all_top_ids = []
    all_popularity = []

    pop_score = {"long_term": 0, "medium_term": 0, "short_term": 0}
    mood_score = {"long_term": 0, "medium_term": 0, "short_term": 0}


    for k, v in pop_score.items():
        popularity = [song["popularity"] for song in sp.current_user_top_artists(limit=50, offset=0, time_range=k)['items']]
        top_ids = [song["id"] for song in sp.current_user_top_tracks(limit=50, offset=0, time_range=k)['items']]

        metric = reduce(lambda x, y: x+y, map(lambda x: x["valence"] + x["danceability"], sp.audio_features(top_ids)))

        pop_score[k] = reduce(lambda x, y: x+y, popularity) / len(popularity)
        mood_score[k] = metric / len(top_ids)

        all_top_ids += top_ids
        all_popularity += popularity



    all_top_ids = list(dict.fromkeys(all_top_ids))
    all_popularity = list(dict.fromkeys(all_popularity))

    # pop_score["all_time"] = reduce(lambda x, y: x+y, all_popularity) / len(all_popularity)

    # metric = 0
    # for id in all_top_ids:
    #     info = sp.audio_features(id)[0]
    #     metric += info["danceability"] * info["valence"]
    # mood_score["all_time"] = metric / len(all_top_ids)
    

    #parse into smaller more usable json objects
    resp = make_response({"pop_score": pop_score, "mood_score": mood_score})
    resp.headers['Access-Control-Allow-Origin'] = '*'

    print(resp)

    add_scores(pop_score, mood_score, sp.current_user()["id"], datetime.datetime.now())

    return jsonify({"pop_score": pop_score, "mood_score": mood_score})

def get_token():
    # token_info = session.get(TOKEN_INFO, None)
    # if not token_info:
    #     raise "exception"
    # print(token_info)

    # now = int(time.time())
    # is_expired = token_info['expires_at'] - now < 60
    # if (is_expired):
    #     sp_oauth = create_spotify_oauth()
    #     token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
    # print(token_info)

    token_valid = False
    token_info = session.get("token_info", {})

    # Checking if the session already has a token stored
    if not (session.get('token_info', False)):
        token_valid = False
        return token_info, token_valid

    # Checking if token has expired
    now = int(time.time())
    is_token_expired = session.get('token_info').get('expires_at') - now < 60

    # Refreshing token if it has expired
    if (is_token_expired):
        sp_oauth = create_spotify_oauth()
        token_info = sp_oauth.refresh_access_token(session.get('token_info').get('refresh_token'))

    token_valid = True
    return token_info, token_valid


@app.route('/get-artists')
@cross_origin()
def get_artists():
    return make_response({"optionList" : [{"name":a.name, "id":a.id} for a in db_session.query(Artist).all()]})


@app.route('/get-artist/<string:id>/')
@cross_origin()
def get_artist(id : str):
    res = db_session.query(Artist).filter(Artist.id == id).first()
    print(res)
    return make_response(res.as_dict())






@app.route('/taste', methods=['POST', 'GET'])
def login():
    print('here')
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    print("in loing: ", auth_url)
    return redirect(auth_url)

    # pop_score = {"long_term": 2, "medium_term": 0, "short_term": 0}
    # mood_score = {"long_term": 2, "medium_term": 0, "short_term": 0}
    # resp = make_response({"pop_score": pop_score, "mood_score": mood_score})
    # resp.headers['Access-Control-Allow-Origin'] = '*'
    # return resp



def create_spotify_oauth():
    return SpotifyOAuth(
        client_id = "617bb37b7d4a4dfb89e88d56d6074af3",
        client_secret = "1fc50298d4b641e8abe1085658c1f715",
        redirect_uri = url_for("redirectPage", _external=True),
        scope = "user-library-read"
    )

@app.route('/authorize')
@cross_origin()
def authorize():
    sp_oauth = create_spotify_oauth()
    session.clear()
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session["token_info"] = token_info
    return redirect("/user-info")



@app.route('/logout')
def logout():
    for key in list(session.keys()):
        session.pop(key)
    return redirect('/')




#members API route
# @app.route("/grid", methods=['POST'])
# def show_grid():
#     query = request.data.decode() #handle null entries
#     resp = make_response({"song" : zonk.search_albums_by_name(query), "result" : "found"})
#     #resp.headers['Access-Control-Allow-Origin'] = '*'
#     return resp

# SEARCH BAR FUNCTIONALITY
# @app.route("/add", methods=['POST', 'GET'])
# def search_api():
#     query = request.args.get('q')
#     num = request.args.get('num')
#     tracks = add.add_song(query, num) # adds songs to tracks and returns list of images from API search

#     if tracks is not None:
#         print(query)
#         resp = make_response({"song" : tracks, "result" : "found" })
#     else:
#         resp = make_response({"song" :"none"})
#     #resp.headers['Access-Control-Allow-Origin'] = '*'
#     return resp


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def fileUpload():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return make_response({"song" :"none"}) #send_from_directory(app.config["UPLOAD_FOLDER"], filename, as_attachment=True)
    print("ealry")
    return make_response("boo you suck")


# @app.route("/searchsong", methods=['POST', 'GET'])
# def searchsong():
#     dance = int(request.args.get('dance')) / 100
#     pop = int(request.args.get('pop'))
#     mood = int(request.args.get('mood')) / 100
#     intensity = int(request.args.get('energy')) / 100
#     genres = request.get_json()["genres"]
#     print(genres)
#     artists = request.get_json()["artists"]
#     print(artists)


#     albums = zonk.covers_from_ATTR_GENRE_ARTIST(tuple(genres), tuple(artists), dance, pop, mood, intensity) #gets songs that meet quantitative music queries USE BETWEEN

#     #albums = []                                                            #gets songs that meet genre queries ? join on a subset of the artist relation and make above one function
#     #make response
#     if albums is not None:
#         #return catalog
#         resp = make_response({"catalog" : albums})

#         #write to temp urls.txt folder
#         with open("urls.txt", 'w') as f:
#             for alb in albums:
#                 if alb is not None:
#                     print(alb)
#                     f.write(alb + '\n')

#     else:
#         resp = make_response({"catalog" :"none"})
#     #resp.headers['Access-Control-Allow-Origin'] = '*'

#     return resp

# @app.route("/getlist", methods=["GET", "POST"])
# def get_list():
#     return make_response({"optionList": zonk.get_lists()})


@app.route("/filegen", methods=['POST', 'GET'])
def filegen():
    stamp = request.args.get('stamp')
    target = request.args.get('target')
    print("tryan musify ", target)
    tile_dir = os.getcwd() + '/' + stamp
    #os.mkdir(tile_dir)
    # with open("urls.txt", 'r') as f:
    #     for line in f:
    #         img_data = requests.get(line.rstrip()).content
    #         with open(tile_dir + '/' + line[-24:] + '.jpg', 'wb') as handler:
    #             handler.write(img_data)


    #urls = request.json['body']
    #print("pass me", urls)
    mosaic.main(os.path.join(app.config['UPLOAD_FOLDER'], target), "urls.txt")
    resp = make_response({"result" : "success"})
    #resp.headers['Content-Length'] = os.path.getsize("mosaic.jpeg")


    #return send_file("./mosaic.jpeg")
    #return send_from_directory(DOWNLOAD_DIRECTORY, "/mosaic.jpeg")
    return resp

@app.route("/get-image")
def image_endpoint():
    return send_file("mosaic.jpeg", mimetype='image/jpeg')

@app.route("/get-musaic-outfile")
def image_endpoint_musaic():
    return send_file("musaic_outfiles/musaic_outfile.jpeg", mimetype='image/jpeg')

@app.route("/get-default-img")
def default_image_endpoint():
    return send_file("target_images/kermit.png", mimetype='image/png')

@app.route("/")
def show():
    resp = make_response("check snap") #here you could use make_response(render_template(...)) too
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

# @app.route("/create", methods=['POST', 'GET'])
# def create():
#     cart = request.args.get('cart')
#     sort = request.args.get('sort')
#     arrange = request.args.get('arrange')

#     # split on the : delimiter
#     # cart = cart.split('~')
#     if(os.path.isfile("./musaic_outfiles/musaic_outfile.jpeg")):
#         os.remove("./musaic_outfiles/musaic_outfile.jpeg")

#     # create the musaic
#     outfile_path = create_function(cart, sort, arrange)

#     resp = make_response({"result": "success", "outfile_path": outfile_path})
#     resp.headers['Access-Control-Allow-Origin'] = '*'

#     return resp


if __name__ == "__main__":
    app.run(debug=True, threaded=True)
