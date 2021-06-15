/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import { FastifyInstance } from 'fastify';
import { RoleRepository } from './repository';

export function roleService(app: FastifyInstance, repository: RoleRepository) {
  const log = app.log.child({ service: roleService.name });
  return {
    // TODO: implement role service
  };
}

export type RoleService = ReturnType<typeof roleService>;
