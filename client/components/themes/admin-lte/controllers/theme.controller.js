(function() {
  'use strict';

  angular
    .module('admin-lte')
    .controller('ThemeController', ThemeController);

  ThemeController.$inject = ['$rootScope', '$state', 'Auth', 'ThemeStyleService'];

  function ThemeController($rootScope, $state, Auth, ThemeStyleService) {
    var vm = this;
    vm.Auth = Auth;

    activate();

    function activate() {
      $.AdminLTE.layout.activate();
      ThemeStyleService.toggleMiniSidebar(true);

      Auth.isLoggedIn(function(isLoggedIn) {
        if (isLoggedIn) {
          var userTheme = Auth.getCurrentUser().theme;
          ThemeStyleService.changeSkin(userTheme);
        } else {
          $state.go('login'); // redirect to login page if user is not logged in
        }
      });
    }
  }
})();
