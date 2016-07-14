'use strict';

describe('Component: invoices', function () {

  // load the component's module
  beforeEach(module('angularFullstackApp.frontend-hexo'));

  var invoicesComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function ($componentController) {
    invoicesComponent = $componentController('invoices', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
