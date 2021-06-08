import UserDomain from './user';
import fp from 'fastify-plugin';
import SessionDomain from './session';

const domains = Object.freeze({ user: new UserDomain(), session: new SessionDomain() });

export default fp(async app => {
  app.decorate('domains', domains);
  Object.values(app.domains).forEach(domain => domain.inject(app));
});

declare module 'fastify' {
  interface FastifyInstance {
    domains: typeof domains;
  }
}
