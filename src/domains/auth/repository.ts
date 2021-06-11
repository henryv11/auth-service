import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { auth, FilterAuth } from './schemas';

const schemaKeys = Object.keys(auth.properties);

const columnAlias = dbUtil.columnAliasBuilder(dbUtil.getCamelCasedColumnAliasMap(schemaKeys));

const where = dbUtil.whereBuilder<FilterAuth>({});

const table = sql.identifier('auth');

const columns = sql.columns(dbUtil.aliasColumns(schemaKeys, columnAlias));

export function authRepository(app: FastifyInstance) {
  return {
    // TODO: implement repository
  };
}
