preports
========

project reports - create and manage weekly IT project reports

[Official homepage](http://p-reports.com)

[![Build Status](https://travis-ci.org/karazy/preports.svg?branch=development)](https://travis-ci.org/karazy/preports)

[Try it!](https://preports.herokuapp.com) (development branch)


PReports project is based on MEAN stack: MongoDB, ExpressJS, AngularJS, NodeJS

##About

PReports (abbr for project reports) lets you write project reports (tailored for IT) in you browser on the fly. More information on the [Official homepage](http://p-reports.com).

##Installation
*WORK IN PROGRESS*

###Development Setup
####Prerequisites
For development please install
- NodeJS 4.2.3
- npm install -g bower, grunt-cli
- [Compass](http://compass-style.org/install/) for SASS, needs Ruby
- [MongoDB](https://www.mongodb.org/)

Optional
- npm install -g supervisor

####Run it
1. Check out development (or master for last stable) branch.
2. Make sure a mongo daemon is running on your local machine (or a remote machine, that you can reach)
3. CD into root folder
4. Set up environment variables (see below)
4. RUN npm install
5. RUN 'supervisor app.js' (or node if you didn't install supervisor). This will fire up the backend
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
6. CD into client folder
7. RUN npm install && bower install (this will install the frontend dependencies)
8. RUN grunt serve (This will fire up a webserver on port 9000 an show the UI.)

```
...
Running "connect:livereload" (connect) task
Started connect web server on 0.0.0.0:9000.

Running "watch" task
Waiting...

```
10. Go and code... All changes should be picked up immediately.
11. To run tests RUN npm test in root folder. Currently only backend tests exists.

####Build it
*Under construction*

###Production standalone
*Under construction*
####Prerequisites
- NodeJS 4.2.3
- npm install -g forever (To run your script continously)
- [MongoDB](https://www.mongodb.org/) preferably on another server

###Production via Docker (experimental)
####Prerequisites
- Docker obviously and docker-compose
- Tune env variables in docker-compose.yml to suite your needs
- RUN docker-compose -d up

###Environment variables
List of env variables needed to configure PReports.

| Variable      | Values      | Default | Required |
| ------------- | :-------------: | :-------------: | -------------: |
| NODE_ENV     | e.g. development, production | development | no |
| CONFIG_PATH    | /path/to/external/config      | none | no |
| UPLOAD_DIR | /path/to/file/upload    | USER_HOME/.preports | no |

###Configuration
*Under construction*

##Release Notes

####v1.5.0 Ignorant Ibis
- Added richtext editor
- Bugfixes

####v1.4.1 Herculean Hedgehog
- Minor changes
- Bugfixes & Cleanups

####v1.4.0 Herculean Hedgehog
- Milestones are dragable for easy rearrangement.
- See project status in overview.
- Migrated to Bootstrap 3.3.5.
- Minor fixes and tweaks.

####v1.3.1 Grumpy Giraffe
- Fixed issue in simple property editor not displaying the saved value when type datepicker is used.

####v1.3.0 Grumpy Giraffe
- Added Datepicker for easy date selection.
- Added CAS support
- Several Bugfixes

####v1.2.0
- Readded UI into this project since it is easier to use.
- Added Dockerfiles for deployment.

####v1.1.1
- Fixed display issues in firefox for html representation.

####v1.1.0
- Service supports type text/html as return type.

####v1.0
- Removed frontend from service and created separate project.

####v0.4 Dude Diederich
- Added pagination (for more than 50 records)
- Added lock button to disable editing of a report
- Added version checks to prevent lost updates
- REST Api is now cleaner and features links for navigation
- Usability and other improvements
- Bugfixes and cleanups
- Started naming of versions ;)

####v0.3
- Added undo functionality for report editing (works not on selects and image upload!)
- Added created on and last modified information
- Added delete countdown
- Added copy button in report detail
- Bugfixes

####v0.2.1
- fixed bug in search
- removed some required fields
- visual tweaks

####v0.2.0
- Language switch (German, English)
- Print CSS for reports
- Persist search filters when switching back and forth between reports and report list
- Bugfixes and style optimizations
- Display version in about

####v0.0.1
- Initial version

###License

MIT License (MIT)

Copyright (c) 2014 Frederik Reifschneider

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
