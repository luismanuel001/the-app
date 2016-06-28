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
      var modalInstance = $uibModal.open({
        templateUrl: 'components/kue/views/confirmation-modal.view.html',
        controller: 'ConfirmationModalController',
        controllerAs: 'confirmationModalCtrl',
        resolve: {
          confirmationText: function () {
            return 'This will stop all the jobs. Are you sure?'
          }
        }
      });

      modalInstance.result.then(function (accept) {
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
