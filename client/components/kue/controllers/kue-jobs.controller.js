(function() {
  'use strict';

  angular
    .module('kueJobs')
    .controller('KueJobsController', KueJobsController);

  KueJobsController.$inject = [];

  function KueJobsController() {
    var vm = this;
    vm.selectedJobIds = [];
    vm.ontoggle = ontoggle;

    activate();

    function activate() {

    }

    function ontoggle(selectedJobIds) {
      vm.selectedJobIds = selectedJobIds;
    }
  }
})();
