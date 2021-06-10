import { userDomain } from './user';
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

function getDomains(app: FastifyInstance) {
  return {
    user: userDomain(app),
  };
}

export default fp(async app => {
  app.decorate('domains', getDomains(app));
});

declare module 'fastify' {
  interface FastifyInstance {
    domains: ReturnType<typeof getDomains>;
  }
}
