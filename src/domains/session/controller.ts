/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance } from 'fastify';
import { SessionRepository } from './repository';
import { SessionService } from './service';

export function sessionController(app: FastifyInstance, service: SessionService, repository: SessionRepository) {
  // TODO: register controllers

  app.get('/session', {}, async () => {
    //
  });
}
