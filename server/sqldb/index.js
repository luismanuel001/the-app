/**
 * Sequelize initialization module
 */

'use strict';

import config from '../config/environment';
import Sequelize from 'sequelize';
import knex from 'knex';
import bookshelf from 'bookshelf';
import bookshelfModelbase from 'bookshelf-modelbase';
import userModel from '../api/user/user.model';
import Promise from 'bluebird';

var knexInstance = knex({
  client: 'sqlite3', // or what DB you're using
  connection: {
    filename: config.bookshelf.filename
  },
  useNullAsDefault: true
});

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options),
  bookshelf: bookshelf(knexInstance) // Initialize bookshelf by passing the knex instance
};

// Enable bookshelf plugins
db.bookshelf.plugin('virtuals');
db.bookshelf.plugin(bookshelfModelbase.pluggable);

// Insert models below
db.Thing = db.sequelize.import('../api/thing/thing.model');
db.User = userModel(db.bookshelf);

// Add additional sync method to initialize the table
db.User.sync = function() {
  return new Promise(function(resolve, reject) {
    knexInstance.schema.hasTable('User').then(function(exists) {
      if (!exists) {
        return knexInstance.schema.createTable('User', function(table) {
          table.increments('_id').primary();
          table.string('name');
          table.string('email').unique();
          table.string('role').defaultTo('user');
          table.string('password');
          table.string('provider');
          table.string('salt');
          table.json('google');
          table.json('github');
          table.timestamps();

          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};

module.exports = db;
