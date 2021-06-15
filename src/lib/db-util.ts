import errors from '@heviir/http-errors';
import sql, { ValidArg, WhereSqlObj } from '@heviir/pg-template-string';
import { QueryResult } from 'pg';

export function where<W extends Record<string, W[keyof W]>>(
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

export function table<C extends string>(rawTable: string, rawColumns: C[], getColumnAlias = toCamelCase) {
  const columnAlias = columnAliasBuilder(getAliasMap(rawColumns, getColumnAlias));
  const allColumns = sql.columns(aliasColumns(rawColumns, columnAlias));

  return {
    name: sql.identifier(rawTable),
    allColumns,
    columnAlias,
    columns(rawColumns: C[] | C | '*' = '*') {
      if (rawColumns === '*') {
        return allColumns;
      }
      return sql.columns(aliasColumns(Array.isArray(rawColumns) ? rawColumns : [rawColumns], columnAlias));
    },
    column: (rawColumn: C) => sql.identifier(columnAlias(rawColumn)),
    set(values: Partial<Record<C, ValidArg>>) {
      const aliasedValues: Partial<Record<string, ValidArg>> = {};
      for (const key of Object.keys(values)) {
        aliasedValues[columnAlias(key)] = values[<C>key];
      }
      return sql.set(aliasedValues);
    },
  };
}

function columnAliasBuilder<T extends Record<string, string>>(aliasMap: T) {
  Object.assign(aliasMap, invert(aliasMap));
  return (column: string): string => aliasMap[column] ?? column;
}

function aliasColumns(columns: string[], columnMask: (col: string) => string) {
  return columns.map<string | [string, string]>(column => {
    const mask = columnMask(column);
    if (mask === column) {
      return column;
    }
    return [column, mask];
  });
}

function getAliasMap<K extends string, A>(keys: K[], getAlias: (key: K) => A) {
  return keys.reduce((aliasMap, key) => {
    aliasMap[key] = getAlias(key);
    return aliasMap;
  }, <Record<K, A>>{});
}

function toCamelCase(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

function invert<T extends Record<string, string>>(obj: T) {
  const inverted: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    inverted[value] = key;
  }
  return <Record<T[keyof T], keyof T>>inverted;
}

export const dbUtil = {
  OrderDirection,
  allRows,
  firstRow,
  maybeFirstRow,
  orderDirection,
  rowCount,
  table,
  where,
};
