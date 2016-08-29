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
    client: 'sqlite3',
    connection: {
      filename: './test.sqlite'
    },
    useNullAsDefault: true
  },

  // Redis config Options
  redis: {
    configPath: './config/databases/redis.json',
    exePath: './theapp-template/TheApp/_internal/tools/redis2.8.2400-xp32bit'
  },

  flows: {
    tableName: 'flows_data',
    mailMergeFolder: './flows/005-mail-merge'
  }
};
