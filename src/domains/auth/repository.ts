/* eslint-disable @typescript-eslint/no-unused-vars */
import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { auth, FilterAuth } from './schemas';

const where = dbUtil.whereBuilder<FilterAuth>({
  // TODO: implement filters
});

const { table, columns, columnAlias } = dbUtil.getTableInfo('auth', Object.keys(auth.properties));

export function authRepository(app: FastifyInstance) {
  return {
    // TODO: implement repository
  };
}
