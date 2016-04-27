PReports
========

project reports - create and manage weekly IT project reports

[Official homepage](http://p-reports.com)

[![Build Status](https://travis-ci.org/karazy/preports.svg?branch=development)](https://travis-ci.org/karazy/preports)

[Try it!](https://preports.herokuapp.com) (development branch)


PReports project is based on MEAN stack: MongoDB, ExpressJS, AngularJS, NodeJS

##About

PReports (short for project reports) lets you write project reports (tailored for IT) in your browser on the fly. More information on the [official homepage](http://p-reports.com).

##Setup

###Dev
####Prerequisites
Install
- [NodeJS > 4.2.3](https://nodejs.org/en/)
- `npm install -g bower grunt-cli`
- [Compass](http://compass-style.org/install/) for SASS, needs Ruby
- [MongoDB](https://www.mongodb.org/)

Optional
- `npm install -g supervisor`

####Run it
1. Check out development (or master for last stable) branch.
2. Make sure a mongo daemon is running on your local machine (or a remote machine)
3. CD into project root folder
4. Set up environment variables (see below)
5. RUN `npm install`
6. RUN `supervisor app.js` (or node if you didn't install supervisor). This will fire up the backend
and you should see something like this.

    ```
    Starting child process with 'node app.js'
    Watching directory '/Users/fred/Dev/preports/service' for changes.
    connect.multipart() will be removed in connect 3.0
    visit https://github.com/senchalabs/connect/wiki/Connect-3.0 for alternatives
    connect.limit() will be removed in connect 3.0
    Initialize passport
    Authentication disabled
    Using MONGODB_DB_CONNECTION
    Connecting to mongo db: mongodb://localhost:27017/preports
    directory for upload: undefined
    Wed Jan 13 2016 20:36:00 GMT+0100 (CET): Node server started on undefined:3000 ...
    Connected to 'project report' database
    createIndexes: created index searchIndex_1
    ```
7. CD into client folder
8. RUN `npm install && bower install` (this will install the frontend dependencies)
9. RUN `grunt serve` (This will fire up a webserver on port 9000 an show the UI.)

    ```
    ...
    Running "connect:livereload" (connect) task
    Started connect web server on 0.0.0.0:9000.
    
    Running "watch" task
    Waiting...
    
    ```
10. Go and code... All changes should be picked up immediately.
11. visit http://localhost:9000
12. To run tests RUN `npm test` in root folder. Currently only backend tests exists. Make sure mongo is running. ATTENTION Will wipe your database!!!

####Build it
To have a production build CD into client folder and execute `grunt build --force`.
This creates a new minified UI build in /dist folder that gets served by the backend.
You can access the dist build via http://localhost:3000
Commit and push the "build" to your repository. Thats it.


###Production

####Standalone
Install
- NodeJS > 4.2.3
- `npm install -g forever` (To run your script continously)
- [MongoDB](https://www.mongodb.org/) preferably on another server

####Docker
Install
- Docker obviously and docker-compose
- Tune env variables in docker-compose.yml to suite your needs

####Run it...
1. Checkout the source with the latest UI dist build on your prod host
2. CD into src root
3. Adjust config and env variables
4. RUN `npm install`
5. RUN `forever app.js`
  1. or RUN `docker-compose up -d` when using docker

This may not be the best approach. One might want to check out
[Strongloop](https://strongloop.com) as a tool for node app building and deployment.
Check out their [post](/strongblog/node-js-deploy-production-best-practice/) regarding best practices.


###Environment variables
List of env variables needed to configure PReports.

| Variable      | Values      | Default | Required |
| ------------- | :-------------: | :-------------: | -------------: |
| NODE_ENV     | e.g. development, production | development | no |
| CONFIG_PATH    | /path/to/external/config      | none | no |
| UPLOAD_DIR | /path/to/file/upload    | USER_HOME/.preports | no |

###Configuration
Config files reside under ./config/environment. Depending on the value of NODE_ENV
the corresponding config is loaded.

###Directories

/auth - Authorization logic

/backup - Scripts for backups (experimental)

/client - UI src code

/components - Misc stuff

/config - configurations

/database - DB helper

/dist - Minified UI build

/preports-icon - icons

/routes - Backend core logic. 

/specs - Backend tests

/views - Views rendered by express.js (not used currently)


##Release Notes
[> Release Notes](RELEASE_NOTES.md)

###License

MIT License (MIT)

Copyright (c) 2016 Frederik Reifschneider

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
