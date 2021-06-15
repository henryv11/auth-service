import { Static, Type } from '@sinclair/typebox';
import { typeUtil } from '../../lib';
import { roleSchemas } from '../role';
import { userSchemas } from '../user';

export const userRole = Type.Object({
  userId: userSchemas.user.properties.id,
  roleId: roleSchemas.role.properties.id,
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const userRoleColumns = typeUtil.Keys(userRole);

export type UserRoleColumns = typeof userRoleColumns;

export const userRolePrimaryKey = Type.Pick(userRole, ['userId', 'roleId']);

export type UserRolePrimaryKey = Static<typeof userRolePrimaryKey>;

export type UserRole = Static<typeof userRole>;

export const createUserRole = Type.Pick(userRole, ['userId', 'roleId']);

export type CreateUserRole = Static<typeof createUserRole>;

export const filterUserRole = Type.Partial(Type.Pick(userRole, ['userId', 'roleId']));

export type FilterUserRole = Static<typeof filterUserRole>;

export const updateUserRole = Type.Partial(Type.Pick(userRole, []));

export type UpdateUserRole = Static<typeof updateUserRole>;

export const listUserRole = Type.Intersect([filterUserRole, typeUtil.ListControl(userRoleColumns)]);

export type ListUserRole = Static<typeof listUserRole>;
