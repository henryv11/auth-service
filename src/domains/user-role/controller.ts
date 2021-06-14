/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance } from 'fastify';
import { userRoleRepository } from './repository';
import { userRoleService } from './service';

export function userRoleController(
  app: FastifyInstance,
  service: ReturnType<typeof userRoleService>,
  repository: ReturnType<typeof userRoleRepository>,
) {
  // TODO: register userRole controllers
}
