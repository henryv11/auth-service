import { FastifyInstance } from 'fastify';
import { authRepository } from './repository';
import { authService } from './service';

export function authController(
  app: FastifyInstance,
  service: ReturnType<typeof authService>,
  repository: ReturnType<typeof authRepository>,
) {
  // TODO: register controllers
}
