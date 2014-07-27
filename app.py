from os import getcwd as cwd
from glob import glob
from flask import Flask, render_template, request, jsonify
from stylus import Stylus
from pymongo import MongoClient
app = Flask(__name__)

@app.route('/')
def index():
    if app.debug:
        compile()
    return render_template('index.html')

@app.route('/page', methods=['POST'])
def page():
    num = dict(request.form)['num'][0]
    return jsonify(json=db.pages.find_one({'num': int(num)})['days'])

@app.route('/disc', methods=['POST'])
def disc():
    perma = dict(request.form)['perma'][0]
    return jsonify(json=db.discs.find_one({'perma': perma})['comments'])

def compile():
    compiler = Stylus()

    for fname in glob(cwd() + '/static/css/*.styl'):
        print('compiling ' + fname)
        styl = open(fname, 'r')
        css = open(fname.replace('.styl', '.css'), 'w')
        css.write(compiler.compile(styl.read()))
        styl.close()
        css.close()

if __name__ == '__main__':
    compile()
    db = MongoClient().ph
    app.debug = False # turn on when developing for auto-compiling & debugging
    app.run(port=4001)
