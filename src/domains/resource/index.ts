import { FastifyInstance } from 'fastify';
import { resourceController } from './controller';
import { resourceRepository } from './repository';
import { resourceService } from './service';

export * as resourceSchemas from './schemas';

export function resourceDomain(app: FastifyInstance) {
  const repository = resourceRepository(app);
  const service = resourceService(app, repository);
  resourceController(app, service, repository);
  return { service, repository };
}
