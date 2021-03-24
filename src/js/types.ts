import { TableColumnType } from './enums';

interface IPageAndSpentTime {
  nr: number;
  domain: string;
  spentTime?: TimeStamp;
}

interface ITableColumnSchema {
  value?: string;
  type?: TableColumnType;
  class?: string;
}

interface SubmitEvent extends Event {
  submitter: HTMLElement;
}

interface IKeyValueObject {
  [key: string]: object;
}

interface IStore {
  get(key: string): Promise<IKeyValueObject>;
  save(newStoreData: IKeyValueObject): void;
  count(): number;
}

interface IDomainTimePair {
  domain: string;
  time: number;
}

interface Action<T> {
  (item: T): void;
}

interface Func<T, TResult> {
  (item: T): TResult;
}

type TimeStamp = number;

type TableRowData = Array<string>;

type TableData = Array<TableRowData>;

type TableSchema = Array<ITableColumnSchema>;

export {
  IPageAndSpentTime,
  ITableColumnSchema,
  SubmitEvent,
  IStore,
  IKeyValueObject,
  IDomainTimePair,
  Action,
  Func,
  TimeStamp,
  TableRowData,
  TableData,
  TableSchema,
};
