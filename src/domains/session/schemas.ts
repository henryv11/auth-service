import { Static, Type } from '@sinclair/typebox';
import { typeUtil } from '../../lib';
import { userSchemas } from '../user';

export const session = Type.Object({
  id: Type.Number(),
  userId: userSchemas.user.properties.id,
  token: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  endedAt: Type.Union([Type.Null(), Type.String({ format: 'date-time' })]),
  ip: Type.String(),
  device: Type.String(),
  browser: Type.String(),
});

export type Session = Static<typeof session>;

export const createSession = Type.Pick(session, ['userId', 'token', 'ip', 'device', 'browser']);

export type CreateSession = Static<typeof createSession>;

export const filterSession = Type.Partial(Type.Pick(session, ['id', 'userId', 'token', 'endedAt']));

export type FilterSession = Static<typeof filterSession>;

export const updateSession = Type.Partial(Type.Pick(session, ['endedAt']));

export type UpdateSession = Static<typeof updateSession>;

export const sessionColumns = typeUtil.Keys(session);

export type SessionColumn = typeof sessionColumns[number];

export const listSession = Type.Intersect([filterSession, typeUtil.ListControl(sessionColumns)]);

export type ListSession = Static<typeof listSession>;

export const requestData = Type.Pick(session, ['ip', 'device', 'browser']);

export type RequestData = Static<typeof requestData>;
