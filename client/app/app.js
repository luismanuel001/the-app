'use strict';

angular.module('angularFullstackApp', ['angularFullstackApp.auth', 'angularFullstackApp.users',
    'angularFullstackApp.constants', 'angularFullstackApp.frontend-hexo', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io',
    'ui.router', 'ui.bootstrap', 'validation.match', 'Menus'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  })
  .run(['menuService','Auth','$timeout','$rootScope',
    function(menuService) {
      menuService.addMenu('nav', {
        roles: ['user']
      });

      menuService.addMenuItem('nav', {
        title: 'Customers',
        state: 'admin.customers',
        type: 'dropdown',
        roles: ['user'],
        class: 'fa fa-dashboard'
      });

      menuService.addMenuItem('nav', {
        title: 'Transactions',
        state: 'admin.transactions',
        type: 'dropdown',
        roles: ['user'],
        class: 'fa fa-files-o'
      });

      menuService.addMenuItem('nav', {
        title: 'Jobs',
        state: 'admin.jobs.all',
        type: 'dropdown',
        roles: ['user'],
        class: 'fa fa-check-square-o'
      });

      menuService.addMenuItem('nav', {
        title: 'Email Jobs',
        state: 'admin.jobs.type({jobType:"email"})',
        type: 'dropdown',
        roles: ['user'],
        class: 'fa fa-envelope-o'
      });

      menuService.addMenuItem('nav', {
        title: 'Start/Stop Jobs',
        state: 'admin.jobs.startStop',
        type: 'dropdown',
        roles: ['user'],
        class: 'fa fa-play'
      });

    }]);
