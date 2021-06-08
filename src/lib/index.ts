import { QueryResult } from '@heviir/fastify-pg';
import errors from '@heviir/http-errors';
import sql, { ColumnsSqlObject, IdentifierSqlObj, WhereSqlObj } from '@heviir/pg-template-string';
import { Static, TObject, TProperties } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';

function getTableInfo<S extends TObject<P>, P extends TProperties = S['properties']>(schema: S) {
  const columns = Object.entries(schema.properties).reduce<[string, string][]>(
    (acc, [k, { column = k }]) => (acc.push([k, column]), acc),
    [],
  );
  return {
    table: sql.identifier(schema.table),
    columns: sql.columns(columns.map(([a, b]) => (a === b ? a : [b, a]))),
    columnMap: columns.reduce(
      (map, [key, value]) => ((map[<keyof P>key] = sql.identifier(value)), map),
      <Record<keyof P, ReturnType<typeof sql.identifier>>>{},
    ),
  };
}

function getWhereBuilder<W extends TObject<TProperties>>(w: WhereSchema<W>) {
  return (filters: Static<W>, throwOnEmpty = true) => {
    const where = sql.where();
    Object.entries(filters).forEach(([key, value]) => value !== undefined && w[key]?.(value, where));
    if (throwOnEmpty && where.isEmpty) {
      throw new errors.Forbidden();
    }
    return where;
  };
}

export abstract class Repository<
  S extends TObject<TProperties>,
  W extends TObject<TProperties>,
  F extends FastifyInstance = FastifyInstance,
> implements Injectable<F>
{
  table: IdentifierSqlObj;
  columns: ColumnsSqlObject;
  columnMap: Record<keyof S['properties'], ReturnType<typeof sql.identifier>>;

  protected query!: F['database']['query'];
  protected database!: F['database'];
  protected where: (filters: Static<W>, throwOnEmpty?: boolean) => WhereSqlObj;

  protected static sql = sql;

  protected static firstRow<T>(res: QueryResult<T>) {
    switch (res.rowCount) {
      case 1: {
        return res.rows[0];
      }
      case 0: {
        throw new errors.NotFound('[database query] - expected one row, got none');
      }
      default: {
        throw new errors.InternalServerError('[database query] - expected one row, got ' + res.rowCount);
      }
    }
  }

  protected static maybeFirstRow<T>(res: QueryResult<T>) {
    if (res.rowCount <= 1) {
      return res.rows[0];
    }
    throw new errors.InternalServerError('[database query] - expected one row, got ' + res.rowCount);
  }

  protected static rowCount(res: QueryResult) {
    return res.rowCount;
  }

  protected static allRows<T>(res: QueryResult<T>) {
    return res.rows;
  }

  constructor(schema: S, where: WhereSchema<W>) {
    if (!schema.column) {
      throw new TypeError(
        'Repository ' + this.constructor.name + ' provided with table schema with no "table" property',
      );
    }
    const tableInfo = getTableInfo(schema);
    this.where = getWhereBuilder(where);
    this.table = tableInfo.table;
    this.columns = tableInfo.columns;
    this.columnMap = tableInfo.columnMap;
  }

  inject(app: F) {
    this.database = app.database;
    this.query = app.database.query;
  }
}

export abstract class Service<R extends Repository<never, never, F>, F extends FastifyInstance = FastifyInstance>
  implements Injectable<F>
{
  protected log!: F['log'];
  protected domains!: F['domains'];
  protected repository!: R;
  protected database!: F['database'];

  constructor() {
    //
  }

  inject(app: F) {
    this.database = app.database;
    this.log = app.log.child({ service: this.constructor.name });
    this.domains = app.domains;
  }

  setRepository(repository: R) {
    this.repository = repository;
  }
}

export abstract class Domain<
  S extends Service<R, F>,
  R extends Repository<never, never, F>,
  F extends FastifyInstance = FastifyInstance,
> implements Injectable<F>
{
  constructor(public service: S, public repository: R) {}

  inject(app: F) {
    this.service.inject(app);
    this.repository.inject(app);
    this.service.setRepository(this.repository);
  }
}

type WhereSchema<WhereObject extends TObject<TProperties>> = {
  [K in keyof WhereObject['properties']]: (
    value: Exclude<Static<WhereObject[K]>, undefined>,
    where: WhereSqlObj,
  ) => void;
};

interface Injectable<F extends FastifyInstance> {
  inject(app: F): void;
}
