/* eslint-disable @typescript-eslint/no-unused-vars */
import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { Session } from '../session/schemas';
import { CreateResource, FilterResource, resource } from './schemas';

const where = dbUtil.whereBuilder<FilterResource>({});

const { table, columns, columnAlias } = dbUtil.getTableInfo('resource', Object.keys(resource.properties));

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
