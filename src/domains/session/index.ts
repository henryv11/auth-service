import { FastifyInstance } from 'fastify';
import { Domain } from '../../lib';
import registerSessionControllers from './controller';
import SessionRepository from './repository';
import * as schemas from './schemas';
import SessionService from './service';

export { schemas };

export default class SessionDomain extends Domain<SessionService, SessionRepository> {
  constructor() {
    super(new SessionService(), new SessionRepository());
  }

  inject(app: FastifyInstance) {
    super.inject(app);
    registerSessionControllers(app);
  }
}
