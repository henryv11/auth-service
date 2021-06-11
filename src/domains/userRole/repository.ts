import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { userRole, FilterUserRole, CreateUserRole, UserRole } from './schemas';

const schemaKeys = Object.keys(userRole.properties);

const columnAlias = dbUtil.columnAliasBuilder(dbUtil.getCamelCasedColumnAliasMap(schemaKeys));

const where = dbUtil.whereBuilder<FilterUserRole>({
  userId: (userId, where) => where.and`user_id = ${userId}`,
  roleId: (roleId, where) => where.and`role_id = ${roleId}`,
});

const table = sql.identifier('user_role');

const columns = sql.columns(dbUtil.aliasColumns(schemaKeys, columnAlias));

export function userRoleRepository(app: FastifyInstance) {
  return {
    createOne(userRole: CreateUserRole, conn = app.database.query) {
      return conn<UserRole>(
        sql`INSERT INTO ${table} (user_id, role_id)
            ${sql.values([[userRole.userId, userRole.roleId]])}
            RETURNING ${columns}`,
      ).then(dbUtil.firstRow);
    },

    delete(filters: FilterUserRole, conn = app.database.query) {
      return conn(sql`DELETE FROM ${table} ${where(filters)}`).then(dbUtil.rowCount);
    },
  };
}
