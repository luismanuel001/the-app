(function() {
  'use strict';

  angular
    .module('kueJobs')
    .controller('JobConfirmationDialogController', JobConfirmationDialogController);

  JobConfirmationDialogController.$inject = ['$uibModalInstance', 'confirmationText'];

  function JobConfirmationDialogController($uibModalInstance, confirmationText) {
    var vm = this;
    vm.confirmationText = confirmationText;
    vm.ok = ok;
    vm.cancel = cancel;

    activate();

    function activate() {

    }

    function ok() {
      $uibModalInstance.close(true);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
