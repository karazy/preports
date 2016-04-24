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

/**
 * The directives controller.
 */
function CostTypeController($scope, $log, $q, commandService, config) {

	$scope.config = config;
	$scope.calculateCosts = calculateCosts;
	$scope.toggleCostDialog = toggleCostDialog;
  $scope.removeCostType = removeCostType;
  $scope.addCostType = addCostType;
  $scope.calculateCostForPosition = calculateCostForPosition;
	
	
	 //$log.log(costReport);
	
    function calculateCosts() {
		
      if (!$scope.costReport) {
        console.log('copyReport: no costReport');
        return;
      }

      //save prev values
      var updateCommand = {
            prev: {
              costs: angular.copy($scope.costReport.costs),
              costsCurrent: $scope.costReport.costsCurrent,
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

        angular.forEach($scope.temp.costs, function(cost, index) {
          currentCosts += cost.quantity * cost.costsPerUnit;
        });

        //Adjust for display in k€
        currentCosts = currentCosts / 1000;
        
        $scope.costReport.costs = angular.copy($scope.temp.costs);
        $scope.costReport.costsCurrent = Math.round(currentCosts);

        if ($scope.costReport.costsCurrent && $scope.costReport.costsPlanned) {
          $scope.costReport.costsDelta = calcCostsDelta($scope.costReport.costsCurrent, $scope.costReport.costsPlanned);
        } else {
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
        $scope.costReport.costs = updateCommand.prev.costs;
        $scope.costReport.costsCurrent = updateCommand.prev.costsCurrent;
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
      if($scope.costReport.costs)  {
        $scope.temp.costs = angular.copy($scope.costReport.costs);  
      } else {
        $scope.temp.costs = [];
      }      

      if (!$scope.costReport.locked) {
        modal.modal('toggle');
      }
    }
    
    function removeCostType(index) {
      $scope.temp.costs.splice(index, 1);      
    }
    
    function addCostType() {
      var newType = {
            'name' : 'Type',
            'costsPerUnit' : 1,
            'unit' : 'h',
            'quantity': 0
      }
      
      $scope.temp.costs.push(newType);
    }
    
    function calculateCostForPosition(cost) {
      if(!cost) {
        return 0;
      }
      
      if(typeof cost.quantity != 'number' || typeof cost.costsPerUnit != 'number') {
        return 0;
      }
      
      return cost.quantity*cost.costsPerUnit/1000
    }
}