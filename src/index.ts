import auth from '@heviir/fastify-auth';
import errors from '@heviir/fastify-errors';
import exitHandler from '@heviir/fastify-exit-handler';
import database, { FastifyPgOptions } from '@heviir/fastify-pg';
import config from 'config';
import Fastify from 'fastify';
import swagger from 'fastify-swagger';
import { readFile } from 'fs';
import pino from 'pino';
import { promisify } from 'util';
import domains from './domains';

const readFileAsync = promisify(readFile);

const app = Fastify({ logger: pino(config.get('logger')) });

app.register(exitHandler);

app.register(errors);
app.register(database, { ...config.get<FastifyPgOptions>('database'), database: config.get('name') });
app.register(auth, {
  privateKey: readFileAsync(__dirname + '/keys/private_key.pem'),
  publicKey: readFileAsync(__dirname + '/keys/public_key.pem'),
  permissions: {},
});
app.register(swagger, Object.create(config.get('swagger')));
app.register(domains);

app.listen(config.get('port'), config.get('host'), err => {
  if (err) {
    app.log.info('failed to start app', err);
    app.exit(1, err);
  } else {
    app.log.info(`app listening @ ${config.get('host')}:${config.get('port')}`);
  }
});
