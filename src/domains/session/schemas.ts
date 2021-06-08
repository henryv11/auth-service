import { Static, Type } from '@sinclair/typebox';

const id = Type.Number();
const createdAt = Type.String({ format: 'date-time', column: 'created_at' });
const updatedAt = Type.String({ format: 'date-time', column: 'updated_at' });
const userId = Type.Number({ column: 'user_id' });
const token = Type.String({});

export const session = Type.Object({ id, token, userId, createdAt, updatedAt }, { table: 'session' });

export type Session = Static<typeof session>;

export const createSession = Type.Pick(session, ['token', 'userId']);

export type CreateSession = Static<typeof createSession>;

export const filterSession = Type.Partial(Type.Pick(session, ['id', 'token', 'userId', 'createdAt', 'updatedAt']));

export type FilterSession = Static<typeof filterSession>;

export const updateSession = Type.Partial(Type.Pick(session, ['token', 'userId']));

export type UpdateSession = Static<typeof updateSession>;
