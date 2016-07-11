(function() {
  'use strict';

  angular
    .module('admin-lte')
    .controller('ThemeController', ThemeController);

  ThemeController.$inject = ['$http', '$state', '$timeout', 'Auth', 'ThemeStyleService'];

  function ThemeController($http, $state, $timeout, Auth, ThemeStyleService) {
    var vm = this;
    vm.Auth = Auth;

    // TODO: Fix this. Added the wrapping $timeout as a quick temporary fix while a real solution is found
    $timeout(function () {
      activate();
    });

    function activate() {
      $.AdminLTE.layout.activate();
      ThemeStyleService.toggleMiniSidebar(true);

      // initialize app
      $http.get('/api/app/init');

      Auth.isLoggedIn(function(isLoggedIn) {
        if (isLoggedIn) {
          var userTheme = Auth.getCurrentUser().theme;
          ThemeStyleService.changeSkin(userTheme);
        } else {
          $state.go('admin.login'); // redirect to login page if user is not logged in
        }
      });
    }
  }
})();
