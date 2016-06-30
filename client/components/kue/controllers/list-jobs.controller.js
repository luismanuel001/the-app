(function() {
  'use strict';

  angular
    .module('kueJobs')
    .controller('ListJobsController', ListJobsController);

  ListJobsController.$inject = ['$scope', '$q', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'JobsManager'];

  function ListJobsController($scope, $q, $compile, DTOptionsBuilder, DTColumnBuilder, JobsManager) {
    var scope = $scope;
    var vm = this;
    vm.dtInstance = {};
    vm.datePicker = {
      date: { startDate: null, endDate: null }
    };
    vm.selectedJobs = {};
    vm.selectAll = false;
    vm.selectedJobType = {
      label: 'Show All Job Types'
    };
    vm.selectedState = {
      label: 'Show All States'
    };
    vm.deleteSelectedJobs = deleteSelectedJobs;
    vm.refreshJobs = refreshJobs;
    vm.toggleAll = toggleAll;
    vm.toggleOne = toggleOne;
    vm.toggleState = toggleState;
    vm.toggleType = toggleType;

    var pageLength = $scope.pageLength || 10;
    var titleHtml = '<input type="checkbox" ng-model="listJobsCtrl.selectAll" ng-click="listJobsCtrl.toggleAll()">';

    /***
     * Sample data
     {
        "id": 1,
        "type": "email",
        "data": {
          "title": "welcome email for tj",
          "to": "tj@learnboost.com",
          "template": "welcome-email"
        },
        "priority": 0,
        "progress": 0,
        "state": "inactive",
        "created_at": "1467087820563",
        "promote_at": "1467087820563",
        "updated_at": "1467087820792",
        "attempts": {
          "made": 0,
          "remaining": 1,
          "max": 1
        },
        "duration": ???
        "state": ???
      },
     */


    activate();

    function activate() {
      vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', function(data, callback) {
          // if (data.order) {
          //   data.order.forEach(function(order) {
          //
          //   });
          // }

          vm.selectAll = false; // reset select all
          vm.selectedJobs = {}; // reset selected items

          var search = data.search ? data.search.value : null;

          if (search) {
            JobsManager.searchJobs(search).then(function(jobs) {
              callback(jobs);
            });
          } else {
            /**
             *  columns
             draw
             length: 50
             order: Array[1]
             page: 1, 2, 3
             search: Object
             start: 0

             0..49, 50..99
             */
            var from = data.start;
            var to = (from + data.length) - 1;
            var params = {
              from: from,
              to: to
            };
            if ($scope.jobType) {
              params.type = $scope.jobType;
            }
            if (vm.selectedJobType && vm.selectedJobType.value) {
              params.type = vm.selectedJobType.value;
            }
            if (vm.selectedState && vm.selectedState.value) {
              params.state = vm.selectedState.value;
            }
            JobsManager.loadJobs(params).then(function(jobs) {
              callback(jobs);
            });
          }
        })
        // .withDataProp('data')
        .withOption('language', {
          // info: 'Showing _START_ to _END_ entries',
          info: '',
          infoFiltered: ''
        })
        .withOption('responsive', true)
        .withOption('pageLength', pageLength)
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('createdRow', function(row) {
          // Recompiling so we can bind Angular directive to the DT
          $compile(angular.element(row).contents())($scope);
        })
        .withOption('headerCallback', function(header) {
          if (!vm.headerCompiled) {
            // Use this headerCompiled field to only compile header once
            vm.headerCompiled = true;
            $compile(angular.element(header).contents())($scope);
          }
        })
        .withPaginationType('full_numbers')
        .withDOM('tprl');

      vm.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle(titleHtml)
          .renderWith(function(data, type, full) {
            vm.selectedJobs[full.id] = false;
            return '<input type="checkbox" ng-model="listJobsCtrl.selectedJobs[' + data.id + ']" ng-click="listJobsCtrl.toggleOne()">';
          }).notSortable(),
        DTColumnBuilder.newColumn('state').withTitle('State')
          .renderWith(function(data, type, full) {
            /* jshint camelcase: false */
            var stateLabelClass = full.state_label_class;
            return '<label class="label ' + stateLabelClass + '">' + data + '</label>';
          }).notSortable(),
        DTColumnBuilder.newColumn('type').withTitle('Type').notSortable(),
        DTColumnBuilder.newColumn('started').withTitle('Started').notSortable(),
        DTColumnBuilder.newColumn('finished').withTitle('Finished').notSortable(),
        DTColumnBuilder.newColumn('duration').withTitle('Duration').notSortable(),
        DTColumnBuilder.newColumn('attempts').withTitle('Attempts').renderWith(function(data) {
          return data.made + ' (' + data.remaining + ')';
        }).notSortable()
      ];

      JobsManager.getStats().then(function(stats) {
        vm.jobStats = stats;
      });
      JobsManager.getTypes().then(function(types) {
        vm.jobTypes = types;
      });
    }

    function deleteSelectedJobs() {
      var promises = {};
      for (var jobId in vm.selectedJobs) {
        if (vm.selectedJobs.hasOwnProperty(jobId) && vm.selectedJobs[jobId] === true) {
          promises[jobId] = JobsManager.deleteJob(jobId);
        }
      }

      $q.all(promises).then(function() {
        vm.refreshJobs();
      });
    }

    function refreshJobs() {
      var resetPaging = false;
      vm.dtInstance.reloadData(null, resetPaging);
    }

    function toggleAll() {
      for (var id in vm.selectedJobs) {
        if (vm.selectedJobs.hasOwnProperty(id)) {
          vm.selectedJobs[id] = vm.selectAll;
        }
      }

      if (angular.isFunction(scope.ontoggle)) {
        scope.ontoggle({
          selectedJobs: vm.selectAll ? Object.keys(vm.selectedJobs).reverse() : [] // biggest id comes first
        });
      }
    }

    function toggleOne() {
      var selectAll = true;
      for (var id in vm.selectedJobs) {
        if (vm.selectedJobs.hasOwnProperty(id)) {
          if (!vm.selectedJobs[id]) {
            selectAll = false;
            break;
          }
        }
      }
      vm.selectAll = selectAll;

      if (angular.isFunction(scope.ontoggle)) {
        var selectedJobIds = [];
        for (var jobId in vm.selectedJobs) {
          if (vm.selectedJobs.hasOwnProperty(jobId) && vm.selectedJobs[jobId]) {
            selectedJobIds.push(jobId);
          }
        }

        scope.ontoggle({
          selectedJobs: selectedJobIds.reverse() // biggest id comes first
        });
      }
    }

    function toggleState(state) {
      vm.selectedState = {
        label: state,
        value: state
      };
      vm.refreshJobs();
    }

    function toggleType(jobType) {
      vm.selectedJobType = {
        label: jobType,
        value: jobType
      };

      JobsManager.getStats().then(function(stats) {
        vm.jobStats = stats;
      });

      vm.refreshJobs();
    }
  }
})();
