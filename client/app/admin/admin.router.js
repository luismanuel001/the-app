'use strict';

angular.module('angularFullstackApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        template: '<admin-lte></admin-lte>',
      });
  });
