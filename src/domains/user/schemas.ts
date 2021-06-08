import { Type, Static } from '@sinclair/typebox';

const id = Type.Number();
const username = Type.String();
const password = Type.String();
const createdAt = Type.String({ format: 'date-time', column: 'created_at' });
const updatedAt = Type.String({ format: 'date-time', column: 'updated_at' });

export const user = Type.Object(
  {
    id,
    username,
    password,
    createdAt,
    updatedAt,
  },
  {
    table: 'app_user',
  },
);

export const publicUser = Type.Omit(user, ['password']);

export type PublicUser = Static<typeof publicUser>;

export type User = Static<typeof user>;

export const createUser = Type.Pick(user, ['username', 'password']);

export type CreateUser = Static<typeof createUser>;

export const updateUser = Type.Partial(Type.Pick(user, ['username', 'password']));

export type UpdateUser = Static<typeof updateUser>;

export const filterUser = Type.Partial(Type.Pick(user, ['id', 'username', 'password']));

export type FilterUser = Static<typeof filterUser>;
