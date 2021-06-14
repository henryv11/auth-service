import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { authDomain } from './auth';
import { resourceDomain } from './resource';
import { roleDomain } from './role';
import { sessionDomain } from './session';
import { userDomain } from './user';
import { userRoleDomain } from './user-role';

function getDomains(app: FastifyInstance) {
  return {
    auth: authDomain(app),
    resource: resourceDomain(app),
    role: roleDomain(app),
    session: sessionDomain(app),
    user: userDomain(app),
    userRole: userRoleDomain(app),
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
