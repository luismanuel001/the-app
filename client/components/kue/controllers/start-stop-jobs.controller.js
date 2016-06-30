(function() {
  'use strict';

  angular
    .module('kueJobs')
    .controller('StartStopJobsController', StartStopJobsController);

  StartStopJobsController.$inject = ['$uibModal', 'JobsManager'];

  function StartStopJobsController($uibModal, JobsManager) {
    var vm = this;
    vm.jobProcessingStatus = true;
    vm.toggleJobProcessingStatus = toggleJobProcessingStatus;

    activate();

    function activate() {

    }

    function toggleJobProcessingStatus() {
      // vm.jobProcessingStatus = !vm.jobProcessingStatus;
      var dialogInstance = $uibModal.open({
        templateUrl: 'components/kue/views/job-confirmation-dialog.view.html',
        controller: 'JobConfirmationDialogController',
        controllerAs: 'jobConfirmationDialogCtrl',
        resolve: {
          confirmationText: function () {
            return 'This will stop all the jobs. Are you sure?';
          }
        }
      });

      dialogInstance.result.then(function (accept) {
        if (accept) {
          JobsManager.stopAllJobs().then(function() {
            vm.jobProcessingStatus = false;
          }, function() {
            vm.jobProcessingStatus = false;
          });
        }
      });
    }
  }
})();
