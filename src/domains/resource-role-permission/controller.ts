/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import { FastifyInstance } from 'fastify';
import { ResourceRolePermissionRepository } from './repository';
import { ResourceRolePermissionService } from './service';

export function resourceRolePermissionController(
  app: FastifyInstance,
  service: ResourceRolePermissionService,
  repository: ResourceRolePermissionRepository,
) {
  // TODO: register resourceRolePermission controllers
}
