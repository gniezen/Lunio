from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "<script src='https://embed.github.com/view/3d/skalnik/secret-bear-clip/master/stl/clip.stl'></script>"
    #return "Hello World!"
    
if __name__ == "__main__":
    app.run(debug=True)