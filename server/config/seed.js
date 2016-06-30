/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
import kue from 'kue';
import request from 'request';

var User = sqldb.User;
var queue = kue.createQueue({
  disableSearch: false,
  redis: require('../../config/databases/redis.json').redis
});

User.sync()
  .then(() => {
    User.findAll().then(function (users) {
      users.models.forEach(function(user) {
        user.destroy();
      });

      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
      });

      User.create({
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin'
      });
    });
  })
  .then(() => {
    console.log('finished populating users');
  });

queue.create('email', {
  title: 'Just a dummy email job',
  to: 'dummy@user.com',
  template: 'dummy-email'
}).priority('normal').save();

queue.create('email', {
  title: 'Just a dummy email job',
  to: 'dummy@user.com',
  template: 'dummy-email'
}).priority('high').save();

queue.create('backup', {
  title: 'Just a dummy backup job',
  interval: 'daily'
}).priority('normal').save();

queue.create('backup', {
  title: 'Just a dummy backup job',
  interval: 'weekly'
}).priority('high').save();

queue.create('run report', {
  title: 'Just a dummy run report job',
  reportType: 'annual'
}).priority('normal').save();

queue.create('run report', {
  title: 'Just a dummy run report job',
  reportType: 'quarter'
}).priority('high').save();
