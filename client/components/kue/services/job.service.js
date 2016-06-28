(function() {
  'use strict';

  angular
    .module('kueJobs')
    .factory('Job', JobService);

  JobService.$inject = [];

  function JobService() {

    function Job(data) {
      if (data) {
        this.setData(data);
      }

      Object.defineProperty(this, 'submitted_date', {
        enumerable: true,
        configurable: false,
        get: function() {
          var submitted_date = moment(this.timestamp);
          return submitted_date.fromNow();
        }
      });

      Object.defineProperty(this, 'started', {
        enumerable: true,
        configurable: false,
        get: function() {
          var today = moment();
          var startedAt = this.created_at / 1000;
          var started = moment.unix(startedAt);

          if (today.diff(started, 'days') > 0) {
            return started.format('MMMM Do YYYY, h:mm:ss a');
          } else {
            return started.fromNow();
          }
        }
      });

      Object.defineProperty(this, 'finished', {
        enumerable: true,
        configurable: false,
        get: function() {
          var today = moment();
          var finishedAt = this.created_at / 1000;
          var finished = moment.unix(finishedAt);

          if (today.diff(finished, 'days') > 0) {
            return finished.format('MMMM Do YYYY, h:mm:ss a');
          } else {
            return finished.fromNow();
          }
        }
      });

      Object.defineProperty(this, 'dataAsString', {
        enumerable: true,
        configurable: false,
        get: function() {
          return JSON.stringify(this.data, null, 2);
        }
      });

      Object.defineProperty(this, 'attemptsAsString', {
        enumerable: true,
        configurable: false,
        get: function() {
          return JSON.stringify(this.attempts, null, 2);
        }
      });

      Object.defineProperty(this, 'state_label_class', {
        enumerable: true,
        configurable: false,
        get: function() {
          return Job.stateLabelMapping[this.state] || 'label-default';
        }
      });
    }


    Job.stateLabelMapping = {
      active: 'label-primary',
      inactive: 'label-default',
      queued: 'label-info',
      running: 'label-warning',
      completed: 'label-success',
      failed: 'label-danger'
    };

    Job.prototype = {
      setData: function(data) {
        angular.extend(this, data);
        this.duration = data.duration || null;
        this.state = data.state || null;
      }
    };
    return Job;
  }
})();
