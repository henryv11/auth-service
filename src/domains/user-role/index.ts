import { FastifyInstance } from 'fastify';
import { userRoleController } from './controller';
import { userRoleRepository } from './repository';
import { userRoleService } from './service';

export * as userRoleSchemas from './schemas';

export { userRoleTable as userRoleTableInfo } from './repository';

export function userRoleDomain(app: FastifyInstance) {
  const repository = userRoleRepository(app);
  const service = userRoleService(app, repository);
  userRoleController(app, service, repository);
  return { service, repository };
}
