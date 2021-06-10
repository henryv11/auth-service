import { FastifyInstance } from 'fastify';
import { userRepository } from './repository';
import { CreateUser } from './schemas';
import { hash } from 'bcrypt';

export function userService(app: FastifyInstance, repository: ReturnType<typeof userRepository>) {
  return {
    async registerNew(user: CreateUser) {
      const [transaction, hashedPassword] = await Promise.all([app.database.transaction(), hash(user.password, 10)]);
      try {
        const createdUser = await repository.createOne({ ...user, password: hashedPassword }, transaction.query);
        await transaction.commit();
        return createdUser;
      } catch (error) {
        app.log.error(error, 'failed to register new user');
        await transaction.rollback();
        throw new app.errors.BadRequest();
      }
    },
  };
}
