(function() {
  'use strict';

  angular
    .module('kueJobs')
    .directive('startStopJobs', startStopJobs);

  startStopJobs.$inject = [];

  function startStopJobs() {
    return {
      templateUrl: 'components/kue/views/start-stop-jobs.view.html',
      restrict: 'E',
      controller: 'StartStopJobsController',
      controllerAs: 'startStopJobsCtrl'
    };
  }
})();
