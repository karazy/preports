'use strict';

PReports.ReportCtrl =  function ($scope, $location, $routeParams, Report, $log, $http, $fileUploader, config, errorHandler, $rootScope, language, $timeout, $interval) {

    var REPORT_DELETE_TIMEOUT = 5000,
        PAGINATION_LIMIT = 5;

    /**
    * Size of the command queue that holds undo events.
    */
    $scope.COMMAND_QUEUE_SIZE = 20;

  	$scope.reports = [];

    $scope.currentReport = null;

    //initialize global search parameters if they don't exist on $rootScope
  	$rootScope.search = $rootScope.search || {};
    $rootScope.search.year = ($rootScope.search.hasOwnProperty('year')) ? $rootScope.search.year : (new Date()).getFullYear();
    $rootScope.search.week = ($rootScope.search.hasOwnProperty('week')) ? $rootScope.search.week : getWeek(new Date());
    $rootScope.search.name = ($rootScope.search.hasOwnProperty('name')) ? $rootScope.search.name : '';
    $rootScope.search.limit = PAGINATION_LIMIT;
    $rootScope.search.page = ($rootScope.search.hasOwnProperty('page')) ? $rootScope.search.page : 0;

  	
  	$scope.weeks = [];

  	$scope.config = config;

  	$scope.projectNames = [];

  	//show 404 message
     $scope.reportNotFound = false;

     /**
     * List of executed commands during report editing
     */
     $scope.commands = [];


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
  		$scope.weeks.push({
  			'week' : i
  		});
  	};


  	$scope.loadReports = function(direction) {
      var page,
          limit;
  		console.log('loadReports');

      if($scope.reportsWrapper && $scope.reportsWrapper._links) {
        if(direction== 'next' && $scope.reportsWrapper._links.next) {
          $http.get(config.getCombinedServiceUrl() + $scope.reportsWrapper._links.next.href).success(function(wrapper) {
            $scope.reportsWrapper = wrapper;
            $scope.reports = wrapper.reports;
            //page is  based
            $rootScope.search.page = wrapper.currentPage - 1;
          }).error(errorHandler);
          return;
        } else if(direction == 'prev' && $scope.reportsWrapper._links.prev) {
          $scope.reportsWrapper = $http.get(config.getCombinedServiceUrl() + $scope.reportsWrapper._links.prev.href).success(function(wrapper) {
            $scope.reportsWrapper = wrapper;
            $scope.reports = wrapper.reports;
            //page is  based
            $rootScope.search.page = wrapper.currentPage - 1;
          }).error(errorHandler);
          return;
        }
      }
       
  		$scope.reportsWrapper = Report.query({
  			'year': $rootScope.search.year,
  			'week' : $rootScope.search.week,
        'name' : $rootScope.search.name,
        'page' : $rootScope.search.page,
        'limit' : 5
  		},
      function(value) {
        $scope.reports = $scope.reportsWrapper.reports;
        //page is  based
        $rootScope.search.page = $scope.reportsWrapper.currentPage - 1;
      }, errorHandler);
  	}

    /**
    * Registers change listeners for search form.
    *
    */
    function registerWatchForSearch() {
      var tempFilterText = '',
          filterTextTimeout,
          tmpHandle;

      if(!$rootScope.watchHandles) {
        $rootScope.watchHandles = [];
      }

      tmpHandle =$rootScope.$watch('search.name', function (newVal, oldVal) {
          if(newVal != oldVal) {
            if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

            tempFilterText = newVal;
            filterTextTimeout = $timeout(function() {
                $scope.filterText = tempFilterText;
                $rootScope.search.page = 0;
                $scope.loadReports();
            }, 250);
          }
      });

      $rootScope.watchHandles.push(tmpHandle);

      tmpHandle =$rootScope.$watch('search.year', function (newVal, oldVal) {
        if(newVal != oldVal) {
          $rootScope.search.page = 0;
          $scope.loadReports();
        }
      });

      $rootScope.watchHandles.push(tmpHandle);

      tmpHandle= $rootScope.$watch('search.week', function (newVal, oldVal) {
        if(newVal != oldVal) {
          $rootScope.search.page = 0;
          $scope.loadReports();          
        }
      });

      $rootScope.watchHandles.push(tmpHandle);
    }

    /**
    * Unregister change listeners for search form.
    *
    */
    function unregisterWatchForSearch() {
      if($rootScope.watchHandles && $rootScope.watchHandles.length > 0) {
        angular.forEach($rootScope.watchHandles, function(handle) {
          handle();
        });
      }

      $rootScope.watchHandles = [];
    }

    /**
    * Load a single report. Sets $scope.currentReport with result.
    * @param {String} id
    *   Id of report to load.
    */
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

    /**
    * Uses search parameters (if exist) and adds them 
    * as query parameters to current url.
    */
    $scope.setSearchAsQueryParams = function() {
      //set url to query params
      //set it to empty object
      $location.$$search = {};

      if($rootScope.search.week) {
        $location.search('week', $rootScope.search.week);
      }

      if($rootScope.search.year) {
        $location.search('year', $rootScope.search.year);  
      }

      if($rootScope.search.name) {
        $location.search('name', $rootScope.search.name);  
      }
    }

    /**
    * Uses query params from url and adds them to 
    * $rootScope.search object
    */
    function setQueryParamsAsSearch() {
      var queryParams = $location.search();
      if(queryParams) {
        if(queryParams.week) {
          $rootScope.search.week = parseInt(queryParams.week);
        }
        if(queryParams.year) {
          $rootScope.search.year = queryParams.year;
        }
        if(queryParams.name) {
          $rootScope.search.name = queryParams.name;
        }
      }
    }

    /**
    * Delete query params in URL.
    */
    function resetQueryParams() {
      $location.$$search = {};
      $location.url($location.path());
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

    /**
    * Update $scope.currentReport by persisting changes.
    * @param {String} modifiedProperty
    *   Property that has been modified.
    * @param {String} prevValue
    *   Previous value used for undo.
    * TODO document all param
    */
  	$scope.updateReport = function(modifiedProperty, prevValue, isArray, index, arrayName) {
      var updateCommand = {
        mP: modifiedProperty,
        pV: prevValue,
        iA: isArray,
        i: index,
        aN: arrayName
      };

  		if(!$scope.currentReport) {
  			console.log('updateReport: no current report');
  			return;
  		}
  		
      //always convert to int before saving
      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        $scope.currentReport.$update();  
      }

      //only add update command when a modified property exists
      if(updateCommand.mP) {
        updateCommand.undo = function() {
          if(isArray && typeof index == 'number' && arrayName) {
            $scope.currentReport[arrayName][index][updateCommand.mP] = updateCommand.pV;
            // modifiedEntity[updateCommand.mP] = updateCommand.pV;
          } else {
            $scope.currentReport[updateCommand.mP] = updateCommand.pV;  
          }
          $scope.currentReport.$update();
        }
      }      

      storeAndExecute(updateCommand);
  	}

  	$scope.deleteReport = function(report) {
      $scope.reportToDelete = report || $scope.currentReport;

  		if(!$scope.reportToDelete) {
  			console.log('deleteReport: no report to delete');
  			return;
  		}

      $scope.remainingSecondsBeforeDoomsday = Math.round(REPORT_DELETE_TIMEOUT/1000);
      $scope.deleteTimer = true;      

      $scope.doomsdayInterval = $interval(countDown, 1000, $scope.remainingSecondsBeforeDoomsday + 1);

      function killTheReport() {      
        $scope.reportToDelete.$delete(function() {
          $scope.reportToDelete = null;
          if($location.path() == '/reports') {
            angular.forEach($scope.reports, function(r, index) {
              if($scope.reportToDelete._id == r._id) {
                $scope.reports.splice(index, 1);
                //exit loop
                return false;
              }
            });
          } else {
            $location.path('/');
          }
        }, errorHandler);        
      }     

      function countDown() {
        if($scope.remainingSecondsBeforeDoomsday > 0) {
          $scope.remainingSecondsBeforeDoomsday = $scope.remainingSecondsBeforeDoomsday - 1;  
        } else {
          $scope.deleteTimer = false;
          killTheReport();
        }  
      }  		
  	}

     $scope.delayDoomsday = function() {
      $scope.deleteTimer = false;

      if($scope.doomsdayInterval) {        
        $interval.cancel($scope.doomsdayInterval);
        $scope.doomsdayInterval = null;  
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

    /**
    * Add a new milestone to currentReport.
    */
    $scope.addMilestone = function() {
      var updateCommand = {};

    	if(!$scope.currentReport) {
  			console.log('addMilestone: no current report');
  			return;
  		}

  		if(!$scope.currentReport.milestones) {
  			$scope.currentReport.milestones = [];
  		}

      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        $scope.currentReport.milestones.push({
          name: 'New milestone'
        });
        $scope.currentReport.$update();
      }

      updateCommand.undo = function() {
        $scope.currentReport.milestones.pop();
        $scope.currentReport.$update();
      }

      storeAndExecute(updateCommand);
    }

    /**
    * Remove milestone from currentReport.
    * @param {Integer} index
    *   Index of milestone to remove in currentReport.milestones.
    */
    $scope.removeMilestone = function(index) {
      var updateCommand = {},
          milestoneToRemove;

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
  		

      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        milestoneToRemove = $scope.currentReport.milestones[index];
        $scope.currentReport.milestones.splice(index, 1);
        $scope.currentReport.$update();
      }

      updateCommand.undo = function() {
        $scope.currentReport.milestones.splice(index, 0, milestoneToRemove);
        $scope.currentReport.$update();
      }

      storeAndExecute(updateCommand);

    }

    /**
    * Adds a new code review to currentReport.codeReviews.
    *
    */
    $scope.addCodeReview = function() {
      var updateCommand = {};

    	if(!$scope.currentReport) {
  			console.log('addCodeReview: no current report');
  			return;
  		}

  		if(!$scope.currentReport.codeReviews) {
  			$scope.currentReport.codeReviews = [];
  		}

      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        $scope.currentReport.codeReviews.push({
          authors: 'Add authors',
        });
        $scope.currentReport.$update();
      }

      updateCommand.undo = function() {
        $scope.currentReport.codeReviews.pop();
        $scope.currentReport.$update();
      }

      storeAndExecute(updateCommand);
    }

    /**
    * Removes a code review from currentReport.
    * @param {Integer} index
    *   Index of code review to remove.
    */
    $scope.removeCodeReview = function(index) {
      var updateCommand = {},
          codeReviewToRemove;

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

      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        codeReviewToRemove = $scope.currentReport.codeReviews[index];
        $scope.currentReport.codeReviews.splice(index, 1);
        $scope.currentReport.$update();
      }

      updateCommand.undo = function() {
        $scope.currentReport.codeReviews.splice(index, 0, codeReviewToRemove);
        $scope.currentReport.$update();
      }

      storeAndExecute(updateCommand);
    }

    /**
    * Adds a system (DEV, QA ...) currentReport.systems.
    *
    */
    $scope.addSystem = function() {
      var updateCommand = {};

      if(!$scope.currentReport) {
        console.log('addSystem: no current report');
        return;
      }

      if(!$scope.currentReport.systems) {
        $scope.currentReport.systems = [];
      }

      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        $scope.currentReport.systems.push({
        });

        $scope.currentReport.$update();
      }

      updateCommand.undo = function() {
        $scope.currentReport.systems.pop();
        $scope.currentReport.$update();
      }

      storeAndExecute(updateCommand);
    }

    /**
    * Removes a system from currentReport.
    * @param {Integer} index
    *   Index of system to remove.
    */
    $scope.removeSystem = function(index) {
      var updateCommand = {},
          systemToRemove;

      if(!$scope.currentReport) {
        console.log('removeSystem: no current report');
        return;
      }

      if(!index && index !== 0) {
        console.log('removeSystem: no index given');
        return;
      }

      if(!$scope.currentReport.systems || $scope.currentReport.systems.length == 0 || !$scope.currentReport.systems[index]) {
        return;
      }

      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        systemToRemove = $scope.currentReport.systems[index];
        $scope.currentReport.systems.splice(index, 1);
        $scope.currentReport.$update();
      }

      updateCommand.undo = function() {
        $scope.currentReport.systems.splice(index, 0, systemToRemove);
        $scope.currentReport.$update();
      }

      storeAndExecute(updateCommand);
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

    $scope.printReport = function() {
      
      if(!$scope.currentReport) {
        console.log('printReport: no current report');
        return;
      }

      window.print();
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

     uploader.bind('complete', function( event, xhr, item, response ) {
        $log.log(response);
        if(!$scope.currentReport.images) {
          $scope.currentReport.images = [];
        }

        $scope.currentReport.images.push(response);
     });

     	uploader.bind('completeall', function (event, items) {
      		//reload report
            // $scope.loadReport($scope.currentReport._id);
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

      if(reportToCopy.week < 52) {
        reportToCopy.week =  reportToCopy.week + 1;
      } else {
        reportToCopy.week = 1;
        reportToCopy.year++;
      }
      


    	saveReport(reportToCopy);
 	}

  /**
  * Stores command in queue and executes it.
  * @param {Function} command
  *   Object with execute and undo function.
  */
  function storeAndExecute(command) {
    var undoFn = true;

    if(!command) {
      $log.log('storeAndExecute: no command given');
      return;
    }

    if(typeof command != 'object') {
      $log.log('storeAndExecute: command is not an object');
      return; 
    }

    if(!command.hasOwnProperty('execute') || typeof command.execute != 'function') {
      $log.log('storeAndExecute: no execute method found or not a function');
      return; 
    }

    if(!command.hasOwnProperty('undo') || typeof command.undo != 'function') {
      $log.log('storeAndExecute: no undo method found or not a function. Command not added to queue.');
      undoFn = false;
    }

    if(undoFn) {
      if($scope.commands.length == $scope.COMMAND_QUEUE_SIZE) {
        //only store last $scope.COMMAND_QUEUE_SIZE commands
        $scope.commands = $scope.commands.slice(1);
        $scope.commands.push(command);
      } else {
        $scope.commands.push(command);  
      }  
    }

    try {
      command.execute();
    } catch(e) {
      $log.log('storeAndExecute: failed to execute command. ' + e);
      $scope.commands.pop(command);
      alert('commmand execution failed!');
    }
    
  }

  /**
  * Undo last action by executing undo on latest command.
  * Afterwards remove the command from array.
  */
  $scope.removeAndUndoLastCommand = function() {
      var commandToUndo;

      if($scope.commands.length > 0) {
        commandToUndo = $scope.commands.pop();
        commandToUndo.undo();  
      } else {
        $log.log('removeAndUndoLastCommand: no commands in queue');
      }
      
  }

 	function loadProjectNames() {
 		$http.get($scope.config.getCombinedServiceUrl() + '/reports', {
      headers: {
        'Accept' : 'text/plain'
      }
    }).success(function(data, status, headers, config) {
 			$scope.projectNames = data;
 		}).error(errorHandler);
 	}

  /**
  * Converts year and week of a report to Int.
  */
  function convertYearAndWeekToInt(report) {
    if(!report) {
      console.log('convertCalAndWeekToInt: no report given');
      return;
    }

      //always convert to int before saving
      report.year = parseInt(report.year);
      report.week = parseInt(report.week);
  }

  	
    //initially load reports or report entity based on url
    if($routeParams.reportId) {
      unregisterWatchForSearch();
      $scope.loadReport($routeParams.reportId);      
    } else {
      $scope.loadReports();
      loadProjectNames();
      registerWatchForSearch();
    }
  
  }

PReports.ReportCtrl.$inject = ['$scope', '$location', '$routeParams', 'Report', '$log', '$http', '$fileUploader', 'config', 'errorHandler', '$rootScope', 'language', '$timeout', '$interval'];