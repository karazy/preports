'use strict';

angular.module('PReports.directives')
  .directive('logout', function ($http, $location) {
    return {
      templateUrl: 'views/templates/logout.html',
      restrict: 'EA',
      link: function (scope) {
      }
    };
  });