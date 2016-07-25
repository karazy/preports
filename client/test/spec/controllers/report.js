'use strict';

describe('ReportService', function () {

  // load the controller's module
  beforeEach(module('PReports'));

  var ReportCtrl,
      ReportService,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    // ReportCtrl = $controller('ReportCtrl', {
    //   $scope: scope
    // });

    ReportService = $controller('reportsService', {
      $scope: scope
    });
  }));

  it('should load a list of reports', function() {
      var searchParams = {
        'week' : 30,
        'year' : 2016
      };

        ReportService.getReports(searchParams)
        .then(function(reportsWrapper) {
          //  $log.debug("success callback getReports");
          expect(reportsWrapper).not.toBe(null);           
                    
        })
        .catch(function(response) {
            errorHandler(response);
        });
  });


  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
