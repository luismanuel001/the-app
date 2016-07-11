(function() {
  'use strict';

  angular.module('admin-lte', ['Menus']);
  angular.module('angularFullstackApp').requires.push('admin-lte');
  angular.module('angularFullstackApp').run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$state = $state;
  }]);
  angular.module('admin-lte')
    .run(function($rootScope, $state, $log, Auth, ThemeStyleService) {
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
	      /**
         * Update user's theme skin once login/signup
         */
        if (fromState.name === 'admin.login' || fromState.name === 'admin.signup') {
          Auth.getCurrentUser(null)
            .then(function(user) {
              $log.debug(user.theme);
              ThemeStyleService.changeSkin(user.theme);
            });
        }

	      /**
         * Redirect user to login page after logout
         */
        if (fromState.name === 'admin.logout' && toState.name !== 'admin.login') {
          event.preventDefault();
          $state.go('admin.login');
        }
      });
    });
})();
