'use strict';

angular.module('angularFullstackApp.frontend-hexo', ['ui.router']);
angular.module('angularFullstackApp.frontend-hexo')
  .component('frontendHexo', {
    template: '<ui-view></ui-view>',
    controller: 'FrontendHexoController',
    controllerAs: 'FrontendHexo'
  });
