'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Seed database on startup
  seedDB: true,

  // Bookshelf connection options
  bookshelf: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite'
    },
    useNullAsDefault: true
  },

  // Redis config Options
  redis: {
    configPath: './config/databases/redis.json',
    exePath: './win-template/TheApp/_internal/tools/redis2.8.2400-xp32bit'
  },

  flows: {
    tableName: 'flows_data',
    mailMergeFolder: './flows/005-mail-merge'
  }
};
