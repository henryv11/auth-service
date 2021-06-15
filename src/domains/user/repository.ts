import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { CreateUser, FilterUser, ListUser, PublicUser, publicUser, UpdateUser, userColumns } from './schemas';

const where = dbUtil.where<FilterUser>({
  id: (id, where) => where.and`id = ${id}`,
  username: (username, where) => where.and`username = ${username}`,
  password: (password, where) => where.and`password = ${password}`,
});

export const userTable = dbUtil.table('app_user', userColumns);

export function userRepository(app: FastifyInstance) {
  return {
    createOne(user: CreateUser, conn = app.database.query) {
      return conn<PublicUser>(
        sql`INSERT INTO ${userTable.name} (username, password)
            ${sql.values([[user.username, user.password]])}
            RETURNING ${userTable.columns()}`,
      ).then(dbUtil.firstRow);
    },

    updateOne(update: UpdateUser, filters: FilterUser, conn = app.database.query) {
      return conn<PublicUser>(
        sql`UPDATE ${userTable.name}
            ${userTable.set(update)}
            ${where(filters)}
            RETURNING ${userTable.columns()}`,
      ).then(dbUtil.firstRow);
    },

    findOne(filters: FilterUser, conn = app.database.query) {
      return conn<PublicUser>(
        sql`SELECT ${userTable.columns()}
            FROM ${userTable.name}
            ${where(filters, false)}
            LIMIT 1`,
      ).then(dbUtil.firstRow);
    },

    findMaybeOne(filters: FilterUser, conn = app.database.query) {
      return conn<PublicUser>(
        sql`SELECT ${userTable.columns()}
            FROM ${userTable.name}
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
        sql`SELECT ${userTable.columns()}, COUNT(*) OVER AS "totalRows"
            FROM ${userTable.name}
            ${where(filters, false)}
            ORDER BY ${userTable.column(orderBy)} ${dbUtil.orderDirection[orderDirection]}
            LIMIT ${limit} OFFSET ${offset}`,
      ).then(dbUtil.allRows);
    },
  };
}
