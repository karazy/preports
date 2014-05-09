preports-service
========

project reports - create and manage weekly it project reports

This repository contains the REST service. The frontend can be found here [preports-app](https://github.com/BisnodeInformatics/preports-app).


PReports project is based on MEAN stack: MongoDB, ExpressJS, AngularJS, NodeJS

###Release Notes

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



The OpenShift `nodejs` cartridge documentation can be found at:

https://github.com/openshift/origin-server/tree/master/cartridges/openshift-origin-cartridge-nodejs/README.md