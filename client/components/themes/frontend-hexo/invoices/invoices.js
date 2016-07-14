'use strict';

angular.module('angularFullstackApp.frontend-hexo')
  .config(function ($stateProvider) {
    $stateProvider
      .state('frontend-hexo.invoices', {
        url: 'invoices',
        template: '<invoices></invoices>'
      })
      .state('frontend-hexo.invoices.details', {
        url: '/:id',
        templateUrl: 'components/themes/frontend-hexo/invoices/invoices.html',
        resolve: {
          invoice: function (invoicesService, $stateParams) {
            return invoicesService.get($stateParams.id);
          }
        },
        controller: function($scope, invoice) {
          $scope.invoice = invoice;
        }
      });
  });
