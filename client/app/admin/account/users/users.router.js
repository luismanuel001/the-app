'use strict';

angular.module('angularFullstackApp.users')
.config(function($stateProvider) {
  $stateProvider
    .state('admin.users', {
      url: '/users',
      templateUrl: 'app/admin/account/users/users.html',
      controller: 'UsersController',
      controllerAs: 'user',
      authenticate: true
    });
});
