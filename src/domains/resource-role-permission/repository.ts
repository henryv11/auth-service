/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { resourceRolePermission, FilterResourceRolePermission } from './schemas';

const where = dbUtil.whereBuilder<FilterResourceRolePermission>({
  // TODO: implement filters for "resource_role_permission" table
});

const { table, columns, columnAlias } = dbUtil.getTableInfo(
  'resource_role_permission',
  Object.keys(resourceRolePermission.properties),
);

export function resourceRolePermissionRepository(app: FastifyInstance) {
  return {
    // TODO: implement resourceRolePermission repository
  };
}
