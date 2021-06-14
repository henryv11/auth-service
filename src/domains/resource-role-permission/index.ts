import { FastifyInstance } from 'fastify';
import { resourceRolePermissionController } from './controller';
import { resourceRolePermissionRepository } from './repository';
import { resourceRolePermissionService } from './service';

export * as resourceRolePermissionSchemas from './schemas';

export function resourceRolePermissionDomain(app: FastifyInstance) {
  const repository = resourceRolePermissionRepository(app);
  const service = resourceRolePermissionService(app, repository);
  resourceRolePermissionController(app, service, repository);
  return { service, repository };
}
