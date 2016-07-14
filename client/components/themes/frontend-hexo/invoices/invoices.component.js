'use strict';

function invoicesController() {
  // $log.debug(this.invoice);
}

angular.module('angularFullstackApp.frontend-hexo')
  .component('invoices', {
    templateUrl: 'components/themes/frontend-hexo/generated/invoices.html',
    bindings: {
      // invoice: '<'
    },
    controller: invoicesController
});
