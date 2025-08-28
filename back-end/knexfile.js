/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgresql://postgres:DHRsvnftdwtBzFtk@db.jwzznagnnpyaqluqdwph.supabase.co:5432/postgres",
  DATABASE_URL_DEVELOPMENT = "postgres://zhknmyap:6aGOqqWtAt4z26eUuY3NYQIPKkrXGJLO@chunee.db.elephantsql.com/zhknmyap",
  DATABASE_URL_TEST = "postgres://ghzlnfxs:XyeMQ9nrdJtysDtHRqlaGGI3SatFVp9-@chunee.db.elephantsql.com/ghzlnfxs",
  DATABASE_URL_PREVIEW = "postgres://gsufpebn:4s-uHzgOb9J4txzS5EPyJG3nbqEY_6PP@chunee.db.elephantsql.com/gsufpebn",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
