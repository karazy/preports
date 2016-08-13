'use strict';

describe('Service: ReportService', function () {

  // load the controller's module
  beforeEach(function() {
      module('PReports');
  });    

  var ReportCtrl,
      ReportService,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _reportsService_) {
    scope = $rootScope.$new();
    ReportCtrl = $controller('ReportCtrl', {
      $scope: scope
    });

    ReportService = _reportsService_; 
    // $controller('reportsService', {
    //   $scope: scope
    // });
  }));
  
     it('should contain service',
        inject(function(_reportsService_) {
            expect(_reportsService_).not.toBe(null);
    }));

    it('should load a list of reports', function() {
            var searchParams = {
                'week' : 30,
                'year' : 2016
            }, 
            promise;
                               
            spyOn(ReportService,'getReports').and.callThrough();
            
            promise = ReportService.getReports(searchParams);
            
            expect(ReportService.getReports).toHaveBeenCalled();
            expect(promise).not.toBe(null);
    });

});
