'use strict';
var id = require('pow-mongodb-fixtures').createObjectId;

exports.reports = [
    {
      "_id": id("564cf41ef110b5ef6846f8db"),
      "year": (new Date()).getFullYear(),
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
      "leadDevelopers": "Fred",
      "hoursExternal": 10,
      "hoursInternal": 20,
      "hoursNearshoring":30,
      "currentCosts": 4,
      "costsPlanned": 10
    },
    {
      "_id": id("564cf435f110b5ef6846f8dc"),
      "year": (new Date()).getFullYear(),
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
    },
    {
      "_id": id("564da94cfa2a698677b0cc61"),
      "year": (new Date()).getFullYear(),
      "week": 47,
      "name": "Report with missing file !§$%&/())",
      "milestones": [],
      "lastModified": 1447930197110,
      "version": 3,
      "images": [
        {
          "filename": "30598-13qh5fr.png",
          "name": "Upload_1.png",
          "_id": "564da955fa2a698677b0cc62",
          "_links": {
            "self": {
              "href": "/reports/564da94cfa2a698677b0cc61/images/564da955fa2a698677b0cc62"
            },
            "collection": {
              "href": "/reports/564da94cfa2a698677b0cc61/images"
            }
          }
        },
        {
          "filename": "30598-1yjcv7s.png",
          "name": "Upload_2.png",
          "_id": "564da955fa2a698677b0cc63",
          "_links": {
            "self": {
              "href": "/reports/564da94cfa2a698677b0cc61/images/564da955fa2a698677b0cc63"
            },
            "collection": {
              "href": "/reports/564da94cfa2a698677b0cc61/images"
            }
          }
        }
    ]
  }
]