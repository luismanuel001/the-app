(function() {
  'use strict';

  angular
    .module('admin-lte')
    .controller('ThemeController', ThemeController);

  ThemeController.$inject = ['$rootScope', '$state', 'Auth', 'ThemeStyleService'];

  function ThemeController($rootScope, $state, Auth, ThemeStyleService) {
    var vm = this;
    vm.isLoggedIn = false;

    activate();

    function activate() {
      $.AdminLTE.layout.activate();
      ThemeStyleService.toggleMiniSidebar(true);

      Auth.isLoggedIn(function(isLoggedIn) {
        vm.isLoggedIn = isLoggedIn;

        var userTheme = Auth.getCurrentUser().theme;
        ThemeStyleService.changeSkin(userTheme);
      });
    }
  }
})();
