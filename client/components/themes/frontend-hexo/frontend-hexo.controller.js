'use strict';

(function() {

    angular
        .module('angularFullstackApp.frontend-hexo')
        .controller('FrontendHexoController', FrontendHexoController);

    FrontendHexoController.$inject = [];

    /* @ngInject */
    function FrontendHexoController() {
        var vm = this;
        vm.message = 'Hello';
    }
})();
