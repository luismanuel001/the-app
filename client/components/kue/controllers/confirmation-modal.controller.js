(function() {
  'use strict';

  angular
    .module('kueJobs')
    .controller('ConfirmationModalController', ConfirmationModalController);

  ConfirmationModalController.$inject = ['$uibModalInstance', 'confirmationText'];

  function ConfirmationModalController($uibModalInstance, confirmationText) {
    var vm = this;
    vm.confirmationText = confirmationText;
    vm.ok = ok;
    vm.cancel = cancel;

    activate();

    function activate() {

    }

    function ok() {
      $uibModalInstance.close(true);
    };

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
