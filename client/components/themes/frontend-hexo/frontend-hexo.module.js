'use strict';

angular.module('angularFullstackApp.frontend-hexo', ['ui.router']);
angular.module('angularFullstackApp').requires.push('angularFullstackApp.frontend-hexo');
angular.module('angularFullstackApp.frontend-hexo')
  .component('frontendHexo', {
    template: '<ui-view></ui-view>',
    controller: 'FrontendHexoController',
    controllerAs: 'FrontendHexo'
  });
angular.module('angularFullstackApp')
  .run(function ($rootScope) {
    $rootScope.$on('$stateChangeStart.frontend-hexo', function(event, toState, toParams, fromState, fromParams){
      if (fromState.name === 'frontend-hexo' && toState.name !== 'frontend-hexo.home'){
        event.preventDefault();
        $state.go('frontend-hexo.home');
      }
    });
  });
