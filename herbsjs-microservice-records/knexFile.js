module.exports = {
    development: {
      client: 'mysql2',
      connection: {
        database:  'testedb',
        user: 'root',
        password:  'root',
        host:  '127.0.0.1',
        port: 3306
      },
      migrations: {
        directory: './src/infra/data/database/migrations',
        tableName: 'knex_migrations'
      }
    },
    staging: {},
    production: {}
  
  }
  