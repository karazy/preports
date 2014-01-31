//define the Report resource



angular.module('PReports.resources').factory('Report',['$resource', function($resource) {

    var reportResource = $resource('http://127.0.0.1:3000/reports/:id',
      {
        'id': '@id'
      },
      {
      	'update': {method: 'PUT'}
      }
    );
 
    return reportResource;

}]);

