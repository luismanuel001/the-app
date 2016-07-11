'use strict';

angular.module('angularFullstackApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.jobs', {
        url: '/jobs',
        template: '<div ui-view></div>',
        abstract: true
      })
      .state('admin.jobs.all', {
        url: '/',
        templateUrl: 'app/admin/jobs/jobs.html',
        controller: 'JobsController',
        controllerAs: 'vm',
      })
      .state('admin.jobs.startStop', {
        url: '/startstop',
        template: '<start-stop-jobs></start-stop-jobs>'
      })
      .state('admin.jobs.type', {
        url: '/:jobType',
        templateUrl: 'app/admin/jobs/jobs.html',
        controller: 'JobsController',
        controllerAs: 'vm'
      });
  });
