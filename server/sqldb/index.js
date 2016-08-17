/**
 * Bookshelf initialization module
 */

'use strict';

import config from '../config/environment';
import knex from 'knex';
import bookshelf from 'bookshelf';
import bookshelfModelbase from 'bookshelf-modelbase';
import userModel from '../api/user/user.model';
import flowModel from '../api/flow/flow.model';
import Promise from 'bluebird';

var knexInstance = knex(config.bookshelf);

var db = {
  bookshelf: bookshelf(knexInstance) // Initialize bookshelf by passing the knex instance
};

// Enable bookshelf plugins
db.bookshelf.plugin('virtuals');
db.bookshelf.plugin(bookshelfModelbase.pluggable);

// Insert models below
db.User = userModel(db.bookshelf);
db.Flow = flowModel(db.bookshelf);

// Add additional sync method to initialize the table
db.User.sync = function() {
  if (!db.User.promise) {
    db.User.promise = new Promise(function(resolve) {
      knexInstance.schema.hasTable('User').then(function(exists) {
        if (!exists) {
          return knexInstance.schema.createTable('User', function(table) {
            table.increments('_id').primary();
            table.string('name');
            table.string('email').unique();
            table.string('role').defaultTo('user');
            table.string('password');
            table.string('theme');
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
  }

  return db.User.promise;
};

db.Flow.sync = function() {
  if (!db.Flow.promise) {
    db.Flow.promise = new Promise(function(resolve) {
      knexInstance.schema.hasTable(config.flows.tableName).then(function(exists) {
        if (!exists) {
          return knexInstance.schema.createTable(config.flows.tableName, function(table) {
            table.increments('_id').primary().notNullable();
            table.string('type1');
            table.string('type2');
            table.string('type3');
            table.string('code1');
            table.string('code2');
            table.string('code3');
            table.string('status1');
            table.string('status2');
            table.string('status3');
            table.string('text1');
            table.string('text2');
            table.string('text3');
            table.text('clob1', 'longtext');
            table.text('clob2', 'longtext');
            table.text('clob3', 'longtext');
            table.binary('blob1');
            table.binary('blob2');
            table.binary('blob3');
            table.date('date1');
            table.date('date2');
            table.date('date3');
            table.decimal('amount1');
            table.decimal('amount2');
            table.decimal('amount3');
            table.boolean('bool1');
            table.boolean('bool2');
            table.boolean('bool3');
            table.string('log1');
            table.string('log2');
            table.string('log3');
            table.string('notes');
            table.string('additional_data1');
            table.string('additional_data2');
            table.string('additional_data3');
            table.timestamps();

            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  return db.Flow.promise;
};

db.bookshelf.sync = function() {
  var promises = [
    db.User.sync(),
    db.Flow.sync()
  ];
  return Promise.all(promises);
};

module.exports = db;
