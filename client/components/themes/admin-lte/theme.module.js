(function() {
  'use strict';

  angular.module('admin-lte', ['Menus']);
  angular.module('angularFullstackApp').requires.push('admin-lte');
  angular.module('angularFullstackApp').run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$state = $state;
  }]);
  angular.module('admin-lte')
    .run(function($rootScope, $state, Auth) {
      $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
        if (next.name !== 'login' && next.name !== 'signup' && !Auth.isLoggedIn()) {
          event.preventDefault();
          $state.go('login');
        }

        if ((next.name === 'login' || next.name === 'signup') && Auth.isLoggedIn()) {
          event.preventDefault();
          next.referrer = current.name;
        }
      });
    });
})();
