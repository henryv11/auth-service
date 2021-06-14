import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { userRole, FilterUserRole, CreateUserRole, UserRole, ListUserRole } from './schemas';

const where = dbUtil.whereBuilder<FilterUserRole>({
  userId: (userId, where) => where.and`user_id = ${userId}`,
  roleId: (roleId, where) => where.and`role_id = ${roleId}`,
});

export const userRoleTableInfo = dbUtil.getTableInfo('user_role', Object.keys(userRole.properties));

const { table, columns, getColumn } = userRoleTableInfo;

export function userRoleRepository(app: FastifyInstance) {
  return {
    createOne(userRole: CreateUserRole, query = app.database.query) {
      return query<UserRole>(
        sql`INSERT INTO ${table} (user_id, role_id)
            ${sql.values([[userRole.userId, userRole.roleId]])}
            RETURNING ${columns}`,
      ).then(dbUtil.firstRow);
    },

    delete(filters: FilterUserRole, query = app.database.query) {
      return query(sql`DELETE FROM ${table} ${where(filters)}`).then(dbUtil.rowCount);
    },

    list(
      {
        orderBy = 'createdAt',
        orderDirection = dbUtil.OrderDirection.ASCENDING,
        limit = 100,
        offset = 0,
        ...filters
      }: ListUserRole,
      query = app.database.query,
    ) {
      return query<UserRole & { totalRows: number }>(
        sql`SELECT ${columns}, COUNT(*) OVER AS "totalRows"
            FROM ${table}
            ${where(filters)}
            ORDER BY ${getColumn(orderBy)} ${dbUtil.orderDirection[orderDirection]}
            LIMIT ${limit} OFFSET ${offset}`,
      ).then(dbUtil.allRows);
    },
  };
}
