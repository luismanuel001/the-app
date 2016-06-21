'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Seed database on startup
  seedDB: true,

  // Bookshelf connection options
  bookshelf: {
    filename: './dev.sqlite'
  }
};
