import requests
from bs4 import BeautifulSoup as bs
import json
import csv
import sql_functions as sql

CLIENT_ID = 'ID HERE'
CLIENT_SECRET = 'SECRET HERE'

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
    'Accept' : 'application/json',  'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'.format(token=access_token)
}


# base URL of all Spotify API endpoints
BASE_URL = 'https://api.spotify.com/v1/search?'

limit = 50
songs = []
albums = []

songf = open('./songs_new.csv', 'a')
albumf = open('./albums_new.csv', 'a')
artistf = open('./artist_new.csv', 'a')
songwriter = csv.writer(songf)
albumwriter = csv.writer(albumf)
artistwriter = csv.writer(artistf)

#1960 - test, halfway completed
#1961 - 1975 : 100 - botched - used loudness
#1975 - 1990 : 150
#1990 - 2005 : 200
#REDO 2002-2005
#2005 - 2020 : 250
#2020 - 2023 : 300

for year in range(2000, 2005):
    print('getting{}'.format(year))
    next = BASE_URL + 'q=year:{}&type=track&limit={}'.format(year, limit)
    offset = 0
    pages = []
    while offset < 200:
        print("\tgetting page: {}".format(offset))
        #print(next)
        #print(json.dumps(r, indent=2))
        if "error" in r.keys():
            break
        pages.append( ( [   i["name"],
                            i["album"]["id"],
                            requests.get('https://api.spotify.com/v1/audio-features/{}'.format(i["id"]), headers=headers).json(),
                            i["popularity"],
                            i["album"]["artists"][0]["id"]
                            ] for i in r["tracks"]["items"] ) )
        next = r["tracks"]["next"]
        offset = r["tracks"]["offset"]

    for page in pages:
        print(page)
        for song in page:
            print(year, song[1], song[0])
            #songwriter.writerow([song[0], song[1], song[2].get('danceability'), song[2].get('energy'), song[2].get('valence'), song[3], song[4]])
            if sql.insert_into_tracks([song[0], song[1], song[2].get('danceability'), song[2].get('energy'), song[2].get('valence'), song[3], song[4]]):
                print(song[0] + " already in the database")

            if not sql.search_for_album_existence(song[1]):
                r = requests.get('https://api.spotify.com/v1/albums/{}'.format(song[1]), headers=headers).json()
                if len(r.get("images", [])) > 0:
                    #albumwriter.writerow([r["id"], r["name"], r["artists"][0]["name"], r["images"][0]["url"], r["release_date"][:4]])
                    sql.insert_into_albums([r["id"], r["name"], r["images"][0]["url"], song[4], year])
            if not sql.search_for_artist_existence(song[4]):
                r = requests.get('https://api.spotify.com/v1/artists/{}'.format(song[4]), headers=headers).json()
                print("adding", r.get("name", ""), "to database")
                for genre in r.get("genres", []):
                    #artistwriter.writerow(r["id"], r["name"], genre])
                    sql.insert_into_artists([r["id"], r.get("name", ""), genre])
    print("finished {} : size = {}".format(year, offset))


songf.close()
albumf.close()
artistf.close()
