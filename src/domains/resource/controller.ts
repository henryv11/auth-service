/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance } from 'fastify';
import { resourceRepository } from './repository';
import { resourceService } from './service';

export function resourceController(
  app: FastifyInstance,
  service: ReturnType<typeof resourceService>,
  repository: ReturnType<typeof resourceRepository>,
) {
  // TODO: register controllers
}
