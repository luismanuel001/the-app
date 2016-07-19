'use strict';

angular.module('angularFullstackApp.admin')
  .config(function($stateProvider) {
    $stateProvider.state('admin', {
      url: '/theapp/admin',
      templateUrl: 'app/admin/admin.html',
      controller: 'AdminController',
      controllerAs: 'admin',
      // authenticate: 'admin'
    });
  });
