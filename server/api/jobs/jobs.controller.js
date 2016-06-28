'use strict';

import {User} from '../../sqldb';
var kue = require('kue'),
  queue = kue.createQueue({
    disableSearch: false,
  // prefix: 'q',
  redis: {
    port: 16632,
    host: 'pub-redis-16632.us-east-1-3.4.ec2.garantiadata.com',
    auth: 'PBF(&dJ/h/E464aU[w88',
    // db: 3, // if provided select a non-default redis db
    options: {
      // see https://github.com/mranney/node_redis#rediscreateclient
    }
  }
});
var pauseWorkers = {};

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    console.log(err);
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

export function start(req, res) {
  queue = kue.createQueue({
    disableSearch: false,
    // prefix: 'q',
    redis: {
      port: 16632,
      host: 'pub-redis-16632.us-east-1-3.4.ec2.garantiadata.com',
      auth: 'PBF(&dJ/h/E464aU[w88',
      // db: 3, // if provided select a non-default redis db
      options: {
        // see https://github.com/mranney/node_redis#rediscreateclient
      }
    }
  });
  res.status(200).json({
    message: 'Re-create queue'
  });
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  var job = queue.create('email', {
    title: 'welcome email for tj',
    to: 'tj@learnboost.com',
    template: 'welcome-email'
  }).priority('normal').save( function(err){
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if( !err ) {
      res.status(200).json({
        text: job.id
      });
    }
  });

  return job;
}

export function pause(req, res) {
  console.log("Puasing worker... ");
  var jobType = 'email';
  var pause = pauseWorkers[jobType] || false;
  pauseWorkers[jobType] =  !pause;
  res.status(200).json({
    message: 'Successfully pause'
  });
}

export function resume(req, res) {
  console.log('resuming...');
  var jobType = 'email';
  pauseWorkers[jobType] = pauseWorkers[jobType] || [];
  console.log(pauseWorkers[jobType]);


  pauseWorkers[jobType].forEach(function(pauseWorker) {
    setTimeout( function(){ console.log('resuming!!!'); pauseWorker.resume(); }, 10000 );
  });
  res.status(200).json({
    message: 'Successfully resume'
  });
}

export function shutdown(req, res) {
  // console.log('Shutting down kue..');
  // process.once( 'SIGTERM', function ( sig ) {
  //   console.log('Shutting down kue 2..');
  //   done();
  //   queue.shutdown( 5000, function(err) {
  //     console.log( 'Kue shutdown: ', err||'' );
  //     process.exit( 0 );
  //   });
  // });
  console.log('Shutting down kue..');
  queue.shutdown( 5000, function(err) {
    if (err) {
      return res.status(400).send({
        error: err.message
      });
    }
    res.status(200).json({
      message: 'Successfully shut down'
    });
  });
}

kue.app.listen(3000);
