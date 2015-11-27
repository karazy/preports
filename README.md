preports-service
========

project reports - create and manage weekly IT project reports

[![Build Status](https://travis-ci.org/karazy/preports.svg?branch=development)](https://travis-ci.org/karazy/preports)

[Try it!](https://preports.herokuapp.com) (development branch)


PReports project is based on MEAN stack: MongoDB, ExpressJS, AngularJS, NodeJS

###Release Notes

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