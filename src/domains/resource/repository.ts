import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { Session } from '../session/schemas';
import { CreateResource, FilterResource, resource } from './schemas';

const schemaKeys = Object.keys(resource.properties);

const columnAlias = dbUtil.columnAliasBuilder(dbUtil.getCamelCasedColumnAliasMap(schemaKeys));

const where = dbUtil.whereBuilder<FilterResource>({});

const table = sql.identifier('resource');

const columns = sql.columns(dbUtil.aliasColumns(schemaKeys, columnAlias));

export function resourceRepository(app: FastifyInstance) {
  return {
    createOne(resource: CreateResource, conn = app.database.query) {
      return conn<Session>(
        sql`INSERT INTO ${table} (name)
        ${sql.values([[resource.name]])}
        RETURNING ${columns}`,
      ).then(dbUtil.firstRow);
    },
  };
}
