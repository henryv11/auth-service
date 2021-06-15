import { Static, Type } from '@sinclair/typebox';
import { typeUtil } from '../../lib';

export const resource = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export type Resource = Static<typeof resource>;

export const resourceColumns = typeUtil.Keys(resource);

export const ResourceColumns = typeof resourceColumns;

export const createResource = Type.Pick(resource, ['name']);

export type CreateResource = Static<typeof createResource>;

export const filterResource = Type.Partial(Type.Pick(resource, []));

export type FilterResource = Static<typeof filterResource>;

export const updateResource = Type.Partial(Type.Pick(resource, []));

export type UpdateResource = Static<typeof updateResource>;

export const listResource = Type.Intersect([filterResource, typeUtil.ListControl(typeUtil.Keys(resource))]);

export type ListResource = Static<typeof listResource>;
