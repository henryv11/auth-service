import { FastifyInstance } from 'fastify';
import { userController } from './controller';
import { userRepository } from './repository';
import { userService } from './service';

export * as userSchemas from './schemas';

export function userDomain(app: FastifyInstance) {
  const repository = userRepository(app);
  const service = userService(app, repository);
  userController(app, service, repository);
  return { repository, service };
}
