import requests
import json
import sql_functions as sql
import process_images as process

def add_song(query, left):

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
        'Accept' : 'application/json',  'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'.format(token=access_token)
    }


    # base URL of all Spotify API endpoints
    BASE_URL = 'https://api.spotify.com/v1/search?'
    #
    #
    # ##cut here
    # songs = []
    # r = requests.get(BASE_URL + 'q=' + query + '&type=track&limit={}'.format(left), headers=headers).json()
    # songs = [ [   i["name"],
    #                             i["album"]["id"],
    #                             requests.get('https://api.spotify.com/v1/audio-features/{}'.format(i["id"]), headers=headers).json(),
    #                             i["popularity"],
    #                             i["preview_url"]
    #                     ] for i in r["tracks"]["items"] ]
    # images = []
    # prevs = []
    # for song in songs:
    #     if not sql.insert_song([song[0], song[1], song[2].get('danceability'), song[2].get('energy'), song[2].get('loudness'), song[2].get('valence'), song[3]]):
    #         print(song[0], "is already in the database.")
    #     alb =  sql.search_albums_by_id(song[1])
    #     print("alb is", alb)
    #     if (len(alb) == 0):
    #         r = requests.get('https://api.spotify.com/v1/albums/{}'.format(song[1]), headers=headers).json()
    #         sql.insert_album([r["id"], r["name"], r["artists"][0]["name"], r["images"][0]["url"]])
    #         print("we gotta addalbum")
    #         images.append(r["images"][0]["url"])
    #     else:
    #         images.append(alb[0])
    #     prevs.append(song[4])
    # images.extend(prevs)
    # print(images)
    #
    # ##cut here


    ####songs_new

    r = requests.get(BASE_URL + 'q=' + query + '&type=track&limit={}'.format(left), headers=headers).json()
    if "error" in r.keys():
        return []

    songs =      [ [   i["name"],
                    i["album"]["id"],
                    requests.get('https://api.spotify.com/v1/audio-features/{}'.format(i["id"]), headers=headers).json(),
                    i["popularity"],
                    i["album"]["artists"][0]["id"],
                    i["preview_url"]
                    ] for i in r["tracks"]["items"] ]

    images = []
    prevs = []
    ids = []


    #for each tile in 9-song group
    for song in songs:
        print(song[1], song[0])

        #inserts track if not in tracks
        if sql.insert_into_tracks([song[0].replace("\"", "'"), song[1], song[2].get('danceability', 0), song[2].get('energy', 0), song[2].get('valence', 0), song[3], song[4]]):
            print(song[0] + " already in the database")

        #inserts album if not in albums
        cover = sql.search_for_album_existence(song[1])
        if not cover: #make it return album_cover if not
            r = requests.get('https://api.spotify.com/v1/albums/{}'.format(song[1]), headers=headers).json() #gets the album associated with song
            if len(r.get("images", [])) > 0: #won't add empty album stuffs
                sql.insert_into_albums([r["id"], r["name"].replace("\"", "'"), r["images"][0]["url"], song[4], r.get("release_date", "None")[:4]]) #inserts albums

                #process album image (at r["images"][0]["url"]) and insert data into images dataset using id (at r["id"])
                new_data = process.analyze_image(r["images"][0]["url"], r["id"]) #process
                sql.insert_into_images(new_data) #insert
                images.append(r["images"][0]["url"])
                ids.append(r["id"])
        else:
            images.append(cover[1])
            ids.append(cover[0])

        #inserts artists/genre info if not in artists
        if not sql.search_for_artist_existence(song[4]):
            r = requests.get('https://api.spotify.com/v1/artists/{}'.format(song[4]), headers=headers).json()
            print("adding", r.get("name", ""), "to database")
            for genre in r.get("genres", []):
                sql.insert_into_artists([r["id"], r.get("name", ""), genre])

        prevs.append(song[5])
    #adds ids and previews to list that we return
    images.extend(prevs)
    images.extend(ids)







    return images
