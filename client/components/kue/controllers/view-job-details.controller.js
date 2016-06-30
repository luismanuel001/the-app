(function() {
  'use strict';

  angular
    .module('kueJobs')
    .controller('ViewJobDetailsController', ViewJobDetailsController);

  ViewJobDetailsController.$inject = ['$scope', '$uibModal', 'JobsManager'];

  function ViewJobDetailsController($scope, $uibModal, JobsManager) {
    var scope = $scope;
    var vm = this;
    vm.message = 'Loading job...';
    vm.deleteJob = deleteJob;
    vm.onclose = onclose;
    vm.requeueJob = requeueJob;

	  /**
     * Job id watcher
     */
    var jobIdWatcher = scope.$watch('jobId', function(newValue) {
      if (newValue) {
        JobsManager.getJob(newValue).then(function(job) {
          vm.job = job;
        }, function(err) {
          vm.message = err;
        });
      } else {
        vm.message = 'Job ID is required';
      }
    });

    /**
     * On destroy handling
     */
    scope.$on('$destroy', function() {
      if (jobIdWatcher) {
        jobIdWatcher();
      }
    });

    /**
     * Delete current job
     */
    function deleteJob() {
      var dialogInstance = $uibModal.open({
        templateUrl: 'components/kue/views/job-confirmation-dialog.view.html',
        controller: 'JobConfirmationDialogController',
        controllerAs: 'jobConfirmationDialogCtrl',
        resolve: {
          confirmationText: function() {
            return 'This will permanently delete the job. Are you sure?';
          }
        }
      });

      dialogInstance.result.then(function(accept) {
        if (accept) {
          JobsManager.deleteJob(scope.jobId).then(function(message) {
            vm.job = null;
            vm.message = message;
          });
        }
      });
    }

	  /**
     * On close click
     */
    function onclose() {
      if (angular.isFunction(scope.onclose)) {
        scope.onclose({
          jobId: scope.jobId
        });
      }
    }

    /**
     * Refresh current job
     */
    // function refreshJob() {
    //   JobsManager.refreshJob(scope.jobId).then(function(job) {
    //     vm.job = job;
    //   });
    // }

	  /**
     * Requeue job i.e. create new job instance based on current job
     */
    function requeueJob() {
      var dialogInstance = $uibModal.open({
        templateUrl: 'components/kue/views/job-confirmation-dialog.view.html',
        controller: 'JobConfirmationDialogController',
        controllerAs: 'jobConfirmationDialogCtrl',
        resolve: {
          confirmationText: function() {
            return 'This will re-submit the job for execution. Are you sure?';
          }
        }
      });

      dialogInstance.result.then(function(accept) {
        if (accept) {
          var jobData = vm.job;
          JobsManager.createJob(jobData).then(function(job) {
            scope.jobId = job.id;
            vm.job = job;
          });
        }
      });
    }
  }
})();
