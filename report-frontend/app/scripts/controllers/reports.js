'use strict';

PReports.ReportCtrl =  function ($scope, $location, $routeParams, Report, $log, $http, $fileUploader, config, errorHandler) {

  	$scope.reports = [];

    $scope.currentReport = null;

  	$scope.search = {
  		year: 2014
  	};

    $scope.search.calweek = getWeek(new Date());
  	
  	$scope.calWeeks = [
  	];

  	$scope.config = config;

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

      $scope.currentReport = Report.get({'id':id}, function() {
      	setupFileUpload();
      });

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

  		$scope.updateReport();
    }

    $scope.removeMilestone = function(index) {
    	if(!$scope.currentReport) {
  			console.log('addMilestone: no current report');
  			return;
  		}

  		if(!index) {
  			console.log('addMilestone: no index given');
  			return;
  		}

  		if(!$scope.currentReport.milestones || $scope.currentReport.milestones.length == 0 || !$scope.currentReport.milestones[index]) {
  			return;
  		}

  		$scope.currentReport.milestones.splice(index, 1);
  		$scope.updateReport();

    }


    $scope.addCodeReview = function() {
    	if(!$scope.currentReport) {
  			console.log('addCodeReview: no current report');
  			return;
  		}

  		if(!$scope.currentReport.codeReviews) {
  			$scope.currentReport.codeReviews = [];
  		}

  		$scope.currentReport.codeReviews.push({
  			authors: 'Add authors',
  		});

  		$scope.updateReport();
    }

    $scope.removeCodeReview = function(index) {
    	if(!$scope.currentReport) {
  			console.log('removeCodeReview: no current report');
  			return;
  		}

  		if(!index) {
  			console.log('removeCodeReview: no index given');
  			return;
  		}

  		if(!$scope.currentReport.codeReviews || $scope.currentReport.codeReviews.length == 0 || !$scope.currentReport.codeReviews[index]) {
  			return;
  		}

  		$scope.currentReport.codeReviews.splice(index, 1);
  		$scope.updateReport();

    }

    // $scope.uploadReportImage = function() {
    // 	console.log('uploadReportImage');

    // 	// $http.post('http://127.0.0.1:3000/reports/' + $scope.currentReport._id + '/images', $scope.reportImageUpload);
    // }

    $scope.deleteReportImage = function(image) {
    	if(!image) {
    		console.log('deleteReportImage: no image given');
    		return;
    	}

    	if(!$scope.currentReport) {
  			console.log('deleteReportImage: no current report');
  			return;
  		}

    	$http.delete(config.serviceUrl + '/reports/' + $scope.currentReport._id + '/images/' + image._id,
    		angular.noop,
    		errorHandler);
    }

    function setupFileUpload() {
     var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: 'http://127.0.0.1:3000/reports/' + $scope.currentReport._id + '/images',
            alias: 'image',
            removeAfterUpload: true,
            filters: [
                function (item) {
                    var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
		            type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
		            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            ]
        });

     	uploader.bind('completeall', function (event, items) {
      		//reload report
            $scope.loadReport($scope.currentReport._id);
            console.info('Complete all', items);
        });
 	}

  	
    //initially load reports or report entity
    if($routeParams.reportId) {
      $scope.loadReport($routeParams.reportId);
    } else {
      $scope.loadReports();  
    }
  
  }

PReports.ReportCtrl.$inject = ['$scope', '$location', '$routeParams', 'Report', '$log', '$http', '$fileUploader', 'config', 'errorHandler'];