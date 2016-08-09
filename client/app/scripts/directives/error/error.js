'use strict';

angular.module('PReports.directives')
  .directive('error', function ($http, $location) {
    return {
      templateUrl: 'views/templates/error.html',
      restrict: 'EA',
      link: function (scope) {
      }
    };
  });