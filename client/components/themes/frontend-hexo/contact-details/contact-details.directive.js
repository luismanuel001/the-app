'use strict';

angular.module('angularFullstackApp.frontend-hexo')
  .directive('contactDetails', function () {
    return {
      templateUrl: 'components/themes/frontend-hexo/contact-details/contact-details.html',
      restrict: 'EA'
    };
  });
