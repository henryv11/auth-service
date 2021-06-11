import { FastifyInstance } from 'fastify';
import { roleRepository } from './repository';

export function roleService(app: FastifyInstance, repository: ReturnType<typeof roleRepository>) {
  const log = app.log.child({ service: roleService.name });
  return {
    // TODO: implement service
  };
}
