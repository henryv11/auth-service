#!/usr/bin/node
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const pathUtil = require('path');
const child = require('child_process');

const name = process.argv[2];

if (!name) {
  throw new TypeError('missing name argument');
}

const nameKebabCase = name
  .replace(/\W+/g, ' ')
  .split(/ |\B(?=[A-Z])/)
  .map(word => word.toLowerCase())
  .join('-');

const dirPath = pathUtil.join('src', 'domains', nameKebabCase);

if (fs.existsSync(dirPath)) {
  throw new TypeError('domain with name ' + name + ' already exists');
}

fs.mkdirSync(dirPath);

console.log('created directory ' + dirPath);

const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
const nameSnakeCase = name
  .replace(/\W+/g, ' ')
  .split(/ |\B(?=[A-Z])/)
  .map(word => word.toLowerCase())
  .join('_');

const schemas = `
import { Static, Type } from '@sinclair/typebox';
import { typeUtil } from '../../lib';

export const ${name} = Type.Object({
   // TODO: define properties for "${nameSnakeCase}" table
});

export type ${nameCapitalized} = Static<typeof ${name}>;

export const ${name}Columns = typeUtil.Keys(${name});

export type ${nameCapitalized}Column = typeof ${name}Columns[number];

export const create${nameCapitalized} = Type.Pick(${name}, [
  // TODO: pick properties for creating entries in "${nameSnakeCase}" table
]);

export type Create${nameCapitalized} = Static<typeof create${nameCapitalized}>;

export const filter${nameCapitalized} = Type.Partial(Type.Pick(${name}, [
    // TODO: pick properties for filtering "${nameSnakeCase}" table
]));

export type Filter${nameCapitalized} = Static<typeof filter${nameCapitalized}>;

export const update${nameCapitalized} = Type.Partial(Type.Pick(${name}, [
    // TODO: pick properties for updating "${nameSnakeCase}" table
]));

export type Update${nameCapitalized} = Static<typeof update${nameCapitalized}>;

export const list${nameCapitalized} = Type.Intersect([filter${nameCapitalized}, typeUtil.ListControl(${name}Columns)]);

export type List${nameCapitalized} = Static<typeof list${nameCapitalized}>;
`;

const controller = `
/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import { FastifyInstance } from 'fastify';
import { ${nameCapitalized}Repository } from './repository';
import { ${nameCapitalized}Service } from './service';

export function ${name}Controller(
  app: FastifyInstance,
  service: ${nameCapitalized}Service,
  repository: ${nameCapitalized}Repository,
) {
  // TODO: register ${name} controllers
}
`;

const repository = `
/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import sql from '@heviir/pg-template-string';
import { FastifyInstance } from 'fastify';
import { dbUtil } from '../../lib';
import { Filter${nameCapitalized}, ${name}Columns } from './schemas';

const where = dbUtil.where<Filter${nameCapitalized}>({
  // TODO: implement filters for "${nameSnakeCase}" table
});

export const ${name}Table = dbUtil.table('${nameSnakeCase}', ${name}Columns);

export function ${name}Repository(app: FastifyInstance) {
  return {
    // TODO: implement ${name} repository
  };
}

export type ${nameCapitalized}Repository = ReturnType<typeof ${name}Repository>;
`;

const service = `
/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
import { FastifyInstance } from 'fastify';
import { ${nameCapitalized}Repository } from './repository';

export function ${name}Service(app: FastifyInstance, repository: ${nameCapitalized}Repository) {
  const log = app.log.child({ service: ${name}Service.name });
  return {
    // TODO: implement ${name} service
  };
}

export type ${nameCapitalized}Service = ReturnType<typeof ${name}Service>;
`;

const index = `
import { FastifyInstance } from 'fastify';
import { ${name}Controller } from './controller';
import { ${name}Repository } from './repository';
import { ${name}Service } from './service';

export * as ${name}Schemas from './schemas';

export { ${name}Table } from './repository';

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

console.log('domain ' + name + ' created successfully');

try {
  child.execSync('prettier --write --config .prettierrc.js ' + dirPath);
} catch (error) {
  console.log('formatting files failed', error);
}
