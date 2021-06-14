/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance } from 'fastify';
import { resourceRepository } from './repository';
import { CreateResource } from './schemas';

export function resourceService(app: FastifyInstance, repository: ReturnType<typeof resourceRepository>) {
  const log = app.log.child({ service: resourceService.name });
  return {
    // TODO: implement service
  };
}
