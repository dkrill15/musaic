# import whatevr
import sys
import os, os.path
import requests
import json
import sql_functions as sql
import process_images as process
from PIL import Image, ImageOps
from multiprocess import Process, Queue, cpu_count
from io import BytesIO
import time

def create_function(cart, sort, arrange):
    # split cart on its delimiter
    cart = cart.split('~')
    print(f"Length of cart: {len(cart)}")

    # use sql to get the ids by the urls
    ids = []
    for url in cart:
        ids.append(sql.get_id_from_url(url))

    # use sql to get attributes by id
    attributes = []
    for song_id in ids:
        attr = dict()
        res = sql.get_attributes_from_id(song_id)
        # print(res)
        if(len(res) == 6):
            attr['hue'] = res[0]
            attr['sd_hue'] = res[1]
            attr['sat'] = res[2]
            attr['sd_sat'] = res[3]
            attr['bright'] = res[4]
            attr['sd_bright'] = res[5]
            attr['hsb'] = (attr['hue'] + attr['sat'] + attr['bright'])/3
            attr['sd_hsb'] = (attr['sd_hue'] + attr['sd_sat'] + attr['sd_bright'])/3
        else:
            # print(f'{song_id} bad - no analyze')

            attr['hue'] = 0
            attr['sd_hue'] = 0
            attr['sat'] = 0
            attr['sd_sat'] = 0
            attr['bright'] = 0
            attr['sd_bright'] = 0
            attr['hsb'] = 0
            attr['sd_hsb'] = 0
        attributes.append(attr)

    # finally, combine the urls and attributes for sorting
    joined = []
    for i in range(len(cart)):
        joined.append([cart[i], ids[i], attributes[i]])
        # print(joined[i][0])

    print(f"Len joined: {len(joined)}")

    # sorts the list by different values, depending on user choice
    sortedList = []
    if(sort == "hue"):
        sortedList = sorted(joined, key=lambda x: (x[2]['hue']))
    elif(sort == "sat"):
        sortedList = sorted(joined, key=lambda x: (x[2]['sat']))
    elif(sort == "bright"):
        sortedList = sorted(joined, key=lambda x: (x[2]['bright']))
    elif(sort == "hsb"):
        sortedList = sorted(joined, key=lambda x: (x[2]['hsb']))
    elif(sort == "stdev_hue"):
        sortedList = sorted(joined, key=lambda x: (x[2]['sd_hue']))
    elif(sort == "stdev_sat"):
        sortedList = sorted(joined, key=lambda x: (x[2]['sd_sat']))
    elif(sort == "stdev_bright"):
        sortedList = sorted(joined, key=lambda x: (x[2]['sd_bright']))
    elif(sort == "stdev_hsb"):
        sortedList = sorted(joined, key=lambda x: (x[2]['sd_hsb']))

    # for i in range(len(cart)):
    #         print(sortedList[i])

    print(f"Len sorted: {len(sortedList)}")


    # ARRANGING
    arranged = []
    if(arrange == "up"):
        arranged = [
            sortedList[7], sortedList[6], sortedList[8],
            sortedList[4], sortedList[3], sortedList[5],
            sortedList[1], sortedList[0], sortedList[2]
        ]
    elif(arrange == "down"):
        arranged = [
            sortedList[1], sortedList[0], sortedList[2],
            sortedList[4], sortedList[3], sortedList[5],
            sortedList[7], sortedList[6], sortedList[8]
        ]
    elif(arrange == "left"):
        arranged = [
            sortedList[2], sortedList[5], sortedList[8],
            sortedList[0], sortedList[3], sortedList[6],
            sortedList[1], sortedList[4], sortedList[7]
        ]
    elif(arrange == "right"):
        arranged = [
            sortedList[7], sortedList[4], sortedList[1],
            sortedList[6], sortedList[3], sortedList[0],
            sortedList[8], sortedList[5], sortedList[2]
        ]
    elif(arrange == "up-right"):
        arranged = [
            sortedList[4], sortedList[6], sortedList[8],
            sortedList[1], sortedList[3], sortedList[7],
            sortedList[0], sortedList[2], sortedList[5]
        ]
    elif(arrange == "up-left"):
        arranged = [
            sortedList[8], sortedList[6], sortedList[4],
            sortedList[7], sortedList[3], sortedList[1],
            sortedList[5], sortedList[2], sortedList[0]
        ]
    elif(arrange == "down-right"):
        arranged = [
            sortedList[0], sortedList[2], sortedList[5],
            sortedList[1], sortedList[3], sortedList[7],
            sortedList[4], sortedList[6], sortedList[8]
        ]
    elif(arrange == "down-left"):
        arranged = [
            sortedList[5], sortedList[2], sortedList[0],
            sortedList[7], sortedList[3], sortedList[1],
            sortedList[8], sortedList[6], sortedList[4]
        ]

    print(f"Len arranged: {len(arranged)}")

    # empty list to store images
    imgs = []

    print(arranged)

    # open all of the urls as PIL imgs
    for t in arranged:
        url = t[0]
        print(url)
        imgs.append(Image.open(requests.get(url, stream=True).raw))

    # row 1
    mod1 = concat_h(imgs[0], imgs[1])
    row1 = concat_h(mod1, imgs[2])

    # row 2
    mod2 = concat_h(imgs[3], imgs[4])
    row2 = concat_h(mod2, imgs[5])

    # row 3
    mod3 = concat_h(imgs[6], imgs[7])
    row3 = concat_h(mod3, imgs[8])

    # join vertically
    two_thirds = concat_v(row1, row2)
    full_musaic = concat_v(two_thirds, row3)

    # return it?
    # timestr = time.strftime("%Y%m%d-%H%M%S")
    # outfile = "./musaic_outfiles/musaic_" + timestr + ".jpeg"
    outfile = "./musaic_outfiles/musaic_outfile.jpeg"

    full_musaic.save(outfile)
    os.chmod(outfile, 0o777)
    print(f"Musaic saved to {outfile}")
    return outfile

# concats two images horizontally
def concat_h(im1, im2):
    dst = Image.new('RGB', (im1.width + im2.width, im1.height))
    dst.paste(im1, (0, 0))
    dst.paste(im2, (im1.width, 0))
    return dst

# concats two images vertically
def concat_v(im1, im2):
    dst = Image.new('RGB', (im1.width, im1.height + im2.height))
    dst.paste(im1, (0, 0))
    dst.paste(im2, (0, im1.height))
    return dst
