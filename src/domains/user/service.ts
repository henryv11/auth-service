import { FastifyInstance } from 'fastify';
import { userRepository } from './repository';
import { CreateUser } from './schemas';

export function userService(app: FastifyInstance, repository: ReturnType<typeof userRepository>) {
  return {
    async createNewUser(user: CreateUser) {
      const createdUser = await repository.createOne(user);
      return createdUser;
    },
  };
}
