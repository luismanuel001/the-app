'use strict';

describe('Component: FrontendHexoComponent', function () {

  // load the controller's module
  beforeEach(module('angularFullstackApp.frontend-hexo'));

  var FrontendHexoComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    FrontendHexoComponent = $componentController('frontend-hexo', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
