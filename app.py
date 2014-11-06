#!/usr/bin/env python3

from os import path as path
from glob import glob
from flask import Flask, render_template, request, jsonify
from stylus import Stylus
from pymongo import MongoClient
from threading import Thread
import json
import requests
from time import sleep
from datetime import datetime, timedelta
app = Flask(__name__)

def cache_ph():
    base = 'https://api.producthunt.com/v1'

    with open(fl + '/config.json') as config:
        config = json.load(config)['ph']

    auth = requests.post(base + '/oauth/token', data={
        'client_id': config['client_id'],
        'client_secret': config['client_secret'],
        'grant_type': config['grant_type']
    })

    head = {'Authorization': 'Bearer ' + auth.json()['access_token']}
    
    for i in range(5):
        print('downloading day ' + str(i))
        day = requests.get(base + '/posts?days_ago=' + str(i), headers=head)
        day = day.json()
        day['ago'] = i
        db.days.update({'ago': i}, day, True)

        for j, post in enumerate(day['posts']):
            url = base + '/posts/' + str(post['id'])
            details = requests.get(url, headers=head).json()['post']
            disc = {
                'perma': details['discussion_url'],
                'comments': details['comments'],
                'created_at': datetime.utcnow()
            }
            db.discs.update({'perma': disc['perma']}, disc, True)

def cache_loop():
    old = {'created_at': {'$lt': datetime.now() - timedelta(days=6)}}
    db.discs.remove(old)

    try:
        cache_ph()
        sleep(300)
    except Exception as e:
        print('Exception while downloading PH:')
        print(e)
        sleep(900)

    cache_loop()

@app.route('/')
def index():
    if app.debug:
        compile()
    return render_template('index.html')

@app.route('/day', methods=['POST'])
def day():
    ago = int(dict(request.form)['ago'][0])
    return jsonify(json=db.days.find_one({'ago': ago})['posts'])

@app.route('/disc', methods=['POST'])
def disc():
    perma = dict(request.form)['perma'][0]
    return jsonify(json=db.discs.find_one({'perma': perma})['comments'])

def compile():
    compiler = Stylus()

    for fname in glob(fl + '/static/css/*.styl'):
        print('compiling ' + fname)
        styl = open(fname, 'r')
        css = open(fname.replace('.styl', '.css'), 'w')
        css.write(compiler.compile(styl.read()))
        styl.close()
        css.close()

if __name__ == '__main__':
    fl = path.dirname(__file__) # file location
    if fl == '': fl = '.'
    compile()
    db = MongoClient().ph
    Thread(target=cache_loop).start() # comment out when developing!
    app.debug = False # turn on when developing for auto-compiling & debugging
    app.run(port=80, host='0.0.0.0')
