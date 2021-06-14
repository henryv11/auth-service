import { TObject, TProperties, Type } from '@sinclair/typebox';
import { OrderDirection } from './db-util';

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
