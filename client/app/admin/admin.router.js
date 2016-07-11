'use strict';

angular.module('angularFullstackApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        template: '<admin-lte></admin-lte>',
        // abstract: true
      });
  });
//
// angular.module('angularFullstackApp.admin')
//   .config(function($stateProvider) {
//     $stateProvider
//       .state('admin.users', {
//         url: '/users',
//         templateUrl: 'app/admin/admin.html',
//         controller: 'AdminController',
//         controllerAs: 'admin',
//         authenticate: 'admin'
//       });
//   });
