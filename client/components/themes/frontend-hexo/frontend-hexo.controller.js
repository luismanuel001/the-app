'use strict';

(function() {
    'use strict';

    angular
        .module('angularFullstackApp.frontend-hexo')
        .controller('FrontendHexoController', FrontendHexoController);

    FrontendHexoController.$inject = ['$state'];

    /* @ngInject */
    function FrontendHexoController($state) {
        var vm = this;
        vm.message = 'Hello';
        $state.go('frontend-hexo.home');
    }
})();
