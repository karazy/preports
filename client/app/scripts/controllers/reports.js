'use strict';

angular.module('PReports').controller('ReportCtrl', ['$scope',
  '$location',
  '$routeParams',
  'Report',
  '$log',
  '$http',
  'FileUploader',
  'config',
  'errorHandler',
  '$rootScope',
  'language',
  '$timeout',
  '$interval',
  '$interpolate',
  'helper',
  'hotkeys',
  function($scope, $location, $routeParams, Report, $log, $http, FileUploader, config,
    errorHandler, $rootScope, language, $timeout, $interval, $interpolate,
    helper, hotkeys) {

    var REPORT_DELETE_TIMEOUT = 5000,
        PAGINATION_LIMIT = 25;

    /**
     * Size of the command queue that holds undo events.
     */
    $scope.COMMAND_QUEUE_SIZE = 20;
    /**
    * Reports retrieved after search.
    */
    $scope.reports = [];
    $scope.currentReport = null;
    $scope.years = [2014, 2015, 2016, 2017];

    /*
     * Current calendar week.
     */
    $scope.currentCalWeek = (new Date()).getWeek();
    $scope.currentCalYear = (new Date()).getFullYear();

    //initialize global search parameters if they don't exist on $rootScope
    $rootScope.search = $rootScope.search || {};
    $rootScope.search.year = ($rootScope.search.hasOwnProperty('year')) ? $rootScope.search.year : (new Date()).getFullYear();
    $rootScope.search.week = ($rootScope.search.hasOwnProperty('week')) ? $rootScope.search.week : (new Date()).getWeek();
    $rootScope.search.name = ($rootScope.search.hasOwnProperty('name')) ? $rootScope.search.name : '';
    $rootScope.search.limit = PAGINATION_LIMIT;
    $rootScope.search.page = ($rootScope.search.hasOwnProperty('page')) ? $rootScope.search.page : 0;


    $scope.config = config;

    $scope.projectNames = [];

    //show 404 message
    $scope.reportNotFound = false;

    /**
     * List of executed commands during report editing
     */
    $scope.commands = [];

    /**
    * The currently via arrow keys selected row in the UI.
    */
    $scope.selectedReportSearchRow = null;



    function updateSortableOptions() {
      /**
       * Options used for sortable elements.
       *
       */
      $scope.reportSortableOptions = {
        disabled: $scope.isReportLocked(),
        axis: 'y',
        update: function(event, ui) {
          var updateCommand = {},
            oldOrder = angular.copy($scope.currentReport.milestones);

          updateCommand.execute = function() {
            $scope.currentReport.$update();
          };

          updateCommand.undo = function() {
            //arraymove($scope.currentReport.milestones,)
            $scope.currentReport.milestones = oldOrder;
            $scope.currentReport.$update();
          };

          function arraymove(arr, fromIndex, toIndex) {
            var element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
          }

          storeAndExecute(updateCommand);
        }
      };
    }


    jQuery('[data-toggle="tooltip"]').tooltip();

    $scope.loadReports = function(direction) {
      var page,
        limit;
      console.log('loadReports');

      $scope.selectedReportSearchRow = null;

      fillWeeks($rootScope.search.year);

      if ($scope.reportsWrapper && $scope.reportsWrapper._links) {
        if (direction == 'next' && $scope.reportsWrapper._links.next) {
          $http.get(config.getCombinedServiceUrl() + $scope.reportsWrapper._links.next.href).success(function(wrapper) {
            $scope.reportsWrapper = wrapper;
            $scope.reports = wrapper.reports;
            $rootScope.search.page = wrapper.currentPage - 1;
          }).error(errorHandler);
          return;
        } else if (direction == 'prev' && $scope.reportsWrapper._links.prev) {
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
          'week': $rootScope.search.week,
          'name': $rootScope.search.name,
          'page': $rootScope.search.page,
          'limit': PAGINATION_LIMIT
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
        tmpHandle,
        tmpMaxWeekOldYear,
        tmpMaxWeekNewYear;

      if (!$rootScope.watchHandles) {
        $rootScope.watchHandles = [];
      }

      tmpHandle = $rootScope.$watch('search.name', function(newVal, oldVal) {
        if (newVal != oldVal) {
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

      tmpHandle = $rootScope.$watch('search.year', function(newVal, oldVal) {
        if (newVal != oldVal) {
          $rootScope.search.page = 0;
          tmpMaxWeekOldYear = helper.getMaxWeeksPerYear(oldVal);
          //if max week was selected, recalculate week. This will trigger
          if($rootScope.search.week === tmpMaxWeekOldYear) {
            tmpMaxWeekNewYear = helper.getMaxWeeksPerYear(newVal);
            if(tmpMaxWeekOldYear > tmpMaxWeekNewYear) {
              //will trigger the watch on search.week and therefore call loadReports
              $rootScope.search.week = tmpMaxWeekNewYear;  
            } else {
              $scope.loadReports();
            }
          } else {
            $scope.loadReports();
          }
        }
      });

      $rootScope.watchHandles.push(tmpHandle);

      tmpHandle = $rootScope.$watch('search.week', function(newVal, oldVal) {
        if (newVal != oldVal) {
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
      if ($rootScope.watchHandles && $rootScope.watchHandles.length > 0) {
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
    $scope.loadReport = function(id) {
      if (!id) {
        $log.log('loadReport: No Id provided.');
        return;
      }
      //show 404 message
      $scope.reportNotFound = false;

      $scope.currentReport = Report.get({
        'id': id
      }, function() {
        fillWeeks();
        updateSortableOptions();
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
      if (!$scope.currentReport) {
        $log.log('loadReport: No currentReport.');
        return;
      }

      //show 404 message
      $scope.reportNotFound = false;

      $scope.currentReport = Report.get({
        'id': $scope.currentReport._id
      }, function() {
        if ($scope.commands && $scope.commands.length > 0) {
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

      if ($rootScope.search.week) {
        $location.search('week', $rootScope.search.week);
      }

      if ($rootScope.search.year) {
        $location.search('year', $rootScope.search.year);
      }

      if ($rootScope.search.name) {
        $location.search('name', $rootScope.search.name);
      }
    }

    /**
     * Uses query params from url and adds them to 
     * $rootScope.search object
     */
    function setQueryParamsAsSearch() {
      var queryParams = $location.search();
      if (queryParams) {
        if (queryParams.week) {
          $rootScope.search.week = parseInt(queryParams.week);
        }
        if (queryParams.year) {
          $rootScope.search.year = queryParams.year;
        }
        if (queryParams.name) {
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
      if (!id || !event) {
        return;
      }

      if (event.target.tagName != 'TD') {
        //user clicked action button or link, so do nothing!
        return;
      }

      $location.path('reports/' + id);
    };

    $scope.createNewReport = function() {
      var newReport = {},
        date = new Date();

      newReport.year = date.getFullYear();
      newReport.week = date.getWeek();
      newReport.name = $scope.newReportName;

      newReport.milestones = [];

      saveReport(newReport);
    };

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

      if (!$scope.currentReport) {
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
      };

      if (isArray && typeof index == 'number' && arrayName) {
        var nestedObject = getNestedObject($scope.currentReport, arrayName);
        updateCommand.nV = nestedObject[index][updateCommand.mP];
      } else {
        updateCommand.nV = $scope.currentReport[updateCommand.mP];
      }

      //always convert to int before saving
      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        if (isArray && typeof index === 'number' && arrayName) {
          var nestedObject = getNestedObject($scope.currentReport, arrayName);
          nestedObject[index][updateCommand.mP] = updateCommand.nV;
        } else {
          $scope.currentReport[updateCommand.mP] = updateCommand.nV;
        }

        $scope.currentReport.$update(function() {
          $scope.$emit('report-change-' + updateCommand.mP);
        }, handleUpdateError);
      };

      //only add update command when a modified property exists
      if (updateCommand.mP) {
        updateCommand.undo = function() {
          if (isArray && typeof index === 'number' && arrayName) {
            var nestedObject = getNestedObject($scope.currentReport, arrayName);
            nestedObject[index][updateCommand.mP] = updateCommand.pV;
            // modifiedEntity[updateCommand.mP] = updateCommand.pV;
          } else {
            $scope.currentReport[updateCommand.mP] = updateCommand.pV;
          }
          $scope.currentReport.$update(function() {
            $scope.$emit('report-change-' + updateCommand.mP);
          }, handleUpdateError);
        };
      }

      function getNestedObject(object, nestedProperty) {
        var props,
          tmpObj;

        if (!nestedProperty) {
          return false;
        }

        props = nestedProperty.split('.');

        if (props.length > 0) {
          tmpObj = object;
          for (var i = 0; i < props.length; i++) {
            if (!props[i] || !props[i].length) {
              return false;
            }
            tmpObj = tmpObj[props[i]];
          }
        }

        return tmpObj;
      }

      storeAndExecute(updateCommand);

      updateSortableOptions();
    }

    $scope.updateReportYear = function(newYear, oldYear) {
      var tmpMaxWeekOldYear,
          tmpMaxWeekNewYear,
          updateCommand;

     tmpMaxWeekOldYear = helper.getMaxWeeksPerYear(oldYear);
     //if max week was selected, recalculate week.
      if($scope.currentReport.week === tmpMaxWeekOldYear) {
        tmpMaxWeekNewYear = helper.getMaxWeeksPerYear(newYear);
        if(tmpMaxWeekOldYear > tmpMaxWeekNewYear) {              
           adjustAndPersistWeek();
        } else {
          $scope.updateReport('year', parseInt(oldYear), false);  
        }
      } else {
        $scope.updateReport('year', parseInt(oldYear), false);
      }

      function adjustAndPersistWeek() {
        //save prev values
        updateCommand = {
          prev: {
            week: parseInt($scope.currentReport.week),
            year: parseInt(oldYear)
          }
        };

        updateCommand.execute = function() {
          $scope.currentReport.week = parseInt(tmpMaxWeekNewYear);         
          $scope.currentReport.$update(angular.noop, handleUpdateError);
          $scope.$emit('report-change-year');
        }

        updateCommand.undo = function() {
          var cYear = $scope.currentReport.year;
          $scope.currentReport.week = updateCommand.prev.week;
          $scope.currentReport.year = updateCommand.prev.year;        
          $scope.currentReport.$update(angular.noop, handleUpdateError);
          $scope.$emit('report-change-year');
        }

        storeAndExecute(updateCommand);
      }

      
    }

    $scope.updateReportWeek = function(newWeek, oldWeek) {
      $scope.updateReport('week', parseInt(oldWeek), false);
    }

    /**
     * Increases or decreases the current report week in steps of +/- 1.
     * Takes changes and start/end of year into consideration.
     * @param direction
     *   dec for decreasing and inc for increasing
     *
     */
    $scope.incrementalUpdateReportWeek = function(direction) {

      if($scope.isReportLocked()) {
        return;
      }

      if (!direction) {
        $log.log('No valid direction given.');
        return;
      }

      if (direction != 'dec' && direction != 'inc') {
        $log.log('No valid direction provided. ' + direction);
        return;
      }

      var oldWeek = $scope.currentReport.week,
        baseYear = (direction == 'dec') ? $scope.currentReport.year - 1 : $scope.currentReport.year,
        //use 28th december since it is always in last years week
        baseDate = new Date(baseYear, 11, 28),
        maxWeek = baseDate.getWeek(),
        updateCommand;

      //save prev values
      updateCommand = {
        prev: {
          week: $scope.currentReport.week,
          year: $scope.currentReport.year
        }
      };

      updateCommand.execute = function() {
        if (direction == 'dec') {
          if ($scope.currentReport.week > 1) {
            $scope.currentReport.week--;
          } else {
            $scope.currentReport.week = maxWeek;
            $scope.currentReport.year--;
          }

        } else if (direction == 'inc') {
          if ($scope.currentReport.week < maxWeek) {
            $scope.currentReport.week++;
          } else {
            $scope.currentReport.week = 1;
            $scope.currentReport.year++;
          }
        }
        $scope.currentReport.$update(function() {
          if (updateCommand.prev.year != $scope.currentReport.year) {
            $scope.$emit('report-change-year');
          }
        }, handleUpdateError);
      }

      updateCommand.undo = function() {
        var cYear = $scope.currentReport.year;
        $scope.currentReport.week = updateCommand.prev.week;
        $scope.currentReport.year = updateCommand.prev.year;

        $scope.currentReport.$update(function() {
          if (cYear != $scope.currentReport.year) {
            $scope.$emit('report-change-year');
          }
        }, handleUpdateError);
      }

      storeAndExecute(updateCommand);
    }

    $scope.deleteReport = function(report) {
      $scope.reportToDelete = report || $scope.currentReport;

      if (!$scope.reportToDelete) {
        console.log('deleteReport: no report to delete');
        return;
      }

      $scope.remainingSecondsBeforeDoomsday = Math.round(REPORT_DELETE_TIMEOUT / 1000);
      $scope.deleteTimer = true;

      $scope.doomsdayInterval = $interval(countDown, 1000, $scope.remainingSecondsBeforeDoomsday + 1);

      function killTheReport() {
        $http.delete(config.getCombinedServiceUrl() + $scope.reportToDelete._links.self.href).
        success(function(data, status, headers, config) {
          if ($location.path() == '/reports') {
            angular.forEach($scope.reports, function(r, index) {
              if ($scope.reportToDelete._id == r._id) {
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
        if ($scope.remainingSecondsBeforeDoomsday > 0) {
          $scope.remainingSecondsBeforeDoomsday = $scope.remainingSecondsBeforeDoomsday - 1;
        } else {
          $scope.deleteTimer = false;
          killTheReport();
        }
      }
    }

    $scope.delayDoomsday = function() {
      $scope.deleteTimer = false;

      if ($scope.doomsdayInterval) {
        $interval.cancel($scope.doomsdayInterval);
        $scope.doomsdayInterval = null;
      }
    }

    function saveReport(report) {
      var resource;

      if (!report) {
        console.log('saveReport: no report given');
        return;
      }

      resource = new Report(report);

      if (report._id) {
        //error
      } else {
        //new
        resource.$create(function(saved) {
          console.log('saved new report');
          $scope.newReportName = null;
          $location.path('reports/' + resource._id)

        }, function(response) {
          if (response.status == 409) {
            response.data.errorKey = 'error.report.clone';
          }

          errorHandler(response);

          if (response.status == 409) {
            //jump to copied report also some problems exist
            $scope.newReportName = null;
            $location.path('reports/' + response.data._id)
          }

        });

      }
    }

    /**
     * Add a new milestone to currentReport.
     */
    $scope.addMilestone = function() {
      var updateCommand = {};

      if (!$scope.currentReport) {
        console.log('addMilestone: no current report');
        return;
      }

      if (!$scope.currentReport.milestones) {
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

      if (!$scope.currentReport) {
        console.log('addMilestone: no current report');
        return;
      }

      if (!index && index !== 0) {
        console.log('addMilestone: no index given');
        return;
      }

      if (!$scope.currentReport.milestones || $scope.currentReport.milestones.length == 0 || !$scope.currentReport.milestones[index]) {
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

      if (!$scope.currentReport) {
        console.log('addCodeReview: no current report');
        return;
      }

      if (!$scope.currentReport.codeReviews) {
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

      if (!$scope.currentReport) {
        console.log('removeCodeReview: no current report');
        return;
      }

      if (!index && index !== 0) {
        console.log('removeCodeReview: no index given');
        return;
      }

      if (!$scope.currentReport.codeReviews || $scope.currentReport.codeReviews.length == 0 || !$scope.currentReport.codeReviews[index]) {
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

      if (!$scope.currentReport) {
        console.log('addSystem: no current report');
        return;
      }

      if (!$scope.currentReport.systems) {
        $scope.currentReport.systems = [];
      }

      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        $scope.currentReport.systems.push({});

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

      if (!$scope.currentReport) {
        console.log('removeSystem: no current report');
        return;
      }

      if (!index && index !== 0) {
        console.log('removeSystem: no index given');
        return;
      }

      if (!$scope.currentReport.systems || $scope.currentReport.systems.length == 0 || !$scope.currentReport.systems[index]) {
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
     * Recipients listed there can be send a notification.
     */
    $scope.addRecipient = function() {
      var updateCommand = {};

      if (!$scope.currentReport) {
        $log.log('addSystem: no current report');
        return;
      }

      if (!$scope.currentReport.settings) {
        $scope.currentReport.settings = {};
        $scope.currentReport.settings.notification = {};
        $scope.currentReport.settings.notification.recipients = [];
      } else if (!$scope.currentReport.settings.notification) {
        $scope.currentReport.settings.notification = {};
        $scope.currentReport.settings.settings.notification.recipients = [];
      } else if (!$scope.currentReport.settings.notification.recipients) {
        $scope.currentReport.settings.notification.recipients = [];
      }

      convertYearAndWeekToInt($scope.currentReport);

      updateCommand.execute = function() {
        $scope.currentReport.settings.notification.recipients.push({});

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

      if (!$scope.currentReport) {
        $log.log('removeRecipient: no current report');
        return;
      }

      if (!index && index !== 0) {
        $log.log('removeRecipient: no index given');
        return;
      }

      if (!$scope.currentReport.settings || !$scope.currentReport.settings.notification || !$scope.currentReport.settings.notification.recipients || $scope.currentReport.settings.notification.recipients.length == 0 || !$scope.currentReport.settings.notification.recipients[index]) {
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

      if (!$scope.currentReport) {
        console.log('sendNotifications: no current report');
        return;
      }

      $http.post(config.getCombinedServiceUrl() + '/reports/' + $scope.currentReport._id + '/notifications')
        .success(angular.noop)
        .error(function(response) {
          $log.error('Failed so send notifications ' + response.message);
          errorHandler(response);
        });
    }

    /**
     * Deletes an image.
     * @param {Object} image
     *   Image to delete. Contains only meta data.
     *
     */
    $scope.deleteReportImage = function(image) {
      if (!image) {
        console.log('deleteReportImage: no image given');
        return;
      }

      if (!$scope.currentReport) {
        console.log('deleteReportImage: no current report');
        return;
      }

      $http.delete(config.getCombinedServiceUrl() + image._links.self.href).
      success(function(data, status, headers, config) {
        angular.forEach($scope.currentReport.images, function(object, index) {
          if (object._id == image._id) {
            $scope.currentReport.images.splice(index, 1);
            return false;
          }
        });

        loadReportVersion($scope.currentReport, function(versionInfo) {
          $scope.currentReport.version = versionInfo.version;
        });

      }).error(errorHandler);
    }

    /**
     * Convenience methods. Allows user to show print dialog from the application.
     *
     */
    $scope.printReport = function() {

      if (!$scope.currentReport) {
        console.log('printReport: no current report');
        return;
      }

      window.print();
    }

    function setupFileUpload() {
      var uploader = $scope.uploader = new FileUploader({
        scope: $scope, // to automatically update the html. Default: $rootScope
        // url: config.getCombinedServiceUrl() + '/reports/' + $scope.currentReport._id + '/images',            
        //since setup is performed before loading the report we take the report id from URL
        url: config.getCombinedServiceUrl() + '/reports/' + $routeParams.reportId + '/images',
        alias: 'image',
        removeAfterUpload: true,
        autoUpload: false,
      });

      uploader.filters.push({
        name: 'imageFilter',
        fn: function(item, options) {
          var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
          type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      });

      uploader.onCompleteItem = function(item, response, status, headers) {
        $log.log(response);

        if (status != 200) {
          return;
        }

        if (!$scope.currentReport.images) {
          $scope.currentReport.images = [];
        }

        $scope.currentReport.images.push(response);
      };

      uploader.onCompleteAll = function() {
        //Update report with latest version.
        loadReportVersion($scope.currentReport, function(versionInfo) {
          $scope.currentReport.version = versionInfo.version;
        });

      };

      uploader.onErrorItem = function(item, response, status, headers) {
        console.log('setupFileUpload: upload failed');
        //show global error. for more information have a look inside the errorHandler
        $rootScope.error = true;
        $rootScope.errorMessage = language.translate(response) ||
          language.translate('error.image.upload') ||
          language.translate('error.general') ||
          'Error during communication with service.';
      };
    }

    $scope.copyReport = function(reportToCopy, $event) {
      var date = new Date();

      if (!reportToCopy) {
        console.log('copyReport: no reportToCopy given');
        return;
      }

      //link to original report
      reportToCopy.copyOf = reportToCopy._id;
      delete reportToCopy._id;

      reportToCopy.name = reportToCopy.name + '_copy';
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
      if (!$scope.currentReport) {
        console.log('copyReport: no currentReport');
        return;
      }

      if (typeof $scope.currentReport.locked != 'undefined') {
        prevLockState = $scope.currentReport.locked;
        $scope.currentReport.locked = !prevLockState;
      } else {
        prevLockState = false;
        $scope.currentReport.locked = true;
      }

      $scope.updateReport();

    }

    $scope.isReportLocked = function() {
      if (!$scope.currentReport) {
        return false;
      }

      return $scope.currentReport.locked;
    }


    $scope.isUrl = function(url) {
      return helper.isUrl(url);
    }

    $scope.calculateCosts = function() {
      if (!$scope.currentReport) {
        console.log('copyReport: no currentReport');
        return;
      }

      //save prev values
      var updateCommand = {
        prev: {
          hoursExternal: $scope.currentReport.hoursExternal,
          hoursInternal: $scope.currentReport.hoursInternal,
          hoursNearshoring: $scope.currentReport.hoursNearshoring,
          costsCurrent: $scope.currentReport.costsCurrent,
          // costsRest: $scope.currentReport.costsRest,
          costsDelta: $scope.currentReport.costsDelta
        }
      };


      updateCommand.execute = function() {
        console.log('calculateCosts: execute');
        var currentCosts = 0;

        if ($scope.temp.costs.hoursExternal) {
          $scope.currentReport.hoursExternal = $scope.temp.costs.hoursExternal;
          currentCosts = $scope.config.COST_EXTERNAL * $scope.temp.costs.hoursExternal;
        }

        if ($scope.temp.costs.hoursInternal) {
          $scope.currentReport.hoursInternal = $scope.temp.costs.hoursInternal;
          currentCosts += $scope.config.COST_INTERNAL * $scope.temp.costs.hoursInternal;
        }

        if ($scope.temp.costs.hoursNearshoring) {
          $scope.currentReport.hoursNearshoring = $scope.temp.costs.hoursNearshoring;
          currentCosts += $scope.config.COST_NEARSHORE * $scope.temp.costs.hoursNearshoring;
        }

        //Adjust for display in k€
        currentCosts = currentCosts / 1000;

        $scope.currentReport.costsCurrent = Math.round(currentCosts);

        if ($scope.currentReport.costsCurrent && $scope.currentReport.costsPlanned) {
          // $scope.currentReport.costsRest =   $scope.currentReport.costsPlanned - $scope.currentReport.costsCurrent;
          $scope.currentReport.costsDelta = calcCostsDelta($scope.currentReport.costsCurrent, $scope.currentReport.costsPlanned);
        } else {
          // $scope.currentReport.costsRest = null;
          $scope.currentReport.costsDelta = null;
        }

        $scope.currentReport.$update(angular.noop, handleUpdateError);

        //remove the temp costs
        delete $scope.temp.costs;
      }

      updateCommand.undo = function() {
        console.log('calculateCosts: undo');
        //restore previous values
        $scope.currentReport.hoursExternal = updateCommand.prev.hoursExternal;
        $scope.currentReport.hoursInternal = updateCommand.prev.hoursInternal;
        $scope.currentReport.hoursNearshoring = updateCommand.prev.hoursNearshoring;
        $scope.currentReport.costsCurrent = updateCommand.prev.costsCurrent;
        // $scope.currentReport.costsRest =  updateCommand.prev.costsRest;
        $scope.currentReport.costsDelta = updateCommand.prev.costsDelta;

        $scope.currentReport.$update(angular.noop, handleUpdateError);

        //remove the temp costs
        delete $scope.temp.costs;
      }

      storeAndExecute(updateCommand);
    }



    $scope.toggleCostDialog = function() {
      var modal = angular.element('#costDialog .modal');

      if (!modal) {
        console.log('No cost dialog found.');
      }


      $scope.temp = $scope.temp ? $scope.temp : {};
      //fill dialog with temporary cost values
      //needed to provide undo functionality
      $scope.temp.costs = {
        hoursExternal: $scope.currentReport.hoursExternal,
        hoursInternal: $scope.currentReport.hoursInternal,
        hoursNearshoring: $scope.currentReport.hoursNearshoring
      }

      if (!$scope.currentReport.locked) {
        modal.modal('toggle');
      }

    }

    function calcCostsDelta(current, planned) {
      var delta = current / planned;

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

      if (!command) {
        $log.log('storeAndExecute: no command given');
        return;
      }

      if (typeof command != 'object') {
        $log.log('storeAndExecute: command is not an object');
        return;
      }

      if (!command.hasOwnProperty('execute') || typeof command.execute != 'function') {
        $log.log('storeAndExecute: no execute method found or not a function');
        return;
      }

      if (!command.hasOwnProperty('undo') || typeof command.undo != 'function') {
        $log.log('storeAndExecute: no undo method found or not a function. Command not added to queue.');
        undoFn = false;
      }

      if (undoFn) {
        if ($scope.commands.length == $scope.COMMAND_QUEUE_SIZE) {
          //only store last $scope.COMMAND_QUEUE_SIZE commands
          $scope.commands = $scope.commands.slice(1);
          $scope.commands.push(command);
        } else {
          $scope.commands.push(command);
        }
      }

      try {
        command.execute();
      } catch (e) {
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

      if($scope.isReportLocked()) {
        return;
      }

      if ($scope.commands.length > 0) {
        commandToUndo = $scope.commands.pop();
        commandToUndo.undo();
      } else {
        $log.log('removeAndUndoLastCommand: no commands in queue');
      }

    }

    $scope.isZero = function(value) {
      return helper.isZero(value);
    }

    $scope.getStateColor = function(state) {
      var color = '';

      if (!state) {
        return '';
      }

      switch (state) {
        case 1:
          color = 'red';
          break;
        case 2:
          color = 'yellow';
          break;
        case 3:
          color = 'green';
          break;
      }

      return color;
    }

    function loadProjectNames() {
      $http.get($scope.config.getCombinedServiceUrl() + '/reports', {
        headers: {
          'Accept': 'text/plain'
        }
      }).success(function(data, status, headers, config) {
        $scope.projectNames = data;
      }).error(errorHandler);
    }

    /**
     * Converts year and week of a report to Int.
     */
    function convertYearAndWeekToInt(report) {
      if (!report) {
        console.log('convertCalAndWeekToInt: no report given');
        return;
      }

      //always convert to int before saving
      report.year = parseInt(report.year);
      report.week = parseInt(report.week);
    }

    /**
     * Load version information for given report.
     */
    function loadReportVersion(report, callback) {
      if (!report) {
        console.log('loadReportVersion: no report given');
        return;
      }
      $http.get(config.getCombinedServiceUrl() + report._links.self.href + '/version').success(function(versionInfo) {
        console.log('Retrieved version ' + versionInfo.version + ' for report id ' + versionInfo._id);
        callback(versionInfo);
      }).error(errorHandler);
      return;
    }

    /**
     * Fills $scope.weeks based on number of weeks for current report year.
     *
     */
    function fillWeeks(baseYear) {
      //use 28th december since it is always in last years week
      var baseDate,
        maxWeek,
        weeks = [];

      if (baseYear) {
        baseDate = new Date(baseYear, 11, 28);
      } else {
        baseDate = new Date($scope.currentReport.year, 11, 28);
      }

      maxWeek = baseDate.getWeek();

      //fill calendar weeks
      for (var i = 1; i <= maxWeek; i++) {
        weeks.push({
          'week': i
        });
      };

      $scope.weeks = weeks;
    }

    $scope.resetSearchCal = function() {
      $rootScope.search.year = $scope.currentCalYear;
      $rootScope.search.week = $scope.currentCalWeek;
    }

    /**
     * Register event handlers.
     *
     */
    function registerEventHandlers() {
      $scope.$on('report-change-year', function(eventData) {
        fillWeeks();
      });
    }

    /**
    * Resgister hotkeys for report detail view.
    *
    */
    function registerReportDetailHotkeys() {
      //hotkeys.del();

      hotkeys.bindTo($scope).add(
        {
          combo: 'ctrl+z',
          description: 'Undo',
          callback: function() {
            $log.log('Hotkey');
            $scope.removeAndUndoLastCommand();
          }
        }
      )
      .add(
        {
          combo: 'plus',
          description: 'Increase report week',
          callback: function() {
            $log.log('Hotkey');
            $scope.incrementalUpdateReportWeek('inc');
          }
        }
      )
      .add(
        {
          combo: '-',
          description: 'Decrease report week',
          callback: function() {
            $log.log('Hotkey');
            $scope.incrementalUpdateReportWeek('dec');
          }
        }
      )
      .add(
        {
          combo: 'l',
          description: 'Lock report',
          callback: function() {
            $log.log('Hotkey');
            $scope.toggleReportLock();
          }
        }
      );

      hotkeys.del('esc');

      //Disabled since direct call to methods doesn't show the 
      //confirmation window like the directive does

      // hotkeys.add(
      //   {
      //     combo: 'c',
      //     description: 'Hotkey: Copy report',
      //     callback: function() {
      //       $scope.copyReport($scope.currentReport);
      //     }
      //   }
      // );

      // hotkeys.add(
      //   {
      //     combo: 'del',
      //     description: 'Hotkey: Delete report',
      //     callback: function() {
      //       $scope.deleteReport($scope.currentReport);
      //     }
      //   }
      // );
    }

     /**
    * Resgister hotkeys for report detail view.
    *
    */
    function registerReportSearchHotkeys() {

      hotkeys.bindTo($scope).add(
        {
          combo: 'a',
          description: 'Show all weeks',
          callback: function() {
            $scope.search.week = '';
          }
        }
      )
      .add(
        {
          combo: 't',
          description: 'Reset week and year',
          callback: function() {
            $scope.resetSearchCal();
          }
        }
      )
      .add(
        {
          combo: 'r',
          description: 'Reload reports',
          callback: function() {
            $scope.loadReports();
          }
        }
      )
      .add(
        {
          combo: 'c',
          description: 'Clear search',
          callback: function() {
            $scope.search.name = '';
          }
        }
      )
      .add(
        {
          combo: 'n',
          description: 'New report',
          callback: function(event, hotkey) {
            event.preventDefault();
            angular.element('#report_new_title_field').focus();
          }
        }
      )
      .add(
        {
          combo: 's',
          description: 'Search',
          callback: function(event, hotkey) {
            event.preventDefault();
            angular.element('#report_search_field').focus();
          }
        }
      )
      .add(
        {
          combo: 'esc',
          description: 'Unfocus field',
          allowIn: ['INPUT'],
          callback: function() {
            angular.element('input').blur();
          }
        }
      )
      .add(
        {
          combo: 'down',
          description: 'Select next result',
          callback: function() {
            if($scope.selectedReportSearchRow === null) {
              $scope.selectedReportSearchRow = 0;
            } else if($scope.selectedReportSearchRow === $scope.reports.length-1) {
              return;
            }  else {
              $scope.selectedReportSearchRow = $scope.selectedReportSearchRow + 1;
            }
          }
        }
      )
      .add(
        {
          combo: 'up',
          description: 'Select prev result',
          callback: function() {
            if($scope.selectedReportSearchRow === null) {
              $scope.selectedReportSearchRow = $scope.reports.length-1;
            } else if($scope.selectedReportSearchRow === 0) {
              return;
            } else {
              $scope.selectedReportSearchRow = $scope.selectedReportSearchRow - 1;
            }
          }
        }
      )
      .add(
        {
          combo: 'enter',
          description: 'Show selected report',
          callback: function() {
            if($scope.selectedReportSearchRow >= 0 && $scope.selectedReportSearchRow < $scope.reports.length) {
              $location.path('reports/' + $scope.reports[$scope.selectedReportSearchRow]._id);
            }
          }
        }
      )
      .add(
        {
          combo: 'right',
          description: 'Next page',
          callback: function() {
            $scope.loadReports('next');
          }
        }
      )
      .add(
        {
          combo: 'left',
          description: 'Previous page',
          callback: function() {
            $scope.loadReports('prev');
          }
        }
      );

    }

    //Setup File Upload immediately. Otherwise there will be erors like
    //https://github.com/nervgh/angular-file-upload/issues/183    
    setupFileUpload();

    registerEventHandlers();

    //initially load reports or report entity based on url
    $timeout(function() {
      if ($routeParams.reportId) {
        unregisterWatchForSearch();
        registerReportDetailHotkeys();
        $scope.loadReport($routeParams.reportId);
      } else {
        $scope.loadReports();
        loadProjectNames();
        registerWatchForSearch();
        registerReportSearchHotkeys();
      }
    }, 50);



    /**
     * Handles errors during report update.
     * Especially for error 428 when report has been modified externaly. Lost update problem.
     * @param {Object} response
     *  Server resonse
     */
    function handleUpdateError(response) {
      if (!response) {
        return
      }

      if (response.status == 428) {
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
]);