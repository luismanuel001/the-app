'use strict';

angular.module('angularFullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mail-merge', {
        url: '/theapp/mail-merge',
        templateUrl: 'app/mail-merge/mail-merge.html'
      });
  });
