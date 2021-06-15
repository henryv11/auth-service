/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance } from 'fastify';
import { ResourceRepository } from './repository';

export function resourceService(app: FastifyInstance, repository: ResourceRepository) {
  const log = app.log.child({ service: resourceService.name });
  return {
    // TODO: implement service
  };
}

export type ResourceService = ReturnType<typeof resourceService>;
