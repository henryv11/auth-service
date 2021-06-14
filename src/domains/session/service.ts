import { FastifyInstance } from 'fastify';
import { sessionRepository } from './repository';
import { userSchemas } from '../user';
import { RequestData, Session } from './schemas';

export function sessionService(app: FastifyInstance, repository: ReturnType<typeof sessionRepository>) {
  const log = app.log.child({ service: sessionService.name });

  function generateSessionToken() {
    // TODO: better implementation for token generation
    return Math.random().toString().split('.')[1];
  }

  function isExpired(session: Session) {
    return new Date().getTime() - new Date(session.createdAt).getTime() >= 8.64e7 * 14;
  }

  async function endSession(id: Session['id']) {
    const session = await repository.updateOne({ endedAt: new Date().toISOString() }, { id });
    log.info(`user ${session.userId} session ${session.id} ended`);
    return session;
  }

  async function startSession(userId: userSchemas.User['id'], data: RequestData) {
    const token = generateSessionToken();
    const session = await repository.createOne({ userId, token, ...data });
    log.info(`started new session ${session.id} for user ${userId}`);
    return session;
  }

  async function validateSession(session: Session, data: RequestData) {
    if (session.ip !== data.ip) {
      throw new app.errors.BadRequest();
    }

    if (session.browser !== data.browser) {
      throw new app.errors.BadRequest();
    }

    if (session.device !== data.device) {
      throw new app.errors.BadRequest();
    }
  }

  async function getUnexpiredSession(session: Session, data: RequestData) {
    if (isExpired(session)) {
      await endSession(session.id);
      return await startSession(session.userId, data);
    }
    return session;
  }

  return {
    /**
     * end user's active session
     */
    async endSession(userId: userSchemas.User['id']) {
      const session = await repository.findOne({ userId, endedAt: null });
      await endSession(session.id);
    },

    /**
     * start new session after successful registration
     */
    async startNewSession(userId: userSchemas.User['id'], data: RequestData) {
      const session = await startSession(userId, data);
      return session;
    },

    /**
     *  continue or start a new session after successful login
     */
    async continueOrStartNewSession(userId: userSchemas.User['id'], data: RequestData) {
      const existingSession = await repository.findMaybeOne({ userId, endedAt: null });

      if (!existingSession) {
        return await startSession(userId, data);
      }

      try {
        validateSession(existingSession, data);
      } catch (error) {
        await endSession(existingSession.id);
        return await startSession(userId, data);
      }
      return await getUnexpiredSession(existingSession, data);
    },

    /**
     * refresh session after successful jwt authentication
     */
    async refreshSession(userId: userSchemas.User['id'], data: RequestData & { token: Session['token'] }) {
      const session = await repository.findOne({ userId, token: data.token });
      validateSession(session, data);

      if (session.endedAt === null) {
        return await getUnexpiredSession(session, data);
      }

      const existingSession = await repository.findMaybeOne({ userId, endedAt: null });
      if (!existingSession) {
        return await startSession(userId, data);
      }
      validateSession(existingSession, data);
      return await getUnexpiredSession(existingSession, data);
    },
  };
}
