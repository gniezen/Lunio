from flask import Flask, request, g, session, redirect, url_for, jsonify, Response
from flask import render_template_string
from flask.ext.github import GitHub
from secret_keys import *
import simplejson as json
from crossdomain import *

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URI = 'sqlite:////tmp/github-flask.db'
SECRET_KEY = 'development key'
DEBUG = True
GITHUB_CALLBACK_URL = 'http://10.13.239.70:5000/github-callback'

# setup flask
app = Flask(__name__,static_folder='../client',static_url_path='/lunio')
app.config.from_object(__name__)
github = GitHub(app)

# setup sqlalchemy
engine = create_engine(app.config['DATABASE_URI'])
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    Base.metadata.create_all(bind=engine)


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(200))
    github_access_token = Column(Integer)

    def __init__(self, github_access_token):
        self.github_access_token = github_access_token


@app.before_request
def before_request():
    g.user = None
    if 'user_id' in session:
        g.user = User.query.get(session['user_id'])


@app.after_request
def after_request(response):
    db_session.remove()
    return response


@app.route('/')
def index():
    if g.user:
        t = 'Hello! <a href="{{ url_for("user") }}">Get user</a> ' \
            '<a href="{{ url_for("logout") }}">Logout</a>'
    else:
        t = 'Hello! <a href="{{ url_for("login") }}">Login</a>'

    #return "<script src='https://embed.github.com/view/3d/skalnik/secret-bear-clip/master/stl/clip.stl'></script>"

    return render_template_string(t)

@app.route('/render')
def render():
    return "<script src='https://embed.github.com/view/3d/gniezen/openpump/master/extruder_print_all_v3.stl'></script>"
    

@github.access_token_getter
def token_getter():
    user = g.user
    if user is not None:
        return user.github_access_token


@app.route('/github-callback')
@github.authorized_handler
def authorized(access_token):
    next_url = request.args.get('next') or url_for('index')
    if access_token is None:
        return redirect(next_url)

    user = User.query.filter_by(github_access_token=access_token).first()
    if user is None:
        user = User(access_token)
        db_session.add(user)
    user.github_access_token = access_token
    db_session.commit()

    session['user_id'] = user.id
    return redirect(url_for('index'))


@app.route('/login')
def login():
    if session.get('user_id', None) is None:
        return github.authorize(scope='public_repo')
    else:
        return 'Already logged in'


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('index'))


@app.route('/user')
@crossdomain(origin='*')
def user():
    return asJson(github.get('user'))
    
@app.route('/projects')
@crossdomain(origin='*')
def projects():
    return asJson(github.get('user/repos'))
    
@app.route('/comments', methods=['GET', 'POST'])
@crossdomain(origin='*')
def getComments():
    user =  request.args.get('user','gniezen')
    project =  request.args.get('project','openpump')
    
    if request.method == 'POST':
        #comment =  request.args.get('comment')
        #sha = request.args.get('sha')
        comment = request.form['comment']
        sha = request.form['sha']       
        payload = {'body': comment}
        return asJson(github.post('repos/'+user+'/'+project+'/commits/'+sha+'/comments', payload))
        
    if request.method == 'GET':
        sha = request.args.get('sha','')
        
        if sha=='':
            return asJson(github.get('repos/'+user+'/'+project+'/comments'))
        else:
            return asJson(github.get('repos/'+user+'/'+project+'/commits/'+sha+'/comments'))

 
@app.route('/files')
@crossdomain(origin='*')
def getFilesForProject():
    user =  request.args.get('user','gniezen')
    project =  request.args.get('project','openpump')
    s = ""
    #for entry in github.get('repos/gniezen/openpump/contents/'):
    #    s += entry['name'] + "\n"
    #return s
    
    r = github.get('repos/'+str(user)+'/'+str(project)+'/contents/')

    for i in r:
        if 'README.md' in i.values():
            r.remove(i)
    
        for val in i.values():
            if str(val).endswith('.ino'):
                path = i['path']
                req = github.raw_request('GET','repos/'+user+'/'+project+'/contents/'+path, headers={'Accept':'application/vnd.github.v3.raw'})            
                i['text'] = req.text
    
    return asJson(r)
    
@app.route('/revisions')
@crossdomain(origin='*')
def getRevisions():
    user =  request.args.get('user','gniezen')
    project =  request.args.get('project','openpump')
    path = request.args.get('path')

    return asJson(github.get('repos/gniezen/openpump/commits?path='+path))
    


def asJson(dump):
    resp = Response(response=json.dumps(dump),
                        status=200,
                        mimetype="application/json")
    return resp
    
if __name__ == '__main__':
    init_db()
    app.run(debug=True, host= '0.0.0.0')
