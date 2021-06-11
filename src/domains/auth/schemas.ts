import { Static, Type } from '@sinclair/typebox';
import { typeUtil } from '../../lib';
import { userSchemas } from '../user';

export const credentials = Type.Object({
  username: userSchemas.user.properties.username,
  password: userSchemas.user.properties.password,
});

export type Credentials = Static<typeof credentials>;

export const auth = Type.Object({});

export type Auth = Static<typeof auth>;

export const createAuth = Type.Pick(auth, []);

export type CreateAuth = Static<typeof createAuth>;

export const filterAuth = Type.Pick(auth, []);

export type FilterAuth = Static<typeof filterAuth>;

export const updateAuth = Type.Pick(auth, []);

export type UpdateAuth = Static<typeof updateAuth>;

export const listAuth = typeUtil.ListControl(typeUtil.Keys(auth));

export type ListAuth = Static<typeof listAuth>;
