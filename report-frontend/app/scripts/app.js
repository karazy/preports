'use strict';

/* PReports namespace. Create if not exists.*/
var PReports = PReports || {};

//define resources module
angular.module('PReports.resources', []);
angular.module('PReports.directives', []);
angular.module('PReports.services', []);

PReports = angular.module('PReports', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'PReports.resources',
  'PReports.directives',
  'PReports.services',
  'PReports.translations',
  'PReports.filters',
  'angularFileUpload',
  'ui.bootstrap'
]).config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/reports', {
        templateUrl: 'views/reports.html',
        controller: 'PReports.ReportCtrl'
      })
       .when('/reports/:reportId', {
        templateUrl: 'views/reports_detail.html',
        controller: 'PReports.ReportCtrl'
      })
       .when('/about', {
        templateUrl: 'views/about.html'
       })
      .otherwise({
        redirectTo: '/reports'
      });

      $httpProvider.defaults.headers.common['Accept'] = 'application/json, application/hal+json';
  }]).run(['$rootScope', 'config', function($rootScope, config) {
        $rootScope.version = config.version;
}]);

