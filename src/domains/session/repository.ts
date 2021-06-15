import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { FilterSession, CreateSession, Session, UpdateSession, sessionColumns, SessionColumns } from './schemas';

const where = dbUtil.where<FilterSession>({
  id: (id, where) => where.and`id = ${id}`,
  userId: (userId, where) => where.and`user_id = ${userId}`,
  endedAt: (endedAt, where) => where.and`ended_at = ${endedAt}`,
});

export const sessionTable = dbUtil.table('session', sessionColumns);

export function sessionRepository(app: FastifyInstance) {
  return {
    createOne(session: CreateSession, columns?: SessionColumns | SessionColumns[number], conn = app.database.query) {
      return conn<Session>(
        sql`INSERT INTO ${sessionTable.name} (token, user_id)
            ${sql.values([[session.token, session.userId]])}
            RETURNING ${sessionTable.columns(columns)}`,
      ).then(dbUtil.firstRow);
    },

    findOne(filters: FilterSession, conn = app.database.query) {
      return conn<Session>(
        sql`SELECT ${sessionTable.allColumns}
            FROM ${sessionTable.name}
            ${where(filters, false)}
            LIMIT 1`,
      ).then(dbUtil.firstRow);
    },

    findMaybeOne(filters: FilterSession, conn = app.database.query) {
      return conn<Session>(
        sql`SELECT ${sessionTable.allColumns}
            FROM ${sessionTable.name}
            ${where(filters, false)}
            LIMIT 1`,
      ).then(dbUtil.maybeFirstRow);
    },

    update(update: UpdateSession, filters: FilterSession, conn = app.database.query) {
      return conn<Session>(
        sql`UPDATE ${sessionTable.name}
          ${sessionTable.set(update)}
          ${where(filters)}
          RETURNING ${sessionTable.allColumns}`,
      ).then(dbUtil.allRows);
    },

    updateOne(update: UpdateSession, filters: FilterSession, conn = app.database.query) {
      return conn<Session>(
        sql`UPDATE ${sessionTable.name}
          ${sql.set({
            endedAt: update.endedAt,
          })}
          ${where(filters)}
          RETURNING ${sessionTable.allColumns}`,
      ).then(dbUtil.firstRow);
    },
  };
}
