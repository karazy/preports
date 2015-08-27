'use strict';

angular.module('PReports.directives')
  .directive('logout', function ($http, $location) {
    return {
      templateUrl: 'scripts/directives/logout/logout.html',
      restrict: 'EA',
      link: function (scope) {
      }
    };
  });