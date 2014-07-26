from os import getcwd as cwd
from glob import glob
from flask import Flask, render_template, request, jsonify
from stylus import Stylus
from pymongo import MongoClient



# configure

def compile():
    compiler = Stylus()

    for fname in glob(cwd() + '/static/css/*.styl'):
        print('compiling ' + fname)
        styl = open(fname, 'r')
        css = open(fname.replace('.styl', '.css'), 'w')
        css.write(compiler.compile(styl.read()))
        styl.close()
        css.close()

compile()
app = Flask(__name__)
db = MongoClient().ph



# index

@app.route('/')
def index():
    if app.debug:
        compile()
    return render_template('index.html')



# page

@app.route('/page', methods=['POST'])
def page():
    num = dict(request.form)['num'][0]
    return jsonify(json=db.pages.find_one({'num': int(num)})['days'])



# discussion

@app.route('/disc', methods=['POST'])
def disc():
    perma = dict(request.form)['perma'][0]
    return jsonify(json=scrape_ph.discussion(perma)['comments'])



# run

if __name__ == '__main__':
    app.run(debug=True)
