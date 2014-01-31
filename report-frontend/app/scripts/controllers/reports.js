'use strict';

PReports.ReportCtrl =  function ($scope, Report) {

  	$scope.reports = [];

  	$scope.search = {
  		year: 2014
  	};

  	$scope.loadReports = function() {
  		console.log('loadReports');
  		$scope.reports = Report.query({
  			'year': $scope.search.year
  		});
  	}

  	$scope.createNewReport = function() {
  		alert("NEW");
  	}

  	//initially load reports
  	$scope.loadReports();


  }

PReports.ReportCtrl.$inject = ['$scope', 'Report'];