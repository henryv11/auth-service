import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { userRoleTableInfo } from '../user-role';
import { CreateRole, FilterRole, ListRole, role, Role } from './schemas';

const where = dbUtil.whereBuilder<FilterRole>({
  id: (id, where) => where.and`id = ${id}`,
  name: (name, where) => where.and`name = ${name}`,
  idIn: (ids, where) => where.and`id = ANY(${ids})`,
  userId: (userId, where) =>
    where.and`id = ANY(
      SELECT role_id
      FROM ${userRoleTableInfo.table}
      WHERE user_id = ${userId}
    )`,
});

export const roleTableInfo = dbUtil.getTableInfo('role', Object.keys(role.properties));

const { table, columns, getColumn } = roleTableInfo;

export function roleRepository(app: FastifyInstance) {
  return {
    createOne(role: CreateRole, query = app.database.query) {
      return query<Role>(
        sql`INSERT INTO ${table} (name)
              ${sql.values([[role.name]])}
              RETURNING ${columns}`,
      ).then(dbUtil.firstRow);
    },

    list(
      {
        orderBy = 'id',
        orderDirection = dbUtil.OrderDirection.ASCENDING,
        limit = 100,
        offset = 0,
        ...filters
      }: ListRole,
      query = app.database.query,
    ) {
      return query<Role>(
        sql`SELECT ${columns}
          FROM ${table}
          ${where(filters)}
          ORDER BY ${getColumn(orderBy)} ${dbUtil.orderDirection[orderDirection]}
          LIMIT ${limit} OFFSET ${offset}`,
      ).then(dbUtil.allRows);
    },
  };
}
