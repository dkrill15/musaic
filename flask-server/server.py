from flask import Flask, make_response, send_from_directory, request, send_file, flash, redirect, url_for, session
import sql_functions as zonk
import api_add as add
import mosaic
from create_musaic import create_function
import sys
import os, os.path
import requests
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import werkzeug.datastructures
import secrets


app = Flask(__name__)
CORS(app)
DOWNLOAD_DIRECTORY = os.getcwd()
UPLOAD_FOLDER = 'target_images'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
secret = secrets.token_urlsafe(32)
app.secret_key = secret

headers = werkzeug.datastructures.Headers()
headers.add('Content-Type', 'image/png')


#members API route
@app.route("/grid", methods=['POST'])
def show_grid():
    query = request.data.decode() #handle null entries
    resp = make_response({"song" : zonk.search_albums_by_name(query), "result" : "found"})
    #resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

# SEARCH BAR FUNCTIONALITY
@app.route("/add", methods=['POST', 'GET'])
def search_api():
    query = request.args.get('q')
    num = request.args.get('num')
    tracks = add.add_song(query, num) # adds songs to tracks and returns list of images from API search

    if tracks is not None:
        print(query)
        resp = make_response({"song" : tracks, "result" : "found" })
    else:
        resp = make_response({"song" :"none"})
    #resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


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


@app.route("/searchsong", methods=['POST', 'GET'])
def searchsong():
    dance = int(request.args.get('dance')) / 100
    pop = int(request.args.get('pop'))
    mood = int(request.args.get('mood')) / 100
    intensity = int(request.args.get('energy')) / 100
    genres = request.get_json()["genres"]
    print(genres)
    artists = request.get_json()["artists"]
    print(artists)


    albums = zonk.covers_from_ATTR_GENRE_ARTIST(tuple(genres), tuple(artists), dance, pop, mood, intensity) #gets songs that meet quantitative music queries USE BETWEEN

    #albums = []                                                            #gets songs that meet genre queries ? join on a subset of the artist relation and make above one function
    #make response
    if albums is not None:
        #return catalog
        resp = make_response({"catalog" : albums})

        #write to temp urls.txt folder
        with open("urls.txt", 'w') as f:
            for alb in albums:
                if alb is not None:
                    print(alb)
                    f.write(alb + '\n')

    else:
        resp = make_response({"catalog" :"none"})
    #resp.headers['Access-Control-Allow-Origin'] = '*'

    return resp

@app.route("/getlist", methods=["GET", "POST"])
def get_list():
    return make_response({"optionList": zonk.get_lists()})


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
    resp = make_response("hello") #here you could use make_response(render_template(...)) too
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route("/create", methods=['POST', 'GET'])
def create():
    cart = request.args.get('cart')
    sort = request.args.get('sort')
    arrange = request.args.get('arrange')

    # split on the : delimiter
    # cart = cart.split('~')
    if(os.path.isfile("./musaic_outfiles/musaic_outfile.jpeg")):
        os.remove("./musaic_outfiles/musaic_outfile.jpeg")

    # create the musaic
    outfile_path = create_function(cart, sort, arrange)

    resp = make_response({"result": "success", "outfile_path": outfile_path})
    resp.headers['Access-Control-Allow-Origin'] = '*'

    return resp


if __name__ == "__main__":
    app.run(debug=True, port=5014, host='0.0.0.0')
