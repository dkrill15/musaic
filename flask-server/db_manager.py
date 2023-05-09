import csv
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Boolean
from classes import Base
import requests
import statistics
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import datetime
import json
import os


#engine = create_engine('postgresql://{}:{}@localhost/tastify'.format(os.environ.get("POSTGRE_US"), os.environ.get("POSTGRE_PW")))

engine = create_engine('postgresql://tynsxjqtfhievn:2d2cebfcec88756323909dbbad2323a7695b38d55161d3083f4c7ab06ea8a683@ec2-52-5-167-89.compute-1.amazonaws.com:5432/dfoch0qct6ehfr')

db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

Base.query = db_session.query_property()
Base.metadata.create_all(engine)


def init_db(): # 15 LOC


    from classes import User, Artist
    Base.metadata.create_all(bind = engine)

    CLIENT_ID = '617bb37b7d4a4dfb89e88d56d6074af3'
    CLIENT_SECRET = '1fc50298d4b641e8abe1085658c1f715'

    AUTH_URL = 'https://accounts.spotify.com/api/token'

    # POST
    auth_response = requests.post(AUTH_URL, {
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    })


    # convert the response to JSON
    auth_response_data = auth_response.json()

    # save the access token
    access_token = auth_response_data['access_token']

    headers = {
        'Accept' : 'application/json',  'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'.format(token=access_token), "country" : "US"
    }

    BASE_URL = 'https://api.spotify.com/v1/search?'

    artists = {}

    spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())
    #results = [i["id"] for i in spotify.artist_top_tracks("spotify:artist:0TnOYISbd1XYRBk9myaseg")["tracks"]]

    #r = requests.get("https://api.spotify.com/v1/artists/{}/top-tracks".format("0TnOYISbd1XYRBk9myaseg"), headers=headers).json()

    #print(results)



    for year in range(2019, 2022):
        print('getting{}'.format(year))
        next = BASE_URL + 'q=year:{}&type=track&limit={}'.format(year, 50)
        offset = 0
        pages = []
        while offset < 250:
            print("\tgetting page: {}".format(offset))
            r = spotify.search(q="year:{}".format(year), limit=50, offset=offset, type="artist")
            print(r)
            #print(next)
            #print(json.dumps(r, indent=2))
            if "error" in r.keys():
                break
            # pages.append( ( [   i["name"],
            #                     i["album"]["id"],
            #                     requests.get('https://api.spotify.com/v1/audio-features/{}'.format(i["id"]), headers=headers).json(),
            #                     i["popularity"],
            #                     i["album"]["artists"][0]["id"]
            #                     ] for i in r["tracks"]["items"] ) )
            
            for i in r["artists"]["items"]:
                artists[i["id"]] = {"name": i["name"], "followers": i.get("followers", {"total":0})["total"], "pop_score": i['popularity']}


            offset += 50
        print("finished year {}".format(year))

    for k, v in artists.items():
        top_songs = spotify.artist_top_tracks("spotify:artist:{}".format(k))["tracks"]
        top_songs = [i["id"] for i in top_songs]

        features = [i["danceability"] for i in spotify.audio_features(top_songs)]
        artists[k]["mood_score"] = statistics.mean(features)

        db_session.add(Artist(k, artists[k]["name"], artists[k]["pop_score"], artists[k]["mood_score"], "", datetime.datetime.now(), artists[k]["followers"]))

        print('added', artists[k]['name'])
    
    
    db_session.commit()


    # read in the subreddit lists from the given CSV and add the first 1000 SFW subreddits to your database by creating Subreddit objects

    # save the database

#create an engine for your DB using sqlite and storing it in a file named reddit.sqlite
if __name__ == '__main__':
    init_db()
