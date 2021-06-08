import { Service } from '../../lib';
import SessionRepository from './repository';

export default class SessionService extends Service<SessionRepository> {
  startNewSession() {}
}
