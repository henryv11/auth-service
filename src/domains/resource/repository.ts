/* eslint-disable @typescript-eslint/no-unused-vars */
import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { Session } from '../session/schemas';
import { CreateResource, FilterResource, resource } from './schemas';

const where = dbUtil.where<FilterResource>({});

export const resourceTable = dbUtil.table('resource', Object.keys(resource.properties));

export function resourceRepository(app: FastifyInstance) {
  return {
    createOne(resource: CreateResource, conn = app.database.query) {
      return conn<Session>(
        sql`INSERT INTO ${resourceTable.name} (name)
            ${sql.values([[resource.name]])}
            RETURNING ${resourceTable.allColumns}`,
      ).then(dbUtil.firstRow);
    },
  };
}
