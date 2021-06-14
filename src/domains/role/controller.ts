/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import { FastifyInstance } from 'fastify';
import { roleRepository } from './repository';
import { roleService } from './service';

export function roleController(
  app: FastifyInstance,
  service: ReturnType<typeof roleService>,
  repository: ReturnType<typeof roleRepository>,
) {
  // TODO: register role controllers
}
