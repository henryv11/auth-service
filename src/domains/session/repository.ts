import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { session, FilterSession, CreateSession, Session, UpdateSession } from './schemas';

const where = dbUtil.whereBuilder<FilterSession>({
  id: (id, where) => where.and`id = ${id}`,
  userId: (userId, where) => where.and`user_id = ${userId}`,
  endedAt: (endedAt, where) => where.and`ended_at = ${endedAt}`,
});

export const sessionTableInfo = dbUtil.getTableInfo('session', Object.keys(session.properties));

const { table, columns } = sessionTableInfo;

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

    update(update: UpdateSession, filters: FilterSession, conn = app.database.query) {
      return conn<Session>(
        sql`UPDATE ${table}
          ${sql.set({
            endedAt: update.endedAt,
          })}
          ${where(filters)}
          RETURNING ${columns}`,
      ).then(dbUtil.allRows);
    },

    updateOne(update: UpdateSession, filters: FilterSession, conn = app.database.query) {
      return conn<Session>(
        sql`UPDATE ${table}
          ${sql.set({
            endedAt: update.endedAt,
          })}
          ${where(filters)}
          RETURNING ${columns}`,
      ).then(dbUtil.firstRow);
    },
  };
}
