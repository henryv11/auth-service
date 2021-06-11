import { FastifyInstance } from 'fastify';
import { userRepository } from './repository';
import { CreateUser } from './schemas';
import { hash } from 'bcrypt';

export function userService(app: FastifyInstance, repository: ReturnType<typeof userRepository>) {
  return {
    async createNewUser(user: CreateUser) {
      const createdUser = await repository.createOne(user);
      return createdUser;
    },
  };
}
