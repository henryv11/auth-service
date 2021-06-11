import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { CreateRole, FilterRole, role, Role } from './schemas';

const schemaKeys = Object.keys(role.properties);

const columnAlias = dbUtil.columnAliasBuilder(dbUtil.getCamelCasedColumnAliasMap(schemaKeys));

const where = dbUtil.whereBuilder<FilterRole>({});

const table = sql.identifier('role');

const columns = sql.columns(dbUtil.aliasColumns(schemaKeys, columnAlias));

export function roleRepository(app: FastifyInstance) {
  return {
    createOne(role: CreateRole, conn = app.database.query) {
      return conn<Role>(
        sql`INSERT INTO ${table} (name)
            ${sql.values([[role.name]])}
            RETURNING ${columns}`,
      ).then(dbUtil.firstRow);
    },
  };
}
