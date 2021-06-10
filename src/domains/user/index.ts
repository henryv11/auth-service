import { FastifyInstance } from 'fastify';
import { userController } from './controller';
import { userRepository } from './repository';
import * as schemas from './schemas';
import { userService } from './service';

export { schemas };

export function userDomain(app: FastifyInstance) {
  const repository = userRepository(app);
  const service = userService(app, repository);
  userController(app, service, repository);
  return {
    service,
    repository,
  };
}
