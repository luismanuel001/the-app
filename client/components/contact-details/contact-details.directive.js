'use strict';

angular.module('angularFullstackApp.contactDetails', [])
  .directive('contactDetails', function () {
    return {
      templateUrl: '/components/contact-details/contact-details.html',
      restrict: 'EA'
    };
  });
