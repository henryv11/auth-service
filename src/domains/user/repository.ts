import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import * as dbUtil from '../../lib';
import { CreateUser, FilterUser, ListUser, PublicUser, UpdateUser } from './schemas';

const translate = dbUtil.columnTranslationBuilder({ created_at: 'createdAt', updated_at: 'updatedAt' });

const where = dbUtil.whereBuilder<FilterUser>({
  id: (id, where) => where.and`id = ${id}`,
  username: (username, where) => where.and`username = ${username}`,
  password: (password, where) => where.and`password = ${password}`,
});

const table = sql.identifier('app_user');

const columns = sql.columns([
  'id',
  'username',
  ['created_at', translate('created_at')],
  ['updated_at', translate('updated_at')],
]);

export function userRepository(app: FastifyInstance) {
  return {
    createOne(user: CreateUser, conn = app.database.query) {
      return conn<PublicUser>(
        sql`INSERT INTO ${table} (username, password)
            ${sql.values([[user.username, user.password]])}
            RETURNING ${columns}`,
      ).then(dbUtil.firstRow);
    },

    updateOne(update: UpdateUser, filters: FilterUser, conn = app.database.query) {
      return conn<PublicUser>(
        sql`UPDATE ${table}
            ${sql.set({ username: update.username, password: update.password })}
            ${where(filters)}
            RETURNING ${columns}`,
      ).then(dbUtil.firstRow);
    },

    findOne(filters: FilterUser, conn = app.database.query) {
      return conn<PublicUser>(
        sql`SELECT ${columns}
            FROM ${table}
            ${where(filters, false)}
            LIMIT 1`,
      ).then(dbUtil.firstRow);
    },

    findMaybeOne(filters: FilterUser, conn = app.database.query) {
      return conn<PublicUser>(
        sql`SELECT ${columns}
            FROM ${table}
            ${where(filters, false)}
            LIMIT 1`,
      ).then(dbUtil.maybeFirstRow);
    },

    list(
      {
        orderBy = 'id',
        orderDirection = dbUtil.OrderDirection.ASCENDING,
        limit = 100,
        offset = 0,
        ...filters
      }: ListUser & FilterUser,
      conn = app.database.query,
    ) {
      return conn<PublicUser & { totalRows: number }>(
        sql`SELECT ${sql.columns([columns, sql`COUNT(*) OVER AS "totalRows"`])}
            FROM ${table}
            ${where(filters, false)}
            ORDER BY ${sql.identifier(translate(orderBy))} ${dbUtil.orderDirection[orderDirection]}
            LIMIT ${limit} OFFSET ${offset}`,
      ).then(dbUtil.allRows);
    },
  };
}
