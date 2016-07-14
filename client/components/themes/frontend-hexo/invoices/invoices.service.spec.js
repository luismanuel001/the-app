'use strict';

describe('Service: invoicesService', function () {

  // load the service's module
  beforeEach(module('angularFullstackApp.frontend-hexo'));

  // instantiate service
  var invoicesService;
  beforeEach(inject(function (_invoicesService_) {
    invoicesService = _invoicesService_;
  }));

  it('should do something', function () {
    expect(!!invoicesService).to.be.true;
  });

});
