/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance, FastifyRequest } from 'fastify';
import { authRepository } from './repository';
import { sessionSchemas } from '../session';
import { Credentials, credentials, response, Response } from './schemas';
import { authService } from './service';

export function authController(
  app: FastifyInstance,
  service: ReturnType<typeof authService>,
  repository: ReturnType<typeof authRepository>,
) {
  function ensureToken(req: FastifyRequest) {
    if (!req.token) {
      throw new app.errors.InternalServerError(req.tokenError);
    }
    return req.token;
  }

  function getRequestData(req: FastifyRequest) {
    const browser = req.headers['x-browser'] || '';
    const device = req.headers['x-device'] || '';
    const data: sessionSchemas.RequestData = {
      ip: req.ip,
      browser: Array.isArray(browser) ? browser.join(', ') : browser,
      device: Array.isArray(device) ? device.join(', ') : device,
    };
    return data;
  }

  app.post<{ Body: Credentials; Response: Response }>(
    '/auth',
    { schema: { body: credentials, response: { '2xx': response } } },
    async req => {
      const data = getRequestData(req);
      const result = await service.loginUser(req.body, data);
      return { jwt: result.jwt, token: result.session.token, userId: result.user.id };
    },
  );

  app.put<{ Body: Credentials; Response: Response }>(
    '/auth',
    { schema: { body: credentials, response: { '2xx': response } } },
    async req => {
      const data = getRequestData(req);
      const result = await service.registerUser(req.body, data);
      return { jwt: result.jwt, token: result.session.token, userId: result.user.id };
    },
  );

  app.delete('/auth', { auth: true }, async req => {
    const token = ensureToken(req);
    await service.logoutUser(<number>token.sub);
  });

  app.get('/auth', { auth: true, schema: { response: { '2xx': response } } }, async req => {
    const token = ensureToken(req);
    if (!token.session) {
      throw new app.errors.BadRequest('session token missing in token payload');
    }
    const data = getRequestData(req);
    const result = await service.refreshLoginSession(<number>token.sub, { ...data, token: token.session });
    return { jwt: result.jwt, token: result.session.token, userId: result.user.id };
  });
}
