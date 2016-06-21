'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/angularfullstack-test'
  },

  // Bookshelf connection options
  bookshelf: {
    filename: './test.sqlite'
  }
};
