'use strict';

describe('Directive: contactDetails', function () {

  // load the directive's module and view
  beforeEach(module('angularFullstackApp.frontend-hexo'));
  beforeEach(module('components/themes/frontend-hexo/contact-details/contact-details.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<contact-details></contact-details>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).to.equal('this is the contactDetails directive');
  }));
});
