'use strict';

describe('Service: Helper', function () {

  // load the controller's module
  beforeEach(function() {
      module('PReports');
  });    

  var Helper,      
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _helper_) {
    scope = $rootScope.$new();

    Helper = _helper_; 

  }));


    it('should calculate the years range correctly', function() {
        var baseYear = 2014,
            currentYear = (new Date()).getFullYear(),
            expectedLength,
            years;
        
        //+2 because we always add the next year and the baseYear is included as well
        expectedLength = currentYear - baseYear + 2;
        years = Helper.getYearsFromToday(baseYear);

        expect(years.length).toBe(expectedLength);
        expect(years[1]).toBe(2015);

    });

    it('should return currentYear + 1 when baseYear is not a number', function() {
          var baseYear = "abc",
            currentYear = (new Date()).getFullYear(),
            expectedLength = 2,
            years;
        
        years = Helper.getYearsFromToday(baseYear);

        expect(years.length).toBe(2);
        expect(years[0]).toBe(currentYear);
    });

});
