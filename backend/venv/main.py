from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import numpy as np
import cv2 as cv
import os
import base64
import matplotlib.pyplot as plt
import math
import json

app = Flask(__name__)
cors = CORS(app, origins="*")

@app.route("/predictLocations", methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        # cvImg = readb64(request.args.get("src"))
        return jsonify({
            "prediction": [{"x":0.5,"y":0.5},{"x":0.3,"y":1},{"x":0.2,"y":0.4}]
            # "prediction": getLocsUsingEdges(cvImg)
        })
    elif request.method == 'POST':
        req = request.get_json()
        b64 = (req['headers']['body']['src'])
        cvImg = readb64(b64)
        return jsonify({
            "prediction": getLocsUsingEdges(cvImg)
            # "prediction": [{"x":0.5,"y":0.5},{"x":0.3,"y":1},{"x":0.2,"y":0.4}]
        })
    return None

def readb64(uri):
    im_b64 = uri.split(',')[1]
    im_b64 = im_b64.replace(" ","+")
    im_bytes = base64.b64decode(im_b64)
    im_arr = np.frombuffer(im_bytes, dtype=np.uint8)
    img = cv.imdecode(im_arr, flags=cv.IMREAD_GRAYSCALE)
    img = np.reshape(img, [img.shape[0], img.shape[1]])
    return img

def writeb64(img):
    _, im_arr = cv.imencode('.png', img)  # im_arr: image in Numpy one-dim array format.
    im_bytes = im_arr.tobytes()
    im_b64 = base64.b64encode(im_bytes)
    return im_b64

def getLocsUsingEdges(img):
    edges = cv.Canny(img,100,200)
    locs = []
    height,width = img.shape[0],img.shape[1]
    avgDarkness = np.sum(img)/(height*width)
    limits = []

    for i in range(int(height*0.2), height-50,3):
        for j  in range(int(width*0.2),int(width*0.8),3):
            flag = True
            locDarkness = np.sum(img[i-5:i+5,j-5:j+5])/100 # brightness of the area beneath and around the edge.
            for p in limits:
                if i-p[0]<60 and j-p[1]<60:
                    flag = False
                    break
            if flag and edges[i,j] == 255 and avgDarkness - locDarkness > 25:
                print(avgDarkness - locDarkness)
                limits.append([i,j])
                locs.append({"x":j/width,"y":i/height})
    return locs

def sumSquare(img, x, y, n):
    sum = 0
    for i in range(x,x+n):
        for j in range(y,y+n):
            sum += int(img[i][j])
    return sum


def checkByRegion(img, regionSize=30):
    """
    Summary: Checks each region and surrounding region. If the inner region is significantly darker, we expect a fly. This is a
             heuristic method that could use refinement.
    """
    height,width = img.shape[0],img.shape[1]
    darkCenters = [] # X,Y,DIFF triples -> pick only the top n...
    for i in range(100, height-30, regionSize):
        for j in range(100, width-100, regionSize):
            outerSum = np.sum(img[i:i+regionSize,j:j+regionSize])
            innerSum = np.sum(img[i+int(regionSize/4):i+int(3*regionSize/4),j+int(regionSize/4):j+int(3*regionSize/4)])
            outerAvg = (outerSum-innerSum)/((regionSize**2)-(regionSize/2)**2)
            innerAvg = innerSum/((regionSize/2)**2) 
            if innerAvg - outerAvg > 10:
                darkCenters.append({"x":(j+regionSize/2)/width,"y":(i+regionSize/2)/height,"diff":innerAvg-outerAvg})
    return darkCenters


def getDarkCenters(img, innerRadius, outerRadius, threshold):
    darkCenters = []
    radDiff = outerRadius-innerRadius
    outerSums = np.ones(shape=(len(img), len(img[0])))*-1
    innerSums = np.ones(shape=(len(img), len(img[0])))*-1
    outerSums[0,0] = sumSquare(img, 0, 0, outerRadius)
    innerSums[radDiff, radDiff] = sumSquare(img, radDiff, radDiff, innerRadius)
    
    #calculate all row sums
    rowLeftSums = np.zeros(shape=(len(img), len(img[0])), dtype=np.int64)
    colTopSums = np.zeros(shape=(len(img), len(img[0])), dtype=np.int64)
    for row in range(len(img)):
        for col in range(len(img[0])):
            if col == 0:
                rowLeftSums[row][col] = int(img[row][col])
                continue
            rowLeftSums[row][col] = int(img[row][col]) + rowLeftSums[row][col-1]
    #calculate all col sums
    for col in range(len(img[0])):
        for row in range(len(img)):
            if row == 0:
                colTopSums[row][col] = img[row][col]
                continue
            colTopSums[row][col] = int(img[row][col]) + colTopSums[row-1][col]

    # calculate outer box sums
    for row in range(0, len(img)-outerRadius,):
        for col in range(0, len(img[0])-outerRadius):
            if row == 0 and col == 0:
                continue
            if col == 0:
                # outerChange = 0
                # for i in range(outerRadius):
                #     outerChange -= int(img[row-1][col+i])
                #     outerChange += int(img[row+outerRadius-1][col+i])
                # outerSums[row][col] = outerSums[row-1][col]+outerChange
                outerSums[row][col] = outerSums[row-1][col]-rowLeftSums[row-1][col+outerRadius-1]+rowLeftSums[row+outerRadius-1][col+outerRadius-1]
            elif row == 0:
                outerSums[row][col] = outerSums[row][col]-colTopSums[row+outerRadius-1][col-1]+colTopSums[row+outerRadius-1][col+outerRadius-1]
            else:
                # outerChange = 0
                # for i in range(outerRadius):
                #     outerChange -= int(img[row+i][col-1])
                #     outerChange += int(img[row+i][col+outerRadius])
                # outerSums[row][col] = outerSums[row][col-1]+outerChange
                outerSums[row][col] = outerSums[row][col-1]-(colTopSums[row+outerRadius-1][col-1]-colTopSums[row-1][col-1])+(colTopSums[row+outerRadius-1][col+outerRadius-1]-colTopSums[row-1][col+outerRadius-1])
    # calculate inner box sums
    for row in range(radDiff, len(img)-outerRadius+radDiff):
        for col in range(radDiff, len(img[0])-outerRadius+radDiff):
            if row == radDiff and col == radDiff:
                continue
            if col == radDiff:
                innerChange = 0
                for i in range(innerRadius):
                    innerChange -= int(img[row-1][col+i])
                    innerChange += int(img[row+innerRadius][col+i])
                innerSums[row][col] = innerSums[row-1][col]+innerChange
                # innerSums[row][col] = innerSums[row-1]-(rowLeftSums[row-1][]-rowLeftSums[row-1][radDiff])
            else:
                innerChange = 0
                for i in range(innerRadius):
                    innerChange -= int(img[row+i][col-1])
                    innerChange += int(img[row+i][col+innerRadius])
                innerSums[row][col] = innerSums[row][col-1]+innerChange

    # get averages of each region
    outerAvgs = np.ones(shape=(len(img), len(img[0])))*-1
    innerAvgs = np.ones(shape=(len(img), len(img[0])))*-1
    for x in range(len(outerSums)-outerRadius):
        for y in range(len(outerSums[0])-outerRadius):
            outerAvgs[x, y] = (outerSums[x][y]-innerSums[x+radDiff][y+radDiff])/(outerRadius*outerRadius-innerRadius*innerRadius)
            innerAvgs[x+radDiff][y+radDiff] = innerSums[x+radDiff][y+radDiff]/(innerRadius*innerRadius)

    for x in range(len(outerAvgs)-outerRadius):
        for y in range(len(outerAvgs[0])-outerRadius):
            if outerAvgs[x][y] - innerAvgs[x+radDiff][y+radDiff] > threshold:
                darkCenters.append([x+int(outerRadius/2),y+int(outerRadius/2)]) 

    return darkCenters

if __name__ == "__main__":
    app.run(debug=True, port=8080)