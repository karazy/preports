'use strict';

PReports.ReportCtrl =  function ($scope, $location, $routeParams, Report, $log, $http, $fileUploader, config, 
  errorHandler, $rootScope, language, $timeout, $interval, notification, $interpolate,
  helper) {

    var REPORT_DELETE_TIMEOUT = 5000,
        PAGINATION_LIMIT = 25;

    /**
    * Size of the command queue that holds undo events.
    */
    $scope.COMMAND_QUEUE_SIZE = 20;

  	$scope.reports = [];

    $scope.currentReport = null;

    //initialize global search parameters if they don't exist on $rootScope
  	$rootScope.search = $rootScope.search || {};
    $rootScope.search.year = ($rootScope.search.hasOwnProperty('year')) ? $rootScope.search.year : (new Date()).getFullYear();
    $rootScope.search.week = ($rootScope.search.hasOwnProperty('week')) ? $rootScope.search.week : (new Date()).getWeek();
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
        ],
        settings: {
          notifications: {
            recipients: [{
              email: 'abc@def.gh'
            }]
          }
        }
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
            $rootScope.search.page = wrapper.currentPage - 1;
          }).error(errorHandler);
          return;
        } else if(direction == 'prev' && $scope.reportsWrapper._links.prev) {
          $scope.reportsWrapper = $http.get(config.getCombinedServiceUrl() + $scope.reportsWrapper._links.prev.href).success(function(wrapper) {
            $scope.reportsWrapper = wrapper;
            $scope.reports = wrapper.reports;
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
        'limit' : PAGINATION_LIMIT
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
    * Reloads current report after external modifications.
    * @param {Boolean} redoLastModification
    *   If true reapplies the last issued command.
    */
    $scope.reloadReport = function(redoLastModification) {
      if(!$scope.currentReport) {
        $log.log('loadReport: No currentReport.');
        return;
      }

      //show 404 message
      $scope.reportNotFound = false;

      $scope.currentReport = Report.get({'id':$scope.currentReport._id}, function() {       
          if($scope.commands && $scope.commands.length > 0) {
            //TODO redo last action not ready for primetime yet! Undo must also be taken into account!
            // if(redoLastModification) {           
            //   var lastCommand = $scope.commands[$scope.commands.length-1];
            //   lastCommand.execute();
            // } 
            // else if(redoLastModification===false) {
              //remove last command
              // $scope.commands.pop();
            // }
          }
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
      newReport.week = date.getWeek();
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
      var updateCommand;

  		if(!$scope.currentReport) {
  			console.log('updateReport: no current report');
  			return;
  		}

      //prepare command
      updateCommand = {
        mP: modifiedProperty,
        pV: prevValue,
        iA: isArray,
        i: index,
        aN: arrayName
      }

      if(isArray && typeof index == 'number' && arrayName) {
        // var props = arrayName.split('.'),
        //     nestedObject;
        // if(props.length > 0) {
        //   val = $scope.currentReport;
        //   for (var i = 0; i < props.length; i++) {
        //     val = val[props[i]];
        //   }

          

        //   updateCommand.nV = nestedObject[index][updateCommand.mP];
        // } else {
          var nestedObject = getNestedObject($scope.currentReport, arrayName);
          updateCommand.nV = nestedObject[index][updateCommand.mP];
          // updateCommand.nV = $scope.currentReport[arrayName][index][updateCommand.mP];  
        // }
        
      } else {
        updateCommand.nV = $scope.currentReport[updateCommand.mP];  
      }
  		
      //always convert to int before saving
      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        if(isArray && typeof index == 'number' && arrayName) {
          var nestedObject = getNestedObject($scope.currentReport, arrayName);
          nestedObject[index][updateCommand.mP] = updateCommand.nV;
        } else {
          $scope.currentReport[updateCommand.mP] = updateCommand.nV;  
        }

        $scope.currentReport.$update(angular.noop, handleUpdateError);  
      }

      //only add update command when a modified property exists
      if(updateCommand.mP) {
        updateCommand.undo = function() {
          if(isArray && typeof index == 'number' && arrayName) {
            var nestedObject = getNestedObject($scope.currentReport, arrayName);
            nestedObject[index][updateCommand.mP] = updateCommand.pV;
            // modifiedEntity[updateCommand.mP] = updateCommand.pV;
          } else {
            $scope.currentReport[updateCommand.mP] = updateCommand.pV;  
          }
          $scope.currentReport.$update(angular.noop, handleUpdateError);
        }
      }

      function getNestedObject(object, nestedProperty) {
        var props,
            tmpObj;

        if(!nestedProperty) {
          return false;
        }

        props = nestedProperty.split('.');

        if(props.length > 0) {
          tmpObj = object;
          for (var i = 0; i < props.length; i++) {
            if(!props[i] || !props[i].length) {
              return false;
            }
            tmpObj = tmpObj[props[i]];
          }
        }

        return tmpObj;
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
          $http.delete(config.getCombinedServiceUrl() + $scope.reportToDelete._links.self.href).
        success(function(data, status, headers, config) {           
            if($location.path() == '/reports') {
              angular.forEach($scope.reports, function(r, index) {
                if($scope.reportToDelete._id == r._id) {
                  $scope.reports.splice(index, 1);
                  $scope.reportToDelete = null;
                  //exit loop
                  return false;
                }
              });
            } else {
              $location.path('/');
            }
        }).error(errorHandler);
        
        // $scope.reportToDelete.$delete(function() {
        //   $scope.reportToDelete = null;
        //   if($location.path() == '/reports') {
        //     angular.forEach($scope.reports, function(r, index) {
        //       if($scope.reportToDelete._id == r._id) {
        //         $scope.reports.splice(index, 1);
        //         //exit loop
        //         return false;
        //       }
        //     });
        //   } else {
        //     $location.path('/');
        //   }
        // }, errorHandler);        
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
        $scope.currentReport.$update(angular.noop, handleUpdateError);
      }

      updateCommand.undo = function() {
        $scope.currentReport.milestones.pop();
        $scope.currentReport.$update(angular.noop, handleUpdateError);
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
        $scope.currentReport.$update(angular.noop, handleUpdateError);
      }

      updateCommand.undo = function() {
        $scope.currentReport.milestones.splice(index, 0, milestoneToRemove);
        $scope.currentReport.$update(angular.noop, handleUpdateError);
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

    /**
    * Adds a recipient to currentReport.settings.notification.recipients.
    * Recipients listed there can be send a notification email.
    */
    $scope.addRecipient = function() {
      var updateCommand = {};

      if(!$scope.currentReport) {
        $log.log('addSystem: no current report');
        return;
      }

      if(!$scope.currentReport.settings) {
        $scope.currentReport.settings = {};
        $scope.currentReport.settings.notification = {};
        $scope.currentReport.settings.notification.recipients = [];
      } else if(!$scope.currentReport.settings.notification) {
        $scope.currentReport.settings.notification = {};
        $scope.currentReport.settings.settings.notification.recipients = [];
      } else if(!$scope.currentReport.settings.notification.recipients) {
        $scope.currentReport.settings.notification.recipients = [];
      }

      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        $scope.currentReport.settings.notification.recipients.push({
        });

        $scope.currentReport.$update();
      }

      updateCommand.undo = function() {
        $scope.currentReport.settings.notification.recipients.pop();
        $scope.currentReport.$update();
      }

      storeAndExecute(updateCommand);
    }

    /**
    * Removes a recipient from currentReport.settings.notification.recipients.
    * @param {Integer} index
    *   Index of reciepient to remove.
    */
    $scope.removeRecipient = function(index) {
      var updateCommand = {},
          objectToRemove;

      if(!$scope.currentReport) {
        $log.log('removeRecipient: no current report');
        return;
      }

      if(!index && index !== 0) {
        $log.log('removeRecipient: no index given');
        return;
      }

      if(!$scope.currentReport.settings || !$scope.currentReport.settings.notification || !$scope.currentReport.settings.notification.recipients 
        || $scope.currentReport.settings.notification.recipients.length == 0 || !$scope.currentReport.settings.notification.recipients[index]) {
        $log.log('removeRecipient: precondition checks on settings object failed');
        return;
      }

      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        objectToRemove = $scope.currentReport.settings.notification.recipients[index];
        $scope.currentReport.settings.notification.recipients.splice(index, 1);
        $scope.currentReport.$update();
      }

      updateCommand.undo = function() {
        $scope.currentReport.settings.notification.recipients.splice(index, 0, objectToRemove);
        $scope.currentReport.$update();
      }

      storeAndExecute(updateCommand);
    }

    /**
    * Sends a notification (email) to recipients listed in $scope.currentReport.settings.notification.recipients.
    * Uses PReports.service.notification.
    */
    $scope.sendNotifications = function() {
      var subject,
          content,
          templateData;

      if(!$scope.currentReport) {
        console.log('sendNotifications: no current report');
        return;
      }

      templateData = {
        name: $scope.currentReport.name,
        week: $scope.currentReport.week,
        year: $scope.currentReport.year,
        url: location.href
      }

      //setup notification content
      subject = $interpolate(language.translate('notification.subject.template'));
      subject = subject(templateData);

      content = $interpolate(language.translate('notification.content.template'));
      content = content(templateData);

      notification.send(subject, content, $scope.currentReport.settings.notification.recipients, callback);

      function callback(success, response) {
        if(!success) {
            errorHandler(response);
          }
      }
    }

    /**
    * Deletes an image.
    * @param {Object} image
    *   Image to delete. Contains only meta data.
    *
    */
    $scope.deleteReportImage = function(image) {
    	if(!image) {
    		console.log('deleteReportImage: no image given');
    		return;
    	}

    	if(!$scope.currentReport) {
  			console.log('deleteReportImage: no current report');
  			return;
  		}

    	$http.delete(config.getCombinedServiceUrl() + image._links.self.href).
      	success(function(data, status, headers, config) {
    			angular.forEach($scope.currentReport.images, function(object, index) {
    				if(object._id  == image._id) {
    					$scope.currentReport.images.splice(index, 1);
    					return false;
    				}
    			});
  		  }).error(errorHandler);
    }

    /**
    * Convenience methods. Allows user to show print dialog from the application.
    *
    */
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

 	$scope.copyReport = function(reportToCopy, $event) {
    var date = new Date();

 		if(!reportToCopy) {
    		console.log('copyReport: no reportToCopy given');
    		return;
    	}

    	//link to original report
    	reportToCopy.copyOf = reportToCopy._id;
    	delete reportToCopy._id;

    	reportToCopy.name = reportToCopy.name +'_copy';
      reportToCopy.week = date.getWeek();
      reportToCopy.year = date.getFullYear();
      reportToCopy.locked = false;

    	saveReport(reportToCopy);
 	}

  /**
  * Locks currently edited report to prevnt accidential edits.
  */
  $scope.toggleReportLock = function() {
    var prevLockState;
    if(!$scope.currentReport) {
      console.log('copyReport: no currentReport');
      return;
    }

    if(typeof $scope.currentReport.locked != 'undefined') {
      prevLockState = $scope.currentReport.locked;
      $scope.currentReport.locked = !prevLockState;       
    } else {
      prevLockState = false;
      $scope.currentReport.locked = true;
    }

    $scope.updateReport();
    
  }


  $scope.isUrl = function(url) {
    return helper.isUrl(url);
  }

  $scope.calculateCosts = function() {
    if(!$scope.currentReport) {
      console.log('copyReport: no currentReport');
      return;
    }

    var updateCommand = {
      prev: {
        hoursExternal: $scope.currentReport.hoursExternal,
        hoursInternalBI: $scope.currentReport.hoursInternalBI,
        hoursInternalIQuest: $scope.currentReport.hoursInternalIQuest
      }
    };
    

    updateCommand.execute = function() {
          console.log('calculateCosts: execute');
          var currentCosts = 0;
              
          if($scope.temp.costs.hoursExternal) {
            $scope.currentReport.hoursExternal = $scope.temp.costs.hoursExternal;
            currentCosts = $scope.config.COST_EXTERNAL * $scope.temp.costs.hoursExternal;  
          }

          if($scope.temp.costs.hoursInternalBI) {
            $scope.currentReport.hoursInternalBI = $scope.temp.costs.hoursInternalBI;
            currentCosts += $scope.config.COST_INTERNAL_BI * $scope.temp.costs.hoursInternalBI;  
          }

          if($scope.temp.costs.hoursInternalIQuest) {
            $scope.currentReport.hoursInternalIQuest = $scope.temp.costs.hoursInternalIQuest;
            currentCosts += $scope.config.COST_INTERNAL_IQUEST * $scope.temp.costs.hoursInternalIQuest;  
          } 

          //Adjust for display in k€
          $scope.currentReport.costsCurrent =  currentCosts / 1000;

          if($scope.currentReport.costsCurrent && $scope.currentReport.costsPlanned) {
            $scope.currentReport.costsRest =   $scope.currentReport.costsPlanned - $scope.currentReport.costsCurrent;
            $scope.currentReport.costsDelta =  calcCostsDelta();
          } else {
            $scope.currentReport.costsRest = null;
            $scope.currentReport.costsDelta = null;
          }
          
          $scope.currentReport.$update(angular.noop, handleUpdateError); 

          //remove the temp costs
          delete $scope.temp.costs;
    }

    updateCommand.undo = function() {
      console.log('calculateCosts: undo');
      var currentCosts = 0;
    
          if(updateCommand.prev.hoursExternal) {
            $scope.currentReport.hoursExternal = updateCommand.prev.hoursExternal;
            currentCosts = $scope.config.COST_EXTERNAL * updateCommand.prev.hoursExternal;  
          }

          if(updateCommand.prev.hoursInternalBI) {
            $scope.currentReport.hoursInternalBI = updateCommand.prev.hoursInternalBI;
            currentCosts += $scope.config.COST_INTERNAL_BI * updateCommand.prev.hoursInternalBI;  
          }

          if(updateCommand.prev.hoursInternalIQuest) {
            $scope.currentReport.hoursInternalIQuest = updateCommand.prev.hoursInternalIQuest;
            currentCosts += $scope.config.COST_INTERNAL_IQUEST * updateCommand.prev.hoursInternalIQuest;  
          } 

          //Adjust for display in k€
          $scope.currentReport.costsCurrent =  currentCosts / 1000;

          if($scope.currentReport.costsCurrent && $scope.currentReport.costsPlanned) {
            $scope.currentReport.costsRest =   $scope.currentReport.costsPlanned - $scope.currentReport.costsCurrent;
            $scope.currentReport.costsDelta =  calcCostsDelta();
          }
          
          $scope.currentReport.$update(angular.noop, handleUpdateError); 

          //remove the temp costs
          delete $scope.temp.costs;
    }

     storeAndExecute(updateCommand);
  }



  $scope.toggleCostDialog = function() {
    var modal = angular.element('#costDialog .modal');

    if(!modal) {
      console.log('No cost dialog found.');
    }


    $scope.temp = $scope.temp ? $scope.temp : {};

    $scope.temp.costs = {
      hoursExternal: $scope.currentReport.hoursExternal,
      hoursInternalBI: $scope.currentReport.hoursInternalBI,
      hoursInternalIQuest: $scope.currentReport.hoursInternalIQuest
    }

    if(!$scope.currentReport.locked) {
      modal.modal('toggle');  
    }
    
  }

  function calcCostsDelta() {
    var delta = $scope.currentReport.costsCurrent / $scope.currentReport.costsPlanned;
    
    //reduce to precision of 2 
    delta = Math.round(delta * 100);

    return delta;

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

   /**
   * Handles errors during report update.
   * Especially for error 428 when report has been modified externaly. Lost update problem.
   * @param {Object} response
   *  Server resonse
   */
   function handleUpdateError(response) {
    if(!response) {
      return
    }

    if(response.status == 428) {
      //modified by third party
      $log.log('Failed to update report because it has been modified.');
      //prevent accidential overrides by killing the undo stack
      $scope.commands = [];
      $('#dialogModifiedReport').modal('toggle');
    } else {
      errorHandler(response);
    }
  }

}

PReports.ReportCtrl.$inject = [
  '$scope', 
  '$location', 
  '$routeParams', 
  'Report', '$log', 
  '$http', 
  '$fileUploader', 
  'config', 
  'errorHandler', 
  '$rootScope', 
  'language', 
  '$timeout', 
  '$interval',
  'notification',
  '$interpolate',
  'helper'];