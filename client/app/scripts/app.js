'use strict';

/* PReports namespace. Create if not exists.*/
//var PReports = PReports || {};

//define resources module
angular.module('PReports.resources', []);
angular.module('PReports.directives', []);
angular.module('PReports.services', []);

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.epoch-calendar.com */

  dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 1; //default dowOffset to zero
  var newYear = new Date(this.getFullYear(),0,1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = (day >= 0 ? day : day + 7);
  var daynum = Math.floor((this.getTime() - newYear.getTime() - 
  (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
  var weeknum, nYear, nDay;
  //if the year starts before the middle of a week
  if(day < 4) {
    weeknum = Math.floor((daynum+day-1)/7) + 1;
    if(weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1,0,1);
      nDay = nYear.getDay() - dowOffset;
      nDay = nDay >= 0 ? nDay : nDay + 7;
      /*if the next year starts before the middle of
        the week, it is week #1 of that year*/
      weeknum = nDay < 4 ? 1 : 53;
    }
  }
  else {
    weeknum = Math.floor((daynum+day-1)/7);
  }
  return weeknum;
};

angular.module('PReports', [
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
  'ui.bootstrap',
  'ui.sortable',
  'textAngular',
  'cfp.hotkeys'
]).config(['$routeProvider', '$httpProvider', '$provide', '$logProvider', function ($routeProvider, $httpProvider, $provide, $logProvider) {
    $routeProvider
      .when('/reports', {
        templateUrl: 'views/reports.html',
        controller: 'ReportCtrl',
        reloadOnSearch: false
      })
       .when('/reports/:reportId', {
        templateUrl: 'views/reports_detail.html',
        controller: 'ReportCtrl'
      })
       .when('/about', {
        templateUrl: 'views/about.html'
       })
      .otherwise({
        redirectTo: '/reports'
      });

      $httpProvider.defaults.headers.common['Accept'] = 'application/hal+json';
      //true for debug logs
      $logProvider.debugEnabled(false);

      //Configure TextAngular Options
      $provide.decorator('taOptions', ['$delegate', function(taOptions){
        // $delegate is the taOptions we are decorating
        // here we override the default toolbars and classes specified in taOptions.
        taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
        // taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
        taOptions.toolbar = [
            ['h3', 'h4', 'p', 'bold', 'italics', 'underline', 'ul', 'ol']
        ];
        return taOptions; // whatever you return will be the taOptions
      }]); 
  }]).run(['$rootScope', 'config', function($rootScope, config) {
        $rootScope.version = config.version;
}]);

