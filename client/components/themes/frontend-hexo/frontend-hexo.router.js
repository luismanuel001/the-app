'use strict';

angular.module('angularFullstackApp.frontend-hexo')
  .config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
      .state('frontend-hexo', {
        url: '/',
        abstract: true,
        template: '<frontend-hexo></frontend-hexo>'
      })
      .state('frontend-hexo.home', {
        url: '',
        templateUrl: 'components/themes/frontend-hexo/generated/home.html'
      })
      .state('frontend-hexo.about', {
        url: 'about',
        templateUrl: 'components/themes/frontend-hexo/generated/about.html'
      })
      .state('frontend-hexo.contact', {
        url: 'contact',
        templateUrl: 'components/themes/frontend-hexo/generated/contact.html'
      });
  });
