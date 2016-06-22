(function() {
  'use strict';

  angular.module('admin-lte', ['Menus']);
  angular.module('angularFullstackApp').requires.push('admin-lte');
  angular.module('angularFullstackApp').run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$state = $state;
  }]);
  angular.module('admin-lte')
    .run(function($rootScope, $state, Auth, ThemeStyleService) {
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
	      /**
         * Update user's theme skin once login/signup
         */
        if (fromState.name === 'login' || fromState.name === 'signup') {
          Auth.getCurrentUser(null)
            .then(function(user) {
              ThemeStyleService.changeSkin(user.theme);
            });
        }

	      /**
         * Redirect user to login page after logout
         */
        if (fromState.name === 'logout' && toState.name !== 'login') {
          event.preventDefault();
          $state.go('login');
        }
      });
    });
})();
