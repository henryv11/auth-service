/* eslint-disable @typescript-eslint/no-unused-vars */
import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { auth, FilterAuth } from './schemas';

const where = dbUtil.where<FilterAuth>({
  // TODO: implement filters
});

const { name: table, allColumns: columns, columnAlias } = dbUtil.table('auth', Object.keys(auth.properties));

export function authRepository(app: FastifyInstance) {
  return {
    // TODO: implement repository
  };
}
