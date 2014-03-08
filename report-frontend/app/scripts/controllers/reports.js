'use strict';

PReports.ReportCtrl =  function ($scope, $location, $routeParams, Report, $log, $http, $fileUploader, config, errorHandler, $rootScope, language) {

  	$scope.reports = [];

    $scope.currentReport = null;

  	$rootScope.search = $rootScope.search || {};

    $rootScope.search.year = ($rootScope.search.hasOwnProperty('year')) ? $rootScope.search.year : (new Date()).getFullYear();
    $rootScope.search.calweek = ($rootScope.search.hasOwnProperty('calweek')) ? $rootScope.search.calweek : getWeek(new Date());
    $rootScope.search.name = ($rootScope.search.hasOwnProperty('name')) ? $rootScope.search.name : '';
  	
  	$scope.calWeeks = [
  	];

  	$scope.config = config;

  	$scope.projectNames = [];

  	//show 404 message
     $scope.reportNotFound = false;

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
  			'year': $rootScope.search.year,
  			'calweek' : $rootScope.search.calweek
  		}, function() {
  			$('.copy-button').tooltip();
  		}, errorHandler);
  	}

    $scope.loadReport =  function(id) {
      if(!id) {
        $log.log('loadReport: No Id provided.');
        return;
      }
      //show 404 message
      $scope.reportNotFound = false;

      $scope.currentReport = Report.get({'id':id}, function() {      	
      	setupFileUpload();
      }, function(httpResponse) {
      	$scope.reportNotFound = true;
      	errorHandler(httpResponse);
      });

    }

    $scope.showReport = function(id, event) {
      if(!id || !event) {
        return;
      }

      if(event.target.tagName != "TD") {
        //user clicked action button or link, so do nothing!
        return;
      }

      $location.path('reports/' + id);
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

  	$scope.deleteReport = function(report) {
      var reportToDelete = report || $scope.currentReport;

  		if(!reportToDelete) {
  			console.log('deleteReport: no report to delete');
  			return;
  		}

  		reportToDelete.$delete(angular.noop, errorHandler);
      
  		if($location.path() == '/reports') {
          angular.forEach($scope.reports, function(r, index) {
            if(reportToDelete._id == r._id) {
              $scope.reports.splice(index, 1);
              //exit loop
              return false;
            }
          });
        } else {
          $location.path('/');
        }
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

  		if(!index && index !== 0) {
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

  		if(!index && index !== 0) {
  			console.log('removeCodeReview: no index given');
  			return;
  		}

  		if(!$scope.currentReport.codeReviews || $scope.currentReport.codeReviews.length == 0 || !$scope.currentReport.codeReviews[index]) {
  			return;
  		}

  		$scope.currentReport.codeReviews.splice(index, 1);
  		$scope.updateReport();

    }

    $scope.deleteReportImage = function(image) {
    	if(!image) {
    		console.log('deleteReportImage: no image given');
    		return;
    	}

    	if(!$scope.currentReport) {
  			console.log('deleteReportImage: no current report');
  			return;
  		}

    	$http.delete(config.getCombinedServiceUrl() + '/reports/' + $scope.currentReport._id + '/images/' + image._id).
      	success(function(data, status, headers, config) {
    			angular.forEach($scope.currentReport.images, function(object, index) {
    				if(object._id  == image._id) {
    					$scope.currentReport.images.splice(index, 1);
    					return false;
    				}
    			});
  		  }).error(errorHandler);
    }

    function setupFileUpload() {
     var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: config.getCombinedServiceUrl() + '/reports/' + $scope.currentReport._id + '/images',
            alias: 'image',
            removeAfterUpload: true,
            autoUpload: false,
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
        });

        uploader.bind('error', function( event, xhr, item, response) {
        	console.log('setupFileUpload: upload failed');
        	//show global error. for more information have a look inside the errorHandler
        	$rootScope.error = true;
        	$rootScope.errorMessage = language.translate('error.image.upload') || 
        		language.translate('error.general') || 
        		"Error during communication with service.";
        });
 	}

 	$scope.copyReport = function(reportToCopy) {
 		if(!reportToCopy) {
    		console.log('copyReport: no reportToCopy given');
    		return;
    	}

    	//link to original report
    	reportToCopy.copyOf = reportToCopy._id;
    	delete reportToCopy._id;

    	reportToCopy.name = reportToCopy.name +'_copy';

    	saveReport(reportToCopy);
 	}

 	function loadProjectNames() {
 		$http.get($scope.config.getCombinedServiceUrl() + '/reports/names').success(function(data, status, headers, config) {
 			$scope.projectNames = data;
 		}).error(errorHandler);
 	}

  	
    //initially load reports or report entity
    if($routeParams.reportId) {
      $scope.loadReport($routeParams.reportId);
    } else {
      $scope.loadReports();
      loadProjectNames();
      $scope.$watch('reports', function() {
      	$('.copy-button').tooltip();	
      })
      
    }
  
  }

PReports.ReportCtrl.$inject = ['$scope', '$location', '$routeParams', 'Report', '$log', '$http', '$fileUploader', 'config', 'errorHandler', '$rootScope', 'language'];