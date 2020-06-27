/*
  |--------------------------------------------------------------------------
  | Database Information
  | Please use TypeORM Docs
  | https://github.com/typeorm/typeorm/blob/master/docs/connection.md
  |--------------------------------------------------------------------------
*/
export default {
  name: 'default',
  type: process.env.DATABASE_DRIVER as 'mysql',
  host: process.env.DATABASE_HOST as string,
  port: parseInt(process.env.DATABASE_PORT as string, 10),
  username: process.env.DATABASE_USERNAME as string,
  password: process.env.DATABASE_PASSWORD as string,
  database: process.env.DATABASE_NAME as string,
  entities: [`${__dirname}/../models/*.js`],
  synchronize: process.env.DATABASE_SYNC as boolean | undefined || false,
};
