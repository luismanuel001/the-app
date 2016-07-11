'use strict';

angular.module('angularFullstackApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.login', {
        url: '/login',
        templateUrl: 'app/admin/account/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('admin.logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        controller: function($state, Auth) {
          var referrer = $state.params.referrer || $state.current.referrer || 'main';
          Auth.logout();
          $state.go(referrer);
        }
      })
      .state('admin.signup', {
        url: '/signup',
        templateUrl: 'app/admin/account/signup/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm'
      })
      .state('admin.settings', {
        url: '/settings',
        templateUrl: 'app/admin/account/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('admin.customers', {
        url: '/customers',
        templateUrl: 'app/admin/account/customers/customers.html',
        controller: 'SignupController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('admin.transactions', {
        url: '/transactions',
        templateUrl: 'app/admin/account/transactions/transactions.html',
        controller: 'SignupController',
        controllerAs: 'vm',
        authenticate: true
      });
  })
  .run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'admin.logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  });
