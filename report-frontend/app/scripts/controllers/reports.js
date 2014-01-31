'use strict';

PReports.ReportCtrl =  function ($scope, Report) {

  	$scope.reports = [];

  	$scope.search = {
  		year: 2014
  	};
  	
  	$scope.calWeeks = [
  	];

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
  		alert("NEW");
  	}

  	//initially load reports
  	$scope.loadReports();


  }

PReports.ReportCtrl.$inject = ['$scope', 'Report'];