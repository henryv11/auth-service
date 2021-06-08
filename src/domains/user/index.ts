import { FastifyInstance } from 'fastify';
import { Domain } from '../../lib';
import registerUserControllers from './controller';
import UserRepository from './repository';
import * as schemas from './schemas';
import UserService from './service';

export { schemas };

export default class UserDomain extends Domain<UserService, UserRepository> {
  constructor() {
    super(new UserService(), new UserRepository());
  }

  inject(app: FastifyInstance) {
    super.inject(app);
    registerUserControllers(app);
  }
}
