import { FastifyInstance } from 'fastify';
import { userRoleRepository } from './repository';
import { UserRole } from './schemas';

export function userRoleService(app: FastifyInstance, repository: ReturnType<typeof userRoleRepository>) {
  const log = app.log.child({ service: userRoleService.name });
  return {
    async assignRoleToUser(roleId: UserRole['roleId'], userId: UserRole['userId']) {
      const userRole = await repository.createOne({ roleId, userId });
      return userRole;
    },

    async removeRoleFromUser(roleId: UserRole['roleId'], userId: UserRole['userId']) {
      await repository.delete({ roleId, userId });
    },
  };
}
