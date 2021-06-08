import { Service } from '../../lib';
import UserRepository from './repository';

export default class UserService extends Service<UserRepository> {
  registerNewUser() {}
}
