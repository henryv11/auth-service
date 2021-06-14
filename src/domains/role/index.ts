import { FastifyInstance } from 'fastify';
import { roleController } from './controller';
import { roleRepository } from './repository';
import { roleService } from './service';

export * as roleSchemas from './schemas';

export { roleTableInfo } from './repository';

export function roleDomain(app: FastifyInstance) {
  const repository = roleRepository(app);
  const service = roleService(app, repository);
  roleController(app, service, repository);
  return { service, repository };
}
