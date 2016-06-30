(function() {
  'use strict';

  angular
    .module('kueJobs')
    .directive('kueJobs', kueJobs);

  kueJobs.$inject = [];

  function kueJobs() {
    return {
      templateUrl: 'components/kue/views/kue-jobs.view.html',
      restrict: 'E',
      controller: 'KueJobsController',
      controllerAs: 'kueJobsCtrl'
    };
  }
})();
