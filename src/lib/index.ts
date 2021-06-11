import errors from '@heviir/http-errors';
import sql, { WhereSqlObj } from '@heviir/pg-template-string';
import { TObject, TProperties, Type } from '@sinclair/typebox';
import { QueryResult } from 'pg';

export function whereBuilder<W extends Record<string, W[keyof W]>>(
  whereSchema: {
    [Key in keyof W]: (value: Exclude<W[Key], undefined>, where: WhereSqlObj) => void;
  },
) {
  return (filters: W, throwOnEmpty = true) => {
    const where = sql.where();
    for (const key of Object.keys(filters)) {
      if (filters[key] === undefined) {
        continue;
      }
      whereSchema[<keyof W>key]?.(<Exclude<W[keyof W], undefined>>filters[key], where);
    }
    if (throwOnEmpty && where.isEmpty) {
      throw new errors.Forbidden();
    }
    return where;
  };
}

export function firstRow<T>(res: QueryResult<T>) {
  switch (res.rowCount) {
    case 1: {
      return res.rows[0];
    }
    case 0: {
      throw new errors.NotFound('expected one row, got none');
    }
    default: {
      throw new errors.InternalServerError('expected one row, got ' + res.rowCount);
    }
  }
}

export function maybeFirstRow<T>(res: QueryResult<T>) {
  if (res.rowCount <= 1) {
    return res.rows[0];
  }
  throw new errors.InternalServerError('expected one row, got ' + res.rowCount);
}

export function rowCount<T>(res: QueryResult<T>) {
  return res.rowCount;
}

export function allRows<T>(res: QueryResult<T>) {
  return res.rows;
}

export enum OrderDirection {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
}

export const orderDirection = {
  [OrderDirection.ASCENDING]: sql`ASC`,
  [OrderDirection.DESCENDING]: sql`DESC`,
};

export function columnAliasBuilder<T extends Record<string, string>>(aliasMap: T) {
  const translations = {
    ...aliasMap,
    ...invert(aliasMap),
  };
  return (column: string): string => translations[column] ?? column;
}

function invert<T extends Record<PropertyKey, PropertyKey>>(obj: T) {
  const inverted: Record<PropertyKey, PropertyKey> = {};
  for (const [key, value] of Object.entries(obj)) {
    inverted[<string>value] = key;
  }
  return <Invert<T>>inverted;
}

export function aliasColumns(columns: string[], columnMask: (col: string) => string) {
  return columns.map<string | [string, string]>(column => {
    const mask = columnMask(column);
    if (mask === column) {
      return column;
    }
    return [column, mask];
  });
}

type KeyFromValue<V, T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T]: V extends T[K] ? K : never;
}[keyof T];

type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [V in T[keyof T]]: KeyFromValue<V, T>;
};

export function getCamelCasedColumnAliasMap(keys: string[]) {
  return keys.reduce<Record<string, string>>((aliasMap, key) => {
    aliasMap[key] = toCamelCase(key);
    return aliasMap;
  }, {});
}

function toCamelCase(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

export const dbUtil = {
  OrderDirection,
  allRows,
  columnAliasBuilder,
  firstRow,
  aliasColumns,
  maybeFirstRow,
  rowCount,
  whereBuilder,
  getCamelCasedColumnAliasMap,
};

const listControlBase = {
  limit: Type.Optional(Type.Number()),
  offset: Type.Optional(Type.Number()),
  orderDirection: Type.Optional(Type.Enum(OrderDirection)),
} as const;

export function ListControl<T extends string>(orderByKeys: T[]) {
  return Type.Object({
    ...listControlBase,
    orderBy: Type.Optional(Type.Union(orderByKeys.map(key => Type.Literal(key)))),
  });
}

export function Keys<T extends TObject<TProperties>>(schema: T) {
  return <(keyof T['properties'])[]>Object.keys(schema.properties);
}

export const typeUtil = {
  ListControl,
  Keys,
};
