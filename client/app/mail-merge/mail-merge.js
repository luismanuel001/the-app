'use strict';

angular.module('angularFullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mail-merge', {
        url: '/theapp/mail-merge',
        templateUrl: 'app/mail-merge/mail-merge.html',
        controller: ['$scope', 'mergeService', '$log', function ($scope, mergeService, $log) {
          $scope.csvForm = {
            csvPath: 'invoices.csv'
          };
          $scope.csvSubmitted = false;
          $scope.csvSuccess = false;

          $scope.mailMergeCSV = () => {
            $scope.csvSubmitted = true;
            mergeService.createFromCSV($scope.csvForm)
              .then(res => {
                $scope.csvSuccess = true;
                $scope.csvMessage = res.data;
              })
              .catch(err => {
                $scope.csvSuccess = false;
                $scope.csvMessage = err;
              });
          };
        }]
      });
  });
