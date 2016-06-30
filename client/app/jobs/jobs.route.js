'use strict';

angular.module('angularFullstackApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('jobs', {
        url: '/jobs',
        templateUrl: 'app/jobs/jobs.html',
        controller: 'JobsController',
        controllerAs: 'vm'
      });
  });
