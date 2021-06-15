import { FastifyInstance } from 'fastify';
import { UserRepository } from './repository';
import { CreateUser } from './schemas';

export function userService(app: FastifyInstance, repository: UserRepository) {
  return {
    async createNewUser(user: CreateUser) {
      const createdUser = await repository.createOne(user);
      return createdUser;
    },
  };
}

export type UserService = ReturnType<typeof userService>;
