import { Static, Type } from '@sinclair/typebox';
import { typeUtil } from '../../lib';
import { session } from '../session/schemas';
import { user } from '../user/schemas';

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

export const credentials = Type.Object({
  username: user.properties.username,
  password: user.properties.password,
});

export type Credentials = Static<typeof credentials>;

export const response = Type.Object({
  token: session.properties.token,
  jwt: Type.String(),
  userId: user.properties.id,
});

export type Response = Static<typeof response>;
