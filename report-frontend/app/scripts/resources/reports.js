//define the Report resource



angular.module('PReports.resources').factory('Report',['$resource', function($resource) {

    var reportResource = $resource('http://localhost:3000/reports/:id',
      {
        'id': '@id'
      }
    );
 
    return reportResource;

}]);

