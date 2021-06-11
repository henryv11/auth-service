import { hash } from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { authRepository } from './repository';
import { Credentials } from './schemas';

const SALT_ROUNDS = 10;

export function authService(app: FastifyInstance, repository: ReturnType<typeof authRepository>) {
  const log = app.log.child({ service: authService.name });
  return {
    async registerUser(credentials: Credentials) {
      const hashedPassword = await hash(credentials.password, SALT_ROUNDS);
      const user = await app.domains.user.service.createNewUser({ ...credentials, password: hashedPassword });
      const session = await app.domains.session.service.getSession(user.id);
      return { user, session };
    },

    async loginUser(credentials: Credentials) {
      const hashedPassword = await hash(credentials.password, SALT_ROUNDS);
      const user = await app.domains.user.repository.findOne({ ...credentials, password: hashedPassword }).catch(() => {
        throw new app.errors.BadRequest({ response: 'invalid username or password' });
      });
      const session = await app.domains.session.service.getSession(user.id);
      return { user, session };
    },
  };
}
