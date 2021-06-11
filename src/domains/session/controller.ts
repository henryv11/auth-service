import { FastifyInstance } from 'fastify';
import { sessionRepository } from './repository';
import { sessionService } from './service';

export function sessionController(
  app: FastifyInstance,
  service: ReturnType<typeof sessionService>,
  repository: ReturnType<typeof sessionRepository>,
) {
  // TODO: register controllers
}
