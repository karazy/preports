'use strict';

PReports.ReportCtrl =  function ($scope, $location, Report) {

  	$scope.reports = [];

  	$scope.search = {
  		year: 2014
  	};

    $scope.search.calweek = getWeek(new Date());
  	
  	$scope.calWeeks = [
  	];

    //Report Structure

    /*
      {
        name: 'IPM',
        leadDevelopers: 'Fre dund Guido',
        projectManagers: 'Meike Rieken',
        start: '2013-01-01'
        golive: '2014-10-31'
        milestones: [
          {
            name: 'Manual Matching',
            start: '2013-11-27',
            end: '2014-03-24'
          }
        ],
        lastWeekTasks: 'String',
        nextWeekTasks: 'String',
        identifiedPotentials: 'String',
        risksAndImpediments: 'String',
        codeReviews: [
          {
            authors: 'Fred',
            underReview: 'Data Migration',
            results: 'String'
          }
        ]
      }
    */

  	//fill calendar weeks
  	for (var i = 1; i < 53; i++) {
  		$scope.calWeeks.push({
  			'week' : i
  		});
  	};


  	$scope.loadReports = function() {
  		console.log('loadReports');
  		$scope.reports = Report.query({
  			'year': $scope.search.year,
  			'calweek' : $scope.search.calweek
  		});
  	}

  	$scope.createNewReport = function() {
  		var newReport = {},
          date = new Date();

      newReport.year = date.getFullYear();
      newReport.week = getWeek(date);
      newReport.name = $scope.newReportName;

      saveReport(newReport);
  	}

    function saveReport(report) {
      var resource;

      if(!report) {
        console.log('saveReport: no report given');
        return;
      }

      resource = new Report(report);

      if(report._id) {
        //update
      } else {
        //new
        resource.$save(function(saved) {
          console.log('saved new report');
          $scope.loadReports();
          $scope.newReportName = null;
        }, function(response) {
          alert('could not save report')
        });
        
      }
    }

    function getWeek(date) {
        var onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

  	//initially load reports
  	$scope.loadReports();


  }

PReports.ReportCtrl.$inject = ['$scope', '$location', 'Report'];