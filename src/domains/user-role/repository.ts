import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { FilterUserRole, CreateUserRole, UserRole, ListUserRole, userRoleColumns, UserRoleColumn } from './schemas';

const where = dbUtil.where<FilterUserRole>({
  userId: (userId, where) => where.and`user_id = ${userId}`,
  roleId: (roleId, where) => where.and`role_id = ${roleId}`,
});

export const userRoleTable = dbUtil.table('user_role', userRoleColumns);

export function userRoleRepository(app: FastifyInstance) {
  return {
    createOne(userRole: CreateUserRole, query = app.database.query) {
      return query<UserRole>(
        sql`INSERT INTO ${userRoleTable.name} (user_id, role_id)
            ${sql.values([[userRole.userId, userRole.roleId]])}
            RETURNING ${userRoleTable.columns()}`,
      ).then(dbUtil.firstRow);
    },

    delete(filters: FilterUserRole, query = app.database.query) {
      return query(
        sql`DELETE FROM ${userRoleTable.name}
            ${where(filters)}`,
      ).then(dbUtil.rowCount);
    },

    list<C extends UserRoleColumn = UserRoleColumn>(
      {
        orderBy = 'createdAt',
        orderDirection = dbUtil.OrderDirection.ASCENDING,
        limit = 100,
        offset = 0,
        ...filters
      }: ListUserRole,
      columns?: C | C[],
      query = app.database.query,
    ) {
      return query<Pick<UserRole, C> & { totalRows: number }>(
        sql`SELECT ${userRoleTable.columns(columns)}, COUNT(*) OVER AS "totalRows"
            FROM ${userRoleTable.name}
            ${where(filters, false)}
            ORDER BY ${userRoleTable.column(orderBy)} ${dbUtil.orderDirection[orderDirection]}
            LIMIT ${limit} OFFSET ${offset}`,
      ).then(dbUtil.allRows);
    },
  };
}

export type UserRoleRoleRepository = ReturnType<typeof userRoleRepository>;
