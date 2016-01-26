'use strict';

describe('Controller: Report', function () {


  it('Should create a new report', function() {
    browser.get('http://localhost:9000/#/reports');

    var reportTestTitle = 'Test Report by protractor';

    element(by.model('newReportName')).sendKeys(reportTestTitle);
    element(by.css('[ng-click="createNewReport()"]')).click();
    element(by.tagName('h1')).getText().then(function(text) {
      expect(text).toBe(reportTestTitle);
    });
  });

});
