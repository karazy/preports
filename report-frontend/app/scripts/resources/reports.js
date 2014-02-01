//define the Report resource

angular.module('PReports.resources').factory('Report',['genericResource', function(genericResource) {

    var reportResource = genericResource('http://127.0.0.1:3000/reports/:id',
      {
        'id': '@_id'
      },
      {
      	'update': {method: 'PUT'}
      }
    );
 
    return reportResource;

}]);

