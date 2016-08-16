'use strict';

angular.module('angularFullstackApp', ['angularFullstackApp.auth', 'angularFullstackApp.admin',
    'angularFullstackApp.constants', 'angularFullstackApp.contactDetails', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io',
    'ui.router', 'ui.bootstrap', 'validation.match', 'Menus', 'ngAnimate', 'formly', 'formlyBootstrap', 'angularUtils.directives.dirPagination'
  ])
  .config(function($urlRouterProvider, $locationProvider, formlyConfigProvider) {
    $urlRouterProvider.otherwise('/theapp');

    $locationProvider.html5Mode(true);

    var attributes = [
      'date-disabled',
      'custom-class',
      'show-weeks',
      'starting-day',
      'init-date',
      'min-mode',
      'max-mode',
      'format-day',
      'format-month',
      'format-year',
      'format-day-header',
      'format-day-title',
      'format-month-title',
      'year-range',
      'shortcut-propagation',
      'datepicker-popup',
      'show-button-bar',
      'current-text',
      'clear-text',
      'close-text',
      'close-on-date-selection',
      'datepicker-append-to-body'
    ];

    var bindings = [
      'datepicker-mode',
      'min-date',
      'max-date'
    ];

    var ngModelAttrs = {};

    function camelize(string) {
      string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
      // Ensure 1st char is always lowercase
      return string.replace(/^([A-Z])/, function(match, chr) {
        return chr ? chr.toLowerCase() : '';
      });
    }


    angular.forEach(attributes, function(attr) {
      ngModelAttrs[camelize(attr)] = {attribute: attr};
    });

    angular.forEach(bindings, function(binding) {
      ngModelAttrs[camelize(binding)] = {bound: binding};
    });


    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapLabel',
      template: [
        '<label for="{{::id}}" class="col-sm-4 control-label">',
        '{{to.label}} {{to.required ? "*" : ""}}',
        '</label>',
        '<div class="col-sm-8">',
        '<formly-transclude></formly-transclude>',
        '</div>',
        '<div class="clearfix"></div>'
      ].join(' ')
    });

    formlyConfigProvider.setType({
      name: 'horizontalInput',
      extends: 'input',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'datepicker',
      templateUrl:  'datepicker.html',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError'],
      defaultOptions: {
        ngModelAttrs: ngModelAttrs,
        templateOptions: {
          datepickerOptions: {
            format: 'yyyy-MM-dd',
            initDate: new Date()
          }
        }
      },
      controller: ['$scope', function ($scope) {
        $scope.datepicker = {};

        $scope.datepicker.opened = false;

        $scope.datepicker.open = function ($event) {
          $scope.datepicker.opened = !$scope.datepicker.opened;
        };
      }]
    });

  })
  .run(['menuService','Auth','$timeout','$rootScope',
    function(menuService) {
      menuService.addMenu('nav', {
        roles: ['user']
      });

      menuService.addMenuItem('nav', {
        title: 'Customers',
        state: 'customers',
        type: 'dropdown',
        roles: ['user'],
        class: 'fa fa-dashboard'
      });

      menuService.addMenuItem('nav', {
        title: 'Transactions',
        state: 'transactions',
        type: 'dropdown',
        roles: ['user'],
        class: 'fa fa-files-o'
      });

      menuService.addMenuItem('nav', {
        title: 'Mail Merge',
        state: 'mail-merge',
        type: 'dropdown',
        roles: ['user'],
        class: 'fa fa-file-code-o'
      });

      menuService.addMenuItem('nav', {
        title: 'Jobs',
        state: 'jobs.all',
        type: 'dropdown',
        roles: ['user'],
        class: 'fa fa-check-square-o'
      });

      menuService.addMenuItem('nav', {
        title: 'Email Jobs',
        state: 'jobs.type({jobType:"email"})',
        type: 'dropdown',
        roles: ['user'],
        class: 'fa fa-envelope-o'
      });

      menuService.addMenuItem('nav', {
        title: 'Start/Stop Jobs',
        state: 'jobs.startStop',
        type: 'dropdown',
        roles: ['user'],
        class: 'fa fa-play'
      });
    }]);
