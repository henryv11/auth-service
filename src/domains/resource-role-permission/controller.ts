/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import { FastifyInstance } from 'fastify';
import { resourceRolePermissionRepository } from './repository';
import { resourceRolePermissionService } from './service';

export function resourceRolePermissionController(
  app: FastifyInstance,
  service: ReturnType<typeof resourceRolePermissionService>,
  repository: ReturnType<typeof resourceRolePermissionRepository>,
) {
  // TODO: register resourceRolePermission controllers
}
