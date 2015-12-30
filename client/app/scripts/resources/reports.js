'use strict';
//define the Report resource

angular.module('PReports.resources').factory('Report',['genericResource', function(genericResource) {

    var reportResource = genericResource('/reports/:id',
      {
        'id': '@_id'
      },
      {
      	'update': {method: 'PUT'},
      	'query': {method: 'GET', isArray: false}
      }
    );
 
    return reportResource;

}]);

