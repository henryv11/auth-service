/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { role, FilterRole, CreateRole, Role, ListRole } from './schemas';

const where = dbUtil.whereBuilder<FilterRole>({
  id: (id, where) => where.and`id = ${id}`,
  name: (name, where) => where.and`name = ${name}`,
  idIn: (ids, where) => where.and`id = ANY(${ids})`,
  userId: (userId, where) => where.and`id = ANY(SELECT role_id FROM user_role WHERE user_id = ${userId})`,
});

const { table, columns, columnAlias } = dbUtil.getTableInfo('role', Object.keys(role.properties));

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
      { orderBy = 'id', orderDirection = dbUtil.OrderDirection.ASCENDING, limit, offset, ...filters }: ListRole,
      query = app.database.query,
    ) {
      return query<Role>(
        sql`SELECT ${columns}
          FROM ${table}
          ${where(filters)}
          ORDER BY ${sql.identifier(columnAlias(orderBy))} ${dbUtil.orderDirection[orderDirection]}`,
      ).then(dbUtil.allRows);
    },
  };
}
