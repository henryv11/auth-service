import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { session, FilterSession, CreateSession, Session } from './schemas';

const schemaKeys = Object.keys(session.properties);

const columnAlias = dbUtil.columnAliasBuilder(dbUtil.getCamelCasedColumnAliasMap(schemaKeys));

const where = dbUtil.whereBuilder<FilterSession>({
  id: (id, where) => where.and`id = ${id}`,
  userId: (userId, where) => where.and`user_id = ${userId}`,
  endedAt: (endedAt, where) => where.and`ended_at = ${endedAt}`,
});

const table = sql.identifier('session');

const columns = sql.columns(dbUtil.aliasColumns(schemaKeys, columnAlias));

export function sessionRepository(app: FastifyInstance) {
  return {
    createOne(session: CreateSession, conn = app.database.query) {
      return conn<Session>(
        sql`INSERT INTO ${table} (token, user_id)
            ${sql.values([[session.token, session.userId]])}
            RETURNING ${columns}`,
      ).then(dbUtil.firstRow);
    },

    findOne(filters: FilterSession, conn = app.database.query) {
      return conn<Session>(
        sql`SELECT ${columns}
            FROM ${table}
            ${where(filters, false)}
            LIMIT 1`,
      ).then(dbUtil.firstRow);
    },

    findMaybeOne(filters: FilterSession, conn = app.database.query) {
      return conn<Session>(
        sql`SELECT ${columns}
            FROM ${table}
            ${where(filters, false)}
            LIMIT 1`,
      ).then(dbUtil.maybeFirstRow);
    },
  };
}
