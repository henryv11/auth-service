/* eslint-disable @typescript-eslint/no-unused-vars */
import { hash } from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { sessionSchemas } from '../session';
import { userSchemas } from '../user';

import { authRepository } from './repository';
import { Credentials } from './schemas';

const SALT_ROUNDS = 10;

export function authService(app: FastifyInstance, repository: ReturnType<typeof authRepository>) {
  const log = app.log.child({ service: authService.name });

  async function getEncodedJwt(user: userSchemas.PublicUser, session: sessionSchemas.Session) {
    const roles = await app.domains.userRole.service.getUserRoles(user.id);
    const jwt = await app.auth.encodeToken({ sub: user.id, session: session.token, roles });
    return jwt;
  }

  return {
    /**
     * handle registration of new user
     */
    async registerUser(credentials: Credentials, data: sessionSchemas.RequestData) {
      const hashedPassword = await hash(credentials.password, SALT_ROUNDS);
      const user = await app.domains.user.service.createNewUser({ ...credentials, password: hashedPassword });
      const session = await app.domains.session.service.startNewSession(user.id, data);
      const jwt = await getEncodedJwt(user, session);
      return { user, session, jwt };
    },

    /**
     * handle login of existing user
     */
    async loginUser(credentials: Credentials, data: sessionSchemas.RequestData) {
      const hashedPassword = await hash(credentials.password, SALT_ROUNDS);
      const user = await app.domains.user.repository.findOne({ ...credentials, password: hashedPassword }).catch(() => {
        throw new app.errors.BadRequest({ response: 'invalid username or password' });
      });
      const session = await app.domains.session.service.continueOrStartNewSession(user.id, data);
      const jwt = await getEncodedJwt(user, session);
      return { user, session, jwt };
    },

    /**
     *  handle logout of logged in user
     */
    async logoutUser(userId: userSchemas.User['id']) {
      await app.domains.session.service.endSession(userId);
    },

    /**
     * handle refreshing current user login session
     */
    async refreshLoginSession(
      userId: userSchemas.User['id'],
      data: sessionSchemas.RequestData & { token: sessionSchemas.Session['token'] },
    ) {
      const user = await app.domains.user.repository.findOne({ id: userId });
      const session = await app.domains.session.service.refreshSession(userId, data);
      const jwt = await getEncodedJwt(user, session);
      return { user, session, jwt };
    },
  };
}

export type AuthService = ReturnType<typeof authService>;
