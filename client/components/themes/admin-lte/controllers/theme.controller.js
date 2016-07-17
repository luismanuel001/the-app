(function() {
  'use strict';

  angular
    .module('admin-lte')
    .controller('ThemeController', ThemeController);

  ThemeController.$inject = ['$http', '$state', 'Auth', 'ThemeStyleService'];

  function ThemeController($http, $state, Auth, ThemeStyleService) {
    var vm = this;
    vm.Auth = Auth;

    activate();

    function activate() {
      $.AdminLTE.layout.activate();
      ThemeStyleService.toggleMiniSidebar(true);

      // initialize app
      $http.get('/api/app/init');

      Auth.isLoggedIn(function(isLoggedIn) {
        if (isLoggedIn) {
          var userTheme = Auth.getCurrentUser().theme;
          ThemeStyleService.changeSkin(userTheme);
        }
      });
    }
  }
})();
