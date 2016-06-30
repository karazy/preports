'use strict';


angular.module('PReports.services').service('reportsService', [
	'$log',
	'errorHandler',
	'$q',
    'Report',
    function($log, errorHandler, $q, Report) {
        
        var _service = {
            'getReports' : getReports
        };
        
        const PAGINATION_LIMIT = 25;
        
        function getReports(searchParams) {
            $log.debug('getReports called with ' + searchParams);
            
            var query = Report.query({
            'year': searchParams.year,
            'week': searchParams.week,
            'name': searchParams.name,
            'page': searchParams.page,
            'limit': PAGINATION_LIMIT,
            'sortProperty' : searchParams.sortProperty,
            'sortDirection' : searchParams.sortDirection
            });
            // function(value) {
            // $log.debug("Callback for Report.query");
           // $scope.reports = $scope.reportsWrapper.reports;
            //page is  based
           // $rootScope.search.page = $scope.reportsWrapper.currentPage - 1;
           // updateAddressBarWithSearchParams($rootScope.search);
            // }, errorHandler);
            
            return query.$promise;
        }
        
        return _service;
    }]);