/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
var User = sqldb.User;

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
