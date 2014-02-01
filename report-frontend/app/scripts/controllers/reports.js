'use strict';

PReports.ReportCtrl =  function ($scope, $location, $routeParams, Report, $log) {

  	$scope.reports = [];

    $scope.currentReport = null;

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
        leadDevelopers: 'Fred und Guido',
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

    $scope.loadReport =  function(id) {
      if(!id) {
        $log.log('loadReport: No Id provided.');
        return;
      }

      $scope.currentReport = Report.get({'id':id});

    }

  	$scope.createNewReport = function() {
  		var newReport = {},
          date = new Date();

      newReport.year = date.getFullYear();
      newReport.week = getWeek(date);
      newReport.name = $scope.newReportName;

      newReport.milestones = [];

      saveReport(newReport);
  	}

  	$scope.updateReport = function() {
  		if(!$scope.currentReport) {
  			console.log('updateReport: no current report');
  			return;
  		}
  		//always convert to int before saving
  		$scope.currentReport.year = parseInt($scope.currentReport.year);
  		$scope.currentReport.week = parseInt($scope.currentReport.week);

  		$scope.currentReport.$update();
  	}

  	$scope.deleteReport = function() {
  		if(!$scope.currentReport) {
  			console.log('deleteReport: no current report');
  			return;
  		}

  		$scope.currentReport.$delete();
  		$location.path('/');
  	}

    function saveReport(report) {
      var resource;

      if(!report) {
        console.log('saveReport: no report given');
        return;
      }

      resource = new Report(report);

      if(report._id) {
        //error
      } else {
        //new
        resource.$create(function(saved) {
          console.log('saved new report');
          //$scope.loadReports();
          $scope.newReportName = null;
          $location.path('reports/' + resource._id)
          
        }, function(response) {
          alert('could not save report')
        });
        
      }
    }

    function getWeek(date) {
        var onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    $scope.addMilestone = function() {
    	if(!$scope.currentReport) {
  			console.log('addMilestone: no current report');
  			return;
  		}

  		if(!$scope.currentReport.milestones) {
  			$scope.currentReport.milestones = [];
  		}

  		$scope.currentReport.milestones.push({
  			name: 'New milestone'
  		});

    }

  	
    //initially load reports or report entity
    if($routeParams.reportId) {
      $scope.loadReport($routeParams.reportId);
    } else {
      $scope.loadReports();  
    }
  
  }

PReports.ReportCtrl.$inject = ['$scope', '$location', '$routeParams', 'Report', '$log'];