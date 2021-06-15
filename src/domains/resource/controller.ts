/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance } from 'fastify';
import { ResourceRepository } from './repository';
import { ResourceService } from './service';

export function resourceController(app: FastifyInstance, service: ResourceService, repository: ResourceRepository) {
  // TODO: register controllers
}
