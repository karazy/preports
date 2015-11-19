'use strict';
var id = require('pow-mongodb-fixtures').createObjectId;

exports.reports = [
    {
      "_id": id("564cf41ef110b5ef6846f8db"),
      "year": 2015,
      "week": 47,
      "name": "Test Report",
      "milestones": [],
      "lastModified": 1447883813587,
      "version": 5,
      "createdOn": "2015-11-18T21:56:46.000Z",
      "_links": {
        "self": {
          "href": "/reports/564cf41ef110b5ef6846f8db"
        },
        "collection": {
          "href": "/reports"
        }
      },
      "budgetState": 3,
      "timeState": 2,
      "qualityState": 1,
      "leadDevelopers": "Fred"
    },
    {
      "_id": id("564cf435f110b5ef6846f8dc"),
      "year": 2015,
      "week": 47,
      "name": "Report with missing file",
      "milestones": [],
      "lastModified": 1447883843607,
      "version": 2,
      "images": [
        {
          "filename": "26863-10sg1g3.jpg",
          "name": "HEI12EW012000_0547.jpg",
          "_id": "564cf443f110b5ef6846f8dd",
          "_links": {
            "self": {
              "href": "/reports/564cf435f110b5ef6846f8dc/images/564cf443f110b5ef6846f8dd"
            },
            "collection": {
              "href": "/reports/564cf435f110b5ef6846f8dc/images"
            }
          }
        }
      ],
      "createdOn": "2015-11-18T21:57:09.000Z",
      "_links": {
        "self": {
          "href": "/reports/564cf435f110b5ef6846f8dc"
        },
        "collection": {
          "href": "/reports"
        }
      }
    }
]