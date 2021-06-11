import { FastifyInstance } from 'fastify';
import { authController } from './controller';
import { authRepository } from './repository';
import { authService } from './service';

export * as authSchemas from './schemas';

export function authDomain(app: FastifyInstance) {
  const repository = authRepository(app);
  const service = authService(app, repository);
  authController(app, service, repository);
  return { service, repository };
}
