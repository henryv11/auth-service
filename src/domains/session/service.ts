import { FastifyInstance } from 'fastify';
import { sessionRepository } from './repository';
import { userSchemas } from '../user';

export function sessionService(app: FastifyInstance, repository: ReturnType<typeof sessionRepository>) {
  const log = app.log.child({ service: sessionService.name });
  return {
    async getSession(userId: userSchemas.User['id']) {
      const connection = await app.database.connection();

      try {
        const existingSession = await repository.findMaybeOne({ userId, endedAt: null }, connection.query);
        if (existingSession) {
          log.info('continuing existing session' + existingSession.id + ' for user ' + userId);

          // TODO validate session

          return existingSession;
        } else {
          const token = '';
          const newSession = await repository.createOne({ userId, token }, connection.query);
          log.info('created new session for user ' + userId);
          return newSession;
        }
      } finally {
        connection.close();
      }
    },
  };
}
