'use strict';

var kue = require('kue'),
  queue = kue.createQueue({
    disableSearch: true,
    redis: require('../../../config/databases/redis.json').redis
  });

queue.on('error', function(err) {
  console.log('Oops, there is some problem with redis. ', err);
});

var jobStatus = 'running';

/**
 * Get job queue status
 */
export function status(req, res) {
  res.status(200).json({
    status: jobStatus
  });
}

/**
 * Start job queue
 */
export function start(req, res) {
  if (jobStatus === 'running') {
    res.status(400).json({
      error: 'Kue is already running'
    });
  } else {
    queue = kue.createQueue({
      disableSearch: true,
      redis: require('../../../config/databases/redis.json').redis
    });

    queue.on('error', function(err) {
      console.log('Oops, there is some problem with redis. ', err);
    });

    jobStatus = 'running';
    res.status(200).json({
      message: 'Re-create queue'
    });
  }
}

/**
 * Shut down job queue
 */
export function shutdown(req, res) {
  queue.shutdown(5000, function(err) {
    if (err) {
      return res.status(400).send({
        error: err.message
      });
    }
    jobStatus = 'shutdown';
    res.status(200).json({
      message: 'Successfully shut down kue'
    });
  });
}
