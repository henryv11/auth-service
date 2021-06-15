/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { FilterResourceRolePermission, resourceRolePermissionColumns } from './schemas';

const where = dbUtil.where<FilterResourceRolePermission>({
  // TODO: implement filters for "resource_role_permission" table
});

export const resourceRolePermissionTable = dbUtil.table('resource_role_permission', resourceRolePermissionColumns);

export function resourceRolePermissionRepository(app: FastifyInstance) {
  return {
    // TODO: implement resourceRolePermission repository
  };
}
