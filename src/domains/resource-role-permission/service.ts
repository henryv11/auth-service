/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import { FastifyInstance } from 'fastify';
import { resourceRolePermissionRepository } from './repository';

export function resourceRolePermissionService(
  app: FastifyInstance,
  repository: ReturnType<typeof resourceRolePermissionRepository>,
) {
  const log = app.log.child({ service: resourceRolePermissionService.name });
  return {
    // TODO: implement resourceRolePermission service
  };
}
