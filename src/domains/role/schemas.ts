import { Static, Type } from '@sinclair/typebox';
import { typeUtil } from '../../lib';

export const role = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export type Role = Static<typeof role>;

export const createRole = Type.Pick(role, ['name']);

export type CreateRole = Static<typeof createRole>;

export const filterRole = Type.Partial(Type.Pick(role, []));

export type FilterRole = Static<typeof filterRole>;

export const updateRole = Type.Partial(Type.Pick(role, []));

export type UpdateRole = Static<typeof updateRole>;

export const listRole = Type.Intersect([filterRole, typeUtil.ListControl(typeUtil.Keys(role))]);

export type ListRole = Static<typeof listRole>;
