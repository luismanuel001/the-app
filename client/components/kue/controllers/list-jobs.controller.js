(function() {
  'use strict';

  angular
    .module('kueJobs')
    .controller('ListJobsController', ListJobsController);

  ListJobsController.$inject = ['$scope', '$q', '$interval', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'JobsManager', 'Job'];

  function ListJobsController($scope, $q, $interval, $compile, DTOptionsBuilder, DTColumnBuilder, JobsManager, Job) {
    var scope = $scope;
    var refreshDataInterval = null;
    var vm = this;
    vm.dtInstance = {};
    vm.selectedJobs = {};
    vm.selectAll = false;
    vm.selectedJobType = {
      label: 'Show all types'
    };
    vm.selectedState = {
      label: 'Show all states'
    };
    vm.deleteSelectedJobs = deleteSelectedJobs;
    vm.refreshJobs = refreshJobs;
    vm.toggleAll = toggleAll;
    vm.toggleOne = toggleOne;
    vm.toggleState = toggleState;
    vm.toggleType = toggleType;

    var perPage = scope.perPage || 10;
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
      if (!scope.autoRefreshInterval) {
        scope.autoRefreshInterval = 60000;
      }

      if (scope.jobType) {
        var jobType = scope.jobType;
        vm.selectedJobType = {
          label: jobType,
          value: jobType
        };

        vm.selectedState = {
          label: 'inactive',
          value: 'inactive'
        };
      }
      vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', function(data, callback) {
          // if (data.order) {
          //   data.order.forEach(function(order) {
          //
          //   });
          // }

          if (refreshDataInterval) {
            $interval.cancel(refreshDataInterval);
          }

          vm.selectAll = false; // reset select all
          vm.selectedJobs = {}; // reset selected items

          var search = data.search ? data.search.value : null;

          var promises = {};
          if (search) {
            promises.data = JobsManager.searchJobs(search);
            promises.recordsTotal = JobsManager.getStats().then(function(stats) {
              var recordsTotal = 0;
              for (var state in stats) {
                var count = stats[state];
                recordsTotal += count;
              }
              return recordsTotal;
            });

            $q.all(promises).then(function(results) {
              var filterJobs = results.data.slice(data.start, data.length + data.start);
              var jobsData = {
                recordsTotal: results.recordsTotal,
                recordsFiltered: results.data.length,
                data: filterJobs
              };
              callback(jobsData);
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
            if (vm.selectedState && vm.selectedState.value) {
              params.state = vm.selectedState.value;
            }
            if (vm.selectedJobType && vm.selectedJobType.value) {
              params.type = vm.selectedJobType.value;
            }
            promises.data = JobsManager.loadJobs(params);
            promises.stats = JobsManager.getStats(params.type).then(function(stats) {
              var recordsTotal = 0;
              var recordsFiltered = 0;

              for (var state in stats) {
                var count = stats[state];
                recordsTotal += count;

                if (state === params.state) {
                  recordsFiltered = count;
                }
              }

              recordsFiltered = params.state ? recordsFiltered : recordsTotal;

              return {
                recordsTotal: recordsTotal,
                recordsFiltered: recordsFiltered
              };
            });

            $q.all(promises).then(function(results) {
              var jobsData = {
                recordsTotal: results.stats.recordsTotal,
                recordsFiltered: results.stats.recordsFiltered,
                data: results.data
              };
              callback(jobsData);
            });
          }

          refreshDataInterval = $interval(function() {
            vm.refreshJobs();
          }, scope.autoRefreshInterval);
        })
        .withDataProp('data')
        .withOption('language', {

        })
        .withOption('responsive', true)
        .withOption('pageLength', perPage)
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('createdRow', function(row) {
          // Recompiling so we can bind Angular directive to the DT
          $compile(angular.element(row).contents())(scope);
        })
        .withOption('headerCallback', function(header) {
          if (!vm.headerCompiled) {
            // Use this headerCompiled field to only compile header once
            vm.headerCompiled = true;
            $compile(angular.element(header).contents())(scope);
          }
        })
        .withPaginationType('full_numbers');

      vm.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable()
          .renderWith(function(data, type, full) {
            vm.selectedJobs[full.id] = false;
            return '<input type="checkbox" ng-model="listJobsCtrl.selectedJobs[' + data.id + ']" ng-click="listJobsCtrl.toggleOne()">';
          }),
        DTColumnBuilder.newColumn('state').withTitle('State').notSortable()
          .renderWith(function(data, type, full) {
            /* jshint camelcase: false */
            var stateLabelClass = full.state_label_class;
            return '<label class="label ' + stateLabelClass + '">' + data + '</label>';
          }),
        DTColumnBuilder.newColumn('type').withTitle('Type').notSortable(),
        DTColumnBuilder.newColumn('started').withTitle('Started').notSortable(),
        DTColumnBuilder.newColumn('finished').withTitle('Finished').notSortable(),
        DTColumnBuilder.newColumn('duration').withTitle('Duration').notSortable(),
        DTColumnBuilder.newColumn('attempts').withTitle('Attempts').renderWith(function(data) {
          return data.made + ' (' + data.remaining + ')';
        }).notSortable()
      ];

      refreshJobStats(scope.jobType);
      JobsManager.getTypes().then(function(types) {
        var jobTypes = [{
          label: 'Show all types',
          value: ''
        }];

        types.forEach(function(type) {
          jobTypes.push({
            label: type,
            value: type
          });
        });
        vm.jobTypes = jobTypes;
      });
    }

    scope.$on('$destroy', function() {
      if (refreshDataInterval) {
        $interval.cancel(refreshDataInterval);
      }
    });

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

    function refreshJobStats(jobType) {
      JobsManager.getStats(jobType).then(function(stats) {
        var jobStats = [];
        var totalCount = 0;
        for (var state in stats) {
          var count = stats[state];
          totalCount += count;

          jobStats.push({
            label: state,
            value: state,
            count: count,
            className: Job.stateLabelMapping[state] || 'label-default'
          });
        }

        if (!jobType) {
          jobStats.unshift({
            label: 'Show all states',
            value: '',
            count: totalCount,
            className: 'label-default'
          });
        }

        vm.jobStats = jobStats;
      });
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
      vm.selectedState = state;
      vm.refreshJobs();
    }

    function toggleType(jobType) {
      vm.selectedJobType = {
        label: jobType.label,
        value: jobType.value
      };

      // default to inactive state when type is selected, since currently api doesn't support show all states when type is selected
      if (vm.selectedState && !vm.selectedState.value) {
        vm.selectedState = {
          label: 'inactive',
          value: 'inactive'
        };
      }

      refreshJobStats(jobType.value);

      vm.refreshJobs();
    }
  }
})();
