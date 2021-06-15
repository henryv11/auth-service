/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance } from 'fastify';
import { UserRepository } from './repository';
import { UserService } from './service';

export function userController(app: FastifyInstance, service: UserService, repository: UserRepository) {
  // TODO: register user controller
}
