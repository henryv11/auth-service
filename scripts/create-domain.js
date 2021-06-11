#!/usr/bin/node

const fs = require('fs');
const pathUtil = require('path');

const name = process.argv[2];

if (!name) {
  throw new TypeError('missing name argument');
}

const dirPath = pathUtil.join('src', 'domains', name);

if (fs.existsSync(dirPath)) {
  throw new TypeError('domain with name ' + name + ' already exists');
}

fs.mkdirSync(dirPath);

console.log('created directory ' + dirPath);

const nameCap = name.charAt(0).toUpperCase() + name.slice(1);

const schemas = `
import { Static, Type } from '@sinclair/typebox';
import { typeUtil } from '../../lib';

export const ${name} = Type.Object({});

export type ${nameCap} = Static<typeof ${name}>;

export const create${nameCap} = Type.Pick(${name}, []);

export type Create${nameCap} = Static<typeof create${nameCap}>;

export const filter${nameCap} = Type.Partial(Type.Pick(${name}, []));

export type Filter${nameCap} = Static<typeof filter${nameCap}>;

export const update${nameCap} = Type.Partial(Type.Pick(${name}, []));

export type Update${nameCap} = Static<typeof update${nameCap}>;

export const list${nameCap} = Type.Intersect([filter${nameCap}, typeUtil.ListControl(typeUtil.Keys(${name}))]);

export type List${nameCap} = Static<typeof list${nameCap}>;
`;

const controller = `
import { FastifyInstance } from 'fastify';
import { ${name}Repository } from './repository';
import { ${name}Service } from './service';

export function ${name}Controller(
  app: FastifyInstance,
  service: ReturnType<typeof ${name}Service>,
  repository: ReturnType<typeof ${name}Repository>,
) {
  // TODO: register ${name} controllers
}
`;

const repository = `
import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { ${name}, Filter${nameCap} } from './schemas';

const schemaKeys = Object.keys(${name}.properties);

const columnAlias = dbUtil.columnAliasBuilder(dbUtil.getCamelCasedColumnAliasMap(schemaKeys));

const where = dbUtil.whereBuilder<Filter${nameCap}>({});

const table = sql.identifier('${name}');

const columns = sql.columns(dbUtil.aliasColumns(schemaKeys, columnAlias));

export function ${name}Repository(app: FastifyInstance) {
  return {
    // TODO: implement ${name} repository
  };
}
`;

const service = `
import { FastifyInstance } from 'fastify';
import { ${name}Repository } from './repository';

export function ${name}Service(app: FastifyInstance, repository: ReturnType<typeof ${name}Repository>) {
  const log = app.log.child({ service: ${name}Service.name });
  return {
    // TODO: implement ${name} service
  };
}
`;

const index = `
import { FastifyInstance } from 'fastify';
import { ${name}Controller } from './controller';
import { ${name}Repository } from './repository';
import { ${name}Service } from './service';

export * as ${name}Schemas from './schemas';

export function ${name}Domain(app: FastifyInstance) {
  const repository = ${name}Repository(app);
  const service = ${name}Service(app, repository);
  ${name}Controller(app, service, repository);
  return { service, repository };
}
`;

const templateByFile = { schemas, controller, repository, service, index };

for (const filename of Object.keys(templateByFile)) {
  fs.writeFileSync(pathUtil.join(dirPath, filename + '.ts'), templateByFile[filename].trim() + '\n');
  console.log('created template file ' + filename + '.ts in ' + dirPath);
}

console.log('domain created successfully');
