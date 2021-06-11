import { Type, Static } from '@sinclair/typebox';
import { Keys, ListControl } from '../../lib';

export const user = Type.Object({
  id: Type.Number(),
  username: Type.String(),
  password: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const publicUser = Type.Omit(user, ['password']);

export type PublicUser = Static<typeof publicUser>;

export type User = Static<typeof user>;

export const createUser = Type.Pick(user, ['username', 'password']);

export type CreateUser = Static<typeof createUser>;

export const updateUser = Type.Partial(Type.Pick(user, ['username', 'password']));

export type UpdateUser = Static<typeof updateUser>;

export const filterUser = Type.Partial(Type.Pick(user, ['id', 'username', 'password']));

export type FilterUser = Static<typeof filterUser>;

export const listUser = ListControl(Keys(user));

export type ListUser = Static<typeof listUser>;
