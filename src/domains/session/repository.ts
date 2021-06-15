import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { FilterSession, CreateSession, Session, UpdateSession, sessionColumns, SessionColumn } from './schemas';

const where = dbUtil.where<FilterSession>({
  id: (id, where) => where.and`id = ${id}`,
  userId: (userId, where) => where.and`user_id = ${userId}`,
  endedAt: (endedAt, where) => where.and`ended_at = ${endedAt}`,
});

export const sessionTable = dbUtil.table('session', sessionColumns);

export function sessionRepository(app: FastifyInstance) {
  return {
    createOne(session: CreateSession, conn = app.database.query) {
      return conn<Session>(
        sql`INSERT INTO ${sessionTable.name} (token, user_id)
            ${sql.values([[session.token, session.userId]])}
            RETURNING ${sessionTable.columns()}`,
      ).then(dbUtil.firstRow);
    },

    findOne<C extends SessionColumn = SessionColumn>(
      filters: FilterSession,
      columns?: C | C[],
      conn = app.database.query,
    ) {
      return conn<Pick<Session, C>>(
        sql`SELECT ${sessionTable.columns(columns)}
            FROM ${sessionTable.name}
            ${where(filters, false)}
            LIMIT 1`,
      ).then(dbUtil.firstRow);
    },

    findMaybeOne<C extends SessionColumn = SessionColumn>(
      filters: FilterSession,
      columns?: C | C[],
      conn = app.database.query,
    ) {
      return conn<Pick<Session, C>>(
        sql`SELECT ${sessionTable.columns(columns)}
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
          RETURNING ${sessionTable.columns()}`,
      ).then(dbUtil.allRows);
    },

    updateOne(update: UpdateSession, filters: FilterSession, conn = app.database.query) {
      return conn<Session>(
        sql`UPDATE ${sessionTable.name}
          ${sessionTable.set(update)}
          ${where(filters)}
          RETURNING ${sessionTable.columns()}`,
      ).then(dbUtil.firstRow);
    },
  };
}

export type SessionRepository = ReturnType<typeof sessionRepository>;
