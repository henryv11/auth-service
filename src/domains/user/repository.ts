import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { CreateUser, FilterUser, ListUser, PublicUser, UpdateUser, UserColumn, userColumns } from './schemas';

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

    findOne<C extends UserColumn = UserColumn>(filters: FilterUser, columns?: C | C[], conn = app.database.query) {
      return conn<Pick<PublicUser, C>>(
        sql`SELECT ${userTable.columns(columns)}
            FROM ${userTable.name}
            ${where(filters, false)}
            LIMIT 1`,
      ).then(dbUtil.firstRow);
    },

    findMaybeOne<C extends UserColumn = UserColumn>(filters: FilterUser, columns?: C | C[], conn = app.database.query) {
      return conn<Pick<PublicUser, C>>(
        sql`SELECT ${userTable.columns(columns)}
            FROM ${userTable.name}
            ${where(filters, false)}
            LIMIT 1`,
      ).then(dbUtil.maybeFirstRow);
    },

    list<C extends UserColumn = UserColumn>(
      {
        orderBy = 'id',
        orderDirection = dbUtil.OrderDirection.ASCENDING,
        limit = 100,
        offset = 0,
        ...filters
      }: ListUser & FilterUser,
      columns?: C | C[],
      conn = app.database.query,
    ) {
      return conn<Pick<PublicUser, C> & { totalRows: number }>(
        sql`SELECT ${userTable.columns(columns)}, COUNT(*) OVER AS "totalRows"
            FROM ${userTable.name}
            ${where(filters, false)}
            ORDER BY ${userTable.column(orderBy)} ${dbUtil.orderDirection[orderDirection]}
            LIMIT ${limit} OFFSET ${offset}`,
      ).then(dbUtil.allRows);
    },
  };
}

export type UserRepository = ReturnType<typeof userRepository>;
