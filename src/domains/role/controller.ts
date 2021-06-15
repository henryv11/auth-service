/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import { FastifyInstance } from 'fastify';
import { RoleRepository } from './repository';
import { RoleService } from './service';

export function roleController(app: FastifyInstance, service: RoleService, repository: RoleRepository) {
  // TODO: register role controllers
}
