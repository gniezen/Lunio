Lunio
=====

Collaboration platform for designing open source medical devices


Getting up and running
----------------------

Install the Flask framework, GitHub plugin, simplejson and sqlalchemy:

    sudo pip install flask github-flask simplejson sqlalchemy

Register a new application on GitHub (under *Account Settings-> Applications*) and create a file called `secret_keys.py` in the `web/` subdirectory with:

    GITHUB_CLIENT_ID = 'your client id'
    GITHUB_CLIENT_SECRET = 'your client secret'
  
Run the following command in the `web/` subdirectory:

    python main.py

Go to [http://localhost:5000/](http://localhost:5000/) in your web browser and log in.

Once logged in, go to [http://localhost:5000/lunio/index.html](http://localhost:5000/lunio/index.html) to view the application.
