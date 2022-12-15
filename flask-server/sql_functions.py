from mysql.connector import connect, Error
import time
import csv

# globals
hostname = 'localhost'
username = 'ckuczun'
pw = 'pwpwpwpw'
db = 'ckuczun'


# create connection to communicate with DB
def create_db_connection():
    connection = None
    try:
        connection = connect(
            host = hostname,
            user = username,
            passwd = pw,
            database = db
        )
        print("Database connection successful")
    except Error as error:
        print(f"Error: '{error}'")
    return connection

# connect to mysql server
def create_server_connection():
    connection = None
    try:
        connection = connect(
            host = hostname,
            user = username,
            passwd = pw
        )
        print("Server connection successful!")
    except Error as error:
        print(f"Error: '{error}'")
    return connection

# establish connection (connect to server / db)
server = create_server_connection()
connection = create_db_connection()

# execute any queries
def execute_query(query):
    cursor = connection.cursor(buffered=True)
    res = []
    try:
        cursor.execute(query)
        connection.commit()
        if query[:6] == 'SELECT':
            res = cursor.fetchall()
    except (Error, TypeError) as error:
        print(f"Error: '{error}' with {query}")
        res = []

    # return all results or empty array
    if res is None:
        res = []
    return res



# SEARCH #############################################################

# WORKS
def search_tracks_by_song(track):
    query = "SELECT album_id FROM musaic_tracks WHERE track_name like '%{}%' ORDER BY CASE WHEN track_name LIKE '{}' THEN 1 WHEN track_name LIKE '{}%' THEN 2 WHEN track_name LIKE '%{}' THEN 4 ELSE 3 END limit 50;".format(track, track, track, track)

    res = execute_query(query)
    output = []
    for r in res:
        output.append(r[0])

    # returns the album_id that the song is associated with
    return output

# WORKS
def search_albums_by_name(name):
    query = "SELECT album_cover FROM musaic_albums WHERE album_name like '%{}%' ORDER BY CASE WHEN album_name LIKE '{}' THEN 1 WHEN album_name LIKE '{}%' THEN 2 WHEN album_name LIKE '%{}' THEN 4 ELSE 3 END limit 50;".format(name, name, name, name)

    res = execute_query(query)
    output = []
    for r in res:
        output.append(r[0])

    # return the album_cover link corresponding to the album
    return output

# WORKS
def search_albums_by_artist(artist):
    query = "SELECT album_cover FROM musaic_albums WHERE artist like '%{}%' limit 50;".format(artist)
    res = execute_query(query)
    output = []
    for r in res:
        output.append(r[0])

    # returns possible matching album cover urls associated with artist name
    return output

# WORKS
def search_albums_by_id(id):
    query = "SELECT album_cover FROM ALBUMS WHERE album_id = '{}' limit 50;".format(id)
    res = execute_query(query)
    output = []
    for r in res:
        output.append(r[0])

    # returns the album url associated with the album id
    return output

# TODO: IMAGES table needs to be populated
def search_images_by_id(id):
    query = "SELECT * FROM IMAGES WHERE album_id = '{}' limit 50;".format(id)
    res = execute_query(query)
    output = []
    for r in res:
        output.append(r[0])
    return output

# WORKS
# inputs: attribute to search by, the minimum value
def search_song_attributes(attr, min):
    q1 = "SELECT album_id FROM TRACKS WHERE {} > {} ORDER BY {} DESC limit 50;".format(*[attr, min, attr])
    print(q1)
    id = execute_query(q1)

    if len(id) > 0:
        output = []
        for i in id:
            output.append(i[0])

        output2 = []
        for o in output:
            q2 = "SELECT album_cover FROM ALBUMS WHERE album_id = '{}' limit 50;".format(o)
            urls = execute_query(q2)
            for u in urls:
                output2.append(u[0])

        # returns top 50 album urls (images) for songs with matching attributes
        return output2

    else:
        return NULL

# WORKS
# search artists table to see if it exists
def search_for_artist_existence(artist_id):
    q = "SELECT * FROM ARTISTS WHERE artist_id = '{}';".format(artist_id)
    res = execute_query(q)

    # does not exist in table
    if len(res) == 0: return False

    # already exists in table
    return True

# WORKS
# search artists table to see if it exists
# if exists, return ALBUM_ID and IMAGE_URL
def search_for_album_existence(album_id):
    q = "SELECT * FROM ALBUMS WHERE album_id = '{}';".format(album_id)
    res = execute_query(q)

    # does not exist in table
    if len(res) == 0: return False

    # already exists in table
    return [res[0][0], res[0][2]]


# INSERT #############################################################
# inputs: array of values (row to insert)
def insert_into_tracks(data):
    query = '''INSERT IGNORE INTO TRACKS (track_name, album_id, party_power, intensity, mood, popularity, artist_id) VALUES ("{}","{}",{},{},{},{},"{}");'''.format(*data)
    success = execute_query(query)
    if success: return success
    return False

def insert_into_albums(data):
    query = '''INSERT IGNORE INTO ALBUMS (album_id, album_name, album_cover, artist_id, release_year) VALUES ("{}","{}","{}","{}",{});'''.format(*data)
    return execute_query(query)

def insert_into_images(data):
    query = "INSERT IGNORE INTO IMAGES (album_id, mean_hue, stdev_hue, mean_sat, stdev_sat, mean_bright, stdev_bright) VALUES ('{}',{},{},{},{},{},{});".format(*data)
    return execute_query(query)

def insert_into_artists(data):
    query = '''INSERT IGNORE INTO ARTISTS (artist_id, artist_name, genre) VALUES ("{}","{}","{}");'''.format(*data)
    return execute_query(query)


# DELETE #############################################################

def delete_song_and_album(name):
    q1 = "SELECT album_id FROM TRACKS WHERE track_name like '{}';".format(name)
    id_to_delete = execute_query(q1)[0][0]

    q2 = "DELETE FROM TRACKS WHERE album_id = '{}';".format(id_to_delete)
    res = execute_query(q2)

    q3 = "DELETE FROM IMAGES WHERE album_id = '{}';".format(id_to_delete)
    res = execute_query(q3)

    q4 = "DELETE FROM ALBUMS where album_id = '{}';".format(id_to_delete)
    res = execute_query(q3)



# UPDATE #############################################################

def update_popularity(val, song):
    query = "UPDATE TRACKS SET popularity = {} WHERE track_name like '%{}%';".format(val, song)
    res = execute_query(query)
    return res



# GET URL FROM SONG NAME (JOIN) #######################################
# WORKS
def get_url_from_song_name(song):
    query = "SELECT album_cover FROM TRACKS INNER JOIN ALBUMS ON TRACKS.album_id=ALBUMS.album_id WHERE track_name like '%{}%' ORDER BY CASE  WHEN track_name LIKE '{}' THEN 1 WHEN track_name LIKE '{}%' THEN 2 WHEN track_name LIKE '%{}' THEN 4 ELSE 3 END;".format(song, song, song, song)
    res = execute_query(query)
    output = []
    for r in res:
        output.append(r[0])

    # returns matching album covers associated with queried songs
    return output


# GET URL FROM SONG NAME (JOIN) #######################################
# WORKS
def get_url_from_artist_name(artist):
    query = "SELECT album_cover FROM ARTISTS INNER JOIN ALBUMS ON ALBUMS.artist_id=ARTISTS.artist_id WHERE artist_name LIKE '%{}%' ORDER BY CASE WHEN artist_name LIKE '{}' THEN 1 WHEN artist_name LIKE '{}%' THEN 2 WHEN artist_name LIKE '%{}' THEN 4 ELSE 3 END limit 50;".format(artist, artist, artist, artist)
    res = execute_query(query)
    output = []
    for r in res:
        output.append(r[0])

    # returns album cover urls that correspond to the artist name
    return output


# USER SETS CUSTOM MIN PARAMS WHEN SEARCHING FOR SONGS ################
# WORKS

# genres & artists are both LISTS that are searched for matching values
def covers_from_min_attribute_vals(party_power, popularity, mood, intensity, genres, artists):
    #query = "SELECT album_cover FROM TRACKS INNER JOIN ALBUMS ON TRACKS.album_id=ALBUMS.album_id WHERE party_power >= {} and popularity >= {} and mood >= {} and intensity >= {} ORDER BY popularity limit 50;".format(party_power, popularity, mood, intensity)
    query = '''SELECT album_cover from ALBUMS inner join TRACKS on ALBUMS.album_id = TRACKS.album_id where TRACKS.party_power >= {} and TRACKS.popularity >= {} and TRACKS.mood >= {} and TRACKS.intensity >= {};'''.format(party_power, popularity, mood, intensity);
    print(query)
    res = execute_query(query)
    output = []
    for r in res:
        print(r)
        # check for matching genre & artist ... only append to output if fits these parameters

        return None
        output.append(r[0])

    # returns album covers of songs that fit the minimum desired attribute values
    return output

# get the URL with the correct minimum parameters + genres/artists if there are any
def covers_from_ATTR_GENRE_ARTIST(genres, artists, party_power, popularity, mood, intensity):
    print(genres)
    print(artists)
    print("HERE+++++++++++++++++++++++++++++++++")
    # search using both specific artists & genres
    if len(genres) > 0 and len(artists) > 0:
        print("in 1st")
        query = '''SELECT album_cover from ALBUMS inner join (SELECT album_id from TRACKS INNER JOIN ARTISTS on TRACKS.artist_id=ARTISTS.artist_id WHERE (ARTISTS.genre IN {} OR ARTISTS.artist_name IN {}) and TRACKS.party_power >= {} and TRACKS.popularity >= {} and TRACKS.mood >= {} and TRACKS.intensity >= {}) RES on ALBUMS.album_id=RES.album_id'''.format(genres, artists, party_power, popularity, mood, intensity)

    # only artists, no genres
    elif len(genres) == 0 and len(artists) > 0:
        print("in 2nd")
        query = '''SELECT album_cover from ALBUMS inner join (SELECT album_id from TRACKS INNER JOIN ARTISTS on TRACKS.artist_id=ARTISTS.artist_id WHERE ARTISTS.artist_name IN {} and TRACKS.party_power >= {} and TRACKS.popularity >= {} and TRACKS.mood >= {} and TRACKS.intensity >= {}) RES on ALBUMS.album_id=RES.album_id'''.format(artists, party_power, popularity, mood, intensity)

    # only genres, no artists
    elif len(artists) == 0 and len(genres) > 0:
        print("in 3rd")
        query = '''SELECT album_cover from ALBUMS inner join (SELECT album_id from TRACKS INNER JOIN ARTISTS on TRACKS.artist_id=ARTISTS.artist_id WHERE ARTISTS.genre IN {} and TRACKS.party_power >= {} and TRACKS.popularity >= {} and TRACKS.mood >= {} and TRACKS.intensity >= {}) RES on ALBUMS.album_id=RES.album_id'''.format(genres, party_power, popularity, mood, intensity)

    # no specific artists or genres
    elif len(artists) == 0 and len(genres) == 0:
        print("in 4th")
        query = '''SELECT album_cover from ALBUMS inner join (SELECT album_id from TRACKS INNER JOIN ARTISTS on TRACKS.artist_id=ARTISTS.artist_id WHERE TRACKS.party_power >= {} and TRACKS.popularity >= {} and TRACKS.mood >= {} and TRACKS.intensity >= {}) RES on ALBUMS.album_id=RES.album_id'''.format(party_power, popularity, mood, intensity)

    print(query)
    res = execute_query(query)
    output = []
    for r in res:
        print(r)
        # check for matching genre & artist ... only append to output if fits these parameters

        output.append(r[0])

    # returns album covers of songs that fit the minimum desired attribute values
    return output


# SEARCH ARTISTS BY GENRE ##############################################
# WORKS
# search by genre & whether you want the album cover results to be displayed oldest-first or newest-first
# inputs: genre, ASC/DESC
def search_by_genre(g, order):
    query = "SELECT album_cover FROM ARTISTS INNER JOIN ALBUMS ON ARTISTS.artist_id=ALBUMS.artist_id WHERE genre like '{}' ORDER BY release_year {} limit 50;".format(g, order)
    res = execute_query(query)
    output = []
    for r in res:
        output.append(r[0])

    # returns up to 50 matching album covers in desired time-order
    return output


# TODO: SEARCH by USER INPUT first, then search by color (to fit the pattern established by user on web app)
# inputs: the result of user input, the color we want to match most closely
# outputs: a 'best fit' result that matches the color we want most closely
def search_for_color_fit(output, color):
    min_diff = 0
    min_id = None

    for entry in output:
        # match the color in the images table to the one provided to this function
        search = search_images_by_id(entry) # each id should be unique... ?
        curr_diff = abs(search[1] - color) # ! this would only work if ONE id matches to one entry returned !

        # track the variation & update the current
        if curr_diff < min_diff:
            min_diff = curr_diff
            min_id = search[0]

    # return the album_id with smallest difference in color
    if min_id is None: return NULL # error checking
    return min_id


# get visual attributes from ID
# output order: mean_hue, stdev_hue, mean_sat, stdev_sat, mean_bright, stdev_bright
def get_attributes_from_id(input):
    query = "SELECT mean_hue, stdev_hue, mean_sat, stdev_sat, mean_bright, stdev_bright from IMAGES where album_id = '{}';".format(input)
    res = execute_query(query)
    output = []
    for r in res:
        for i in range(6): 
            output.append(r[i])

    return output

# get all genres that appear at least 9 nines along with their respective frequencies
def get_all_genres():
    query = 'SELECT genre, count(*) freq from ARTISTS group by genre order by count(*) desc;'
    res = execute_query(query)
    output = []
    for r in res:
        if r[1] >= 9:
            output.append({"value": r[1], "label" :r[0]})
    print(output)
    # return all genres currently in DB (most popular first)
    return output

#get all artists
def get_all_artists():
    query = 'SELECT artist_name from ARTISTS group by artist_name order by count(*) desc;'
    res = execute_query(query)
    output = []
    for r in res:
        output.append(r[0])

    # return all genres currently in DB (most popular first)
    return output

def get_lists():
    query = 'SELECT artist_name from ARTISTS group by artist_name order by count(*) desc;'
    res = execute_query(query)
    output = {}
    temp = []
    for r in res:
        temp.append({"value": r[0], "label" :r[0]})
    output["artists"] = temp
    query = 'SELECT genre, count(*) freq from ARTISTS group by genre order by count(*) desc;'
    res = execute_query(query)
    temp = []
    for r in res:
        if r[1] >= 9:
            temp.append({"value": r[1], "label" :r[0]})
    output["genres"] = temp
    return output



# get ALBUM ID from ALBUM URL
def get_id_from_url(data):
    query = "SELECT album_id from ALBUMS where album_cover='{}';".format(data)
    res = execute_query(query)
    output = ""
    if len(res) > 0: 
        for r in res:
            output = r[0]
    # return string with matching album id
    return output


# print(get_all_genres())
# print(search_by_genre('pop', 'ASC'))

# RETURN SOMETHING DIFFERENT APPARENTLY
#print(search_for_artist_existence('0iOVhN3tnSvgDbcg25JoJb'))
# print(search_for_album_existence('2Hr6il1ZLPbeLnKUzhWkF6'))
# print(insert_into_tracks(['¡Corre!', '5koG6JeFEwcINyN1QuXyiq', 0.479, 0.477, 0.127, 71, '1mX1TWKpNxDSAH16LgDfiR']))
#print(insert_into_tracks(["test", "test", 1, 1, 1, 1, "test"]))
#rint(insert_into_albums(["test", "test", "test", "test", 1111]))
#print(insert_into_images(["test", 1, 1, 1, 1, 1, 1]))
#print(insert_into_artists(["test", "test", "test"]))
genres = ('pop', 'hi')
artists = ('hello', 'hi')
# print(get_id_from_url('https://i.scdn.co/image/ab67616d0000b2737306cc70e6fd7464e59a0d20'))
print(get_attributes_from_id('5koG6JeFEwcINyN1QuXyiq'))
#print(covers_from_ATTR_GENRE_ARTIST(genres, artists, .5, 50, .5, .5))
