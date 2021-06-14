import { FastifyInstance } from 'fastify';
import { sessionController } from './controller';
import { sessionRepository } from './repository';
import { sessionService } from './service';

export * as sessionSchemas from './schemas';

export { sessionTableInfo } from './repository';

export function sessionDomain(app: FastifyInstance) {
  const repository = sessionRepository(app);
  const service = sessionService(app, repository);
  sessionController(app, service, repository);
  return { service, repository };
}
