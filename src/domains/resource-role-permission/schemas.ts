import { Static, Type } from '@sinclair/typebox';
import { typeUtil } from '../../lib';
import { resourceSchemas } from '../resource';
import { roleSchemas } from '../role';

export enum Permission {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export const resourceRolePermission = Type.Object({
  resourceId: resourceSchemas.resource.properties.id,
  roleId: roleSchemas.role.properties.id,
  permission: Type.Enum(Permission),
});

export const resourceRolePermissionColumns = typeUtil.Keys(resourceRolePermission);

export type ResourceRolePermissionColumns = typeof resourceRolePermissionColumns;

export type ResourceRolePermission = Static<typeof resourceRolePermission>;

export const createResourceRolePermission = resourceRolePermission;

export type CreateResourceRolePermission = Static<typeof createResourceRolePermission>;

export const filterResourceRolePermission = Type.Partial(resourceRolePermission);

export type FilterResourceRolePermission = Static<typeof filterResourceRolePermission>;

export const updateResourceRolePermission = Type.Partial(
  Type.Pick(resourceRolePermission, [
    // TODO: pick properties for updating "resource_role_permission" table
  ]),
);

export type UpdateResourceRolePermission = Static<typeof updateResourceRolePermission>;

export const listResourceRolePermission = Type.Intersect([
  filterResourceRolePermission,
  typeUtil.ListControl(typeUtil.Keys(resourceRolePermission)),
]);

export type ListResourceRolePermission = Static<typeof listResourceRolePermission>;
