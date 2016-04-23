'use strict';
/**
 * Modal dialog to edit the different costs for the project based on time units multiplied with quantity.
*/
angular.module('PReports.directives').directive('costTypeDialog', [
    '$locale', 
    'language',
    '$interpolate', 
    '$log',
    function($locale, langService, $interpolate, $log) {

    //directive configuration
		var config = {
          restrict: 'AE',
          transclude: true,
          // priority: 100,
          scope: {
            costReport: '=report',
            onChange: '&',

          },
          controller: CostTypeController,
          controllerAs: 'ctrl',
          bindToController: true,
          templateUrl: 'views/templates/costTypeDialog.html',
          link: linkFunc
          // compile: function(element, attrs, transclude) {
          //   return {
          //         pre: function preLink(scope, iElement, iAttrs, controller) { 
                    
          //         },
          //         post: function postLink(scope, iElement, iAttrs, controller) {
          //                 $log.log(controller.costReport);

          //         }
          //       }
          // }
    };

	function l(key) {
		return langService.translate(key) || key;
	}
  
   function linkFunc(scope, el, attr, ctrl) {
        $log.log(scope);
        scope.costReport = scope.$parent.currentReport;
    }

	return config;
}]);

CostTypeController.$inject = ['$scope', '$log', '$q', 'commandService', 'config'];

function CostTypeController($scope, $log, $q, commandService, config) {

	$scope.config = config;
	$scope.calculateCosts = calculateCosts;
	$scope.toggleCostDialog = toggleCostDialog;
	
	
	 //$log.log(costReport);
	
    function calculateCosts() {
		
      if (!$scope.costReport) {
        console.log('copyReport: no costReport');
        return;
      }

      //save prev values
      var updateCommand = {
            prev: {
              hoursExternal: $scope.costReport.hoursExternal,
              hoursInternal: $scope.costReport.hoursInternal,
              hoursNearshoring: $scope.costReport.hoursNearshoring,
              costsCurrent: $scope.costReport.costsCurrent,
              // costsRest: $scope.costReport.costsRest,
              costsDelta: $scope.costReport.costsDelta
            }
          },          
          defer = $q.defer(),
          deferUndo = $q.defer();

      updateCommand.promise = defer.promise;
      updateCommand.undoPromise = deferUndo.promise;


      updateCommand.execute = function() {
        console.log('calculateCosts: execute');
        var currentCosts = 0;

        if ($scope.temp.costs.hoursExternal) {
          $scope.costReport.hoursExternal = $scope.temp.costs.hoursExternal;
          currentCosts = $scope.config.COST_EXTERNAL * $scope.temp.costs.hoursExternal;
        }

        if ($scope.temp.costs.hoursInternal) {
          $scope.costReport.hoursInternal = $scope.temp.costs.hoursInternal;
          currentCosts += $scope.config.COST_INTERNAL * $scope.temp.costs.hoursInternal;
        }

        if ($scope.temp.costs.hoursNearshoring) {
          $scope.costReport.hoursNearshoring = $scope.temp.costs.hoursNearshoring;
          currentCosts += $scope.config.COST_NEARSHORE * $scope.temp.costs.hoursNearshoring;
        }

        //Adjust for display in k€
        currentCosts = currentCosts / 1000;

        $scope.costReport.costsCurrent = Math.round(currentCosts);

        if ($scope.costReport.costsCurrent && $scope.costReport.costsPlanned) {
          // $scope.costReport.costsRest =   $scope.costReport.costsPlanned - $scope.costReport.costsCurrent;
          $scope.costReport.costsDelta = calcCostsDelta($scope.costReport.costsCurrent, $scope.costReport.costsPlanned);
        } else {
          // $scope.costReport.costsRest = null;
          $scope.costReport.costsDelta = null;
        }

        $scope.costReport.$update().then(function() {
          defer.resolve();
        }).catch(function(response) {
          handleUpdateError(response, defer);
        });

        //remove the temp costs
        delete $scope.temp.costs;
      }

      updateCommand.undo = function() {
        console.log('calculateCosts: undo');
        //restore previous values
        $scope.costReport.hoursExternal = updateCommand.prev.hoursExternal;
        $scope.costReport.hoursInternal = updateCommand.prev.hoursInternal;
        $scope.costReport.hoursNearshoring = updateCommand.prev.hoursNearshoring;
        $scope.costReport.costsCurrent = updateCommand.prev.costsCurrent;
        // $scope.costReport.costsRest =  updateCommand.prev.costsRest;
        $scope.costReport.costsDelta = updateCommand.prev.costsDelta;

        $scope.costReport.$update().then(function() {
          deferUndo.resolve();
        }).catch(function(response) {
          handleUpdateError(response, deferUndo);
        });

        //remove the temp costs
        delete $scope.temp.costs;
      }
	  
	  commandService.storeAndExecuteCmd(updateCommand);
    }
	
	function calcCostsDelta(current, planned) {
      var delta = current / planned;

      //reduce to precision of 2 
      delta = Math.round(delta * 100);

      return delta;

    }
	
	function toggleCostDialog() {
      var modal = angular.element('#costDialog .modal');

      if (!modal) {
        console.log('No cost dialog found.');
      }

      $scope.temp = $scope.temp ? $scope.temp : {};
      //fill dialog with temporary cost values
      //needed to provide undo functionality
      $scope.temp.costs = {
        hoursExternal: $scope.costReport.hoursExternal,
        hoursInternal: $scope.costReport.hoursInternal,
        hoursNearshoring: $scope.costReport.hoursNearshoring
      }

      if (!$scope.costReport.locked) {
        modal.modal('toggle');
      }
    }
}