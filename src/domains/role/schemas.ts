import { Static, Type } from '@sinclair/typebox';
import { typeUtil } from '../../lib';
import { userSchemas } from '../user';

export const role = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export type Role = Static<typeof role>;

export const createRole = Type.Pick(role, ['id', 'name']);

export type CreateRole = Static<typeof createRole>;

export const filterRole = Type.Partial(
  Type.Intersect([
    Type.Pick(role, ['id', 'name']),
    Type.Object({ idIn: Type.Array(role.properties.id), userId: userSchemas.user.properties.id }),
  ]),
);

export type FilterRole = Static<typeof filterRole>;

export const updateRole = Type.Partial(
  Type.Pick(role, [
    // TODO: pick properties for updating "role" table
  ]),
);

export type UpdateRole = Static<typeof updateRole>;

export const listRole = Type.Intersect([filterRole, typeUtil.ListControl(typeUtil.Keys(role))]);

export type ListRole = Static<typeof listRole>;
