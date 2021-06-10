import { FastifyInstance } from 'fastify';
import { userRepository } from './repository';
import { CreateUser, createUser, publicUser } from './schemas';
import { userService } from './service';

export function userController(
  app: FastifyInstance,
  service: ReturnType<typeof userService>,
  repository: ReturnType<typeof userRepository>,
) {
  app.route<{ Body: CreateUser }>({
    url: '/',
    method: 'POST',
    schema: {
      body: createUser,
      response: {
        201: publicUser,
      },
    },
    async handler(req, res) {
      const user = await service.registerNew(req.body);
      res.status(201);
      return user;
    },
  });
}
