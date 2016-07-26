'use strict';

describe('ReportService', function () {

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
      };

       
        
         spyOn(ReportService,'getReports').and.callThrough();
         
         ReportService.getReports(searchParams)
            .then(function(reportsWrapper) {
            //  $log.debug("success callback getReports");
            expect(reportsWrapper).toBe(null);    
                        
            })
            .catch(function(response) {
                errorHandler(response);
            });
        
        expect(ReportService.getReports).toHaveBeenCalled();
  });


  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
