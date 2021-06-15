import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { userRoleTableInfo } from '../user-role';
import { CreateRole, FilterRole, ListRole, Role, roleColumns } from './schemas';

const where = dbUtil.where<FilterRole>({
  id: (id, where) => where.and`id = ${id}`,
  name: (name, where) => where.and`name = ${name}`,
  idIn: (ids, where) => where.and`id = ANY(${ids})`,
  userId: (userId, where) =>
    where.and`id = ANY(
      SELECT role_id
      FROM ${userRoleTableInfo.name}
      WHERE user_id = ${userId}
    )`,
});

export const roleTable = dbUtil.table('role', roleColumns);

export function roleRepository(app: FastifyInstance) {
  return {
    createOne(role: CreateRole, query = app.database.query) {
      return query<Role>(
        sql`INSERT INTO ${roleTable.name} (name)
            ${sql.values([[role.name]])}
            RETURNING ${roleTable.columns()}`,
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
      return query<Role & { totalRows: number }>(
        sql`SELECT ${roleTable.columns()}, COUNT(*) OVER AS "totalRows"
            FROM ${roleTable.name}
            ${where(filters)}
            ORDER BY ${roleTable.column(orderBy)} ${dbUtil.orderDirection[orderDirection]}
            LIMIT ${limit} OFFSET ${offset}`,
      ).then(dbUtil.allRows);
    },
  };
}

export type RoleRepository = ReturnType<typeof roleRepository>;
