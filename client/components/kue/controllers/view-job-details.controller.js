(function() {
  'use strict';

  angular
    .module('kueJobs')
    .controller('ViewJobDetailsController', ViewJobDetailsController);

  ViewJobDetailsController.$inject = ['$uibModal', 'JobsManager'];

  function ViewJobDetailsController($uibModal, JobsManager) {
    var vm = this;
    var jobId = 100;
    vm.deleteJob = deleteJob;
    vm.requeueJob = requeueJob;
    vm.message = 'Loading job..';
    activate();

    function activate() {
      JobsManager.getJob(jobId).then(function(job) {
        vm.job = job;
      }, function(err) {
        vm.message = err;
      });
    }

    function deleteJob() {
      var modalInstance = $uibModal.open({
        templateUrl: 'components/kue/views/confirmation-modal.view.html',
        controller: 'ConfirmationModalController',
        controllerAs: 'confirmationModalCtrl',
        resolve: {
          confirmationText: function () {
            return 'This will permanently delete the job. Are you sure?'
          }
        }
      });

      modalInstance.result.then(function (accept) {
        if (accept) {
          JobsManager.deleteJob(jobId).then(function(message) {
            vm.job = null;
            vm.message = message;
          });
        }
      });
    }

    function refreshJob() {
      JobsManager.refreshJob(jobId).then(function(job) {
        vm.job = job;
      })
    }

    function requeueJob() {
      var modalInstance = $uibModal.open({
        templateUrl: 'components/kue/views/confirmation-modal.view.html',
        controller: 'ConfirmationModalController',
        controllerAs: 'confirmationModalCtrl',
        resolve: {
          confirmationText: function () {
            return 'This will re-submit the job for execution. Are you sure?'
          }
        }
      });

      modalInstance.result.then(function (accept) {
        if (accept) {
          var jobData = vm.job;
          JobsManager.createJob(jobData).then(function(job) {
            vm.job = job;
          });
        }
      });
    }
  }
})();
