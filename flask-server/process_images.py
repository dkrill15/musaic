import csv
from PIL import Image
import requests
import colorsys

def analyze_image(url, id):
    # get the image from url
    img = Image.open(requests.get(url, stream=True).raw)

    mean_hue = 0
    mean_sat = 0
    mean_bri = 0

    stdev_hue = 0
    stdev_sat = 0
    stdev_bri = 0

    var_hue = 0
    var_sat = 0
    var_bri = 0

    pixels = list(img.getdata())

    if(type(pixels) is list):

        hues = []
        sats = []
        bris = []

        # get the mean values of hue, brightness, saturation
        for pixel in pixels:

            r = 0
            g = 0
            b = 0

            try:
                r = pixel[0]/255 
            except:
                pass

            try:
                g = pixel[1]/255
            except:
                pass

            try:
                b = pixel[2]/255
            except:
                pass

            hsb = colorsys.rgb_to_hsv(r, g, b)
            h = hsb[0]*360
            hues.append(h)
            mean_hue += h

            s = hsb[1]*100
            sats.append(h)
            mean_sat += h

            b = hsb[2]*100
            bris.append(h)
            mean_bri += h
        
        count = len(hues)

        mean_hue = mean_hue/count
        mean_sat = mean_sat/count
        mean_bri = mean_bri/count

        # get standard deviations of hue, brightness, saturation
        for i in range(count):
            var_hue += (hues[i]-mean_hue)**2
            var_sat += (sats[i]-mean_sat)**2
            var_bri += (bris[i]-mean_bri)**2
        
        var_hue = var_hue/(count-1)
        var_sat = var_sat/(count-1)
        var_bri = var_bri/(count-1)

        stdev_hue = var_hue**0.5
        stdev_sat = var_sat**0.5
        stdev_bri = var_bri**0.5
        
    print("successfully inserted into IMAGES table")
    # return the elements necessary to append data into images
    return [id, mean_hue, stdev_hue, mean_sat, stdev_sat, mean_bri, stdev_bri]