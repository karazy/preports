'use strict';


angular.module('PReports.services').service('reportsService', [
	'$log',
	'errorHandler',
	'$q',
    'Report',
    '$rootScope',
    function($log, errorHandler, $q, Report, $rootScope) {
        
        var _service = {
            'getReports' : getReports
        };
        
        const PAGINATION_LIMIT = 25;
        
        function setupGlobalSearchParams() {
             //initialize global search parameters if they don't exist on $rootScope
            $rootScope.search = $rootScope.search || {};
            $rootScope.search.year = ($rootScope.search.hasOwnProperty('year')) ? $rootScope.search.year : (new Date()).getFullYear();
            $rootScope.search.week = ($rootScope.search.hasOwnProperty('week')) ? $rootScope.search.week : (new Date()).getWeek();
            $rootScope.search.name = ($rootScope.search.hasOwnProperty('name')) ? $rootScope.search.name : '';
            //$rootScope.search.limit = PAGINATION_LIMIT;
            $rootScope.search.page = ($rootScope.search.hasOwnProperty('page')) ? $rootScope.search.page : 0;
            $rootScope.search.sortProperty = $rootScope.search.sortProperty || 'week';
            $rootScope.search.sortDirection = $rootScope.search.sortDirection || 'desc';
            
            $log.debug("Init rootScope.search with ");
            $log.debug($rootScope.search);
        }        
        
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
        
        setupGlobalSearchParams();
        
        return _service;
    }]);