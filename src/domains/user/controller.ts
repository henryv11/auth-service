import { FastifyInstance } from 'fastify';
import { userRepository } from './repository';
import { userService } from './service';

export function userController(
  app: FastifyInstance,
  service: ReturnType<typeof userService>,
  repository: ReturnType<typeof userRepository>,
) {
  // TODO: register user controller
}
