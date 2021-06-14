import { FastifyInstance } from 'fastify';
import { userRoleRepository } from './repository';
import { UserRole, UserRolePrimaryKey } from './schemas';

import { userSchemas } from '../user';

export function userRoleService(app: FastifyInstance, repository: ReturnType<typeof userRoleRepository>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const log = app.log.child({ service: userRoleService.name });
  return {
    async assignRoleToUser(roleId: UserRole['roleId'], userId: UserRole['userId']) {
      await repository.createOne({ roleId, userId });
      return <UserRolePrimaryKey>{ userId, roleId };
    },

    async removeRoleFromUser(primaryKey: UserRolePrimaryKey) {
      const deleteCount = await repository.delete(primaryKey);
      return deleteCount !== 0;
    },

    async getUserRoles(userId: userSchemas.User['id']) {
      const roles = await app.domains.role.repository.list({ userId });
      return roles.map(role => role.name);
    },
  };
}
