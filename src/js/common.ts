const Consts = {
  badgeRefreshIntervalTimeInMs: 1000,
};

type TimeStamp = number;

interface IPageAndSpentTime {
  nr: number;
  domain: string;
  spentTime?: TimeStamp;
}

enum TableColumnType {
  DeleteButton,
  Text,
}

interface ITableColumnSchema {
  value?: string;
  type?: TableColumnType;
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

interface IBlockedPage {
  domain: string;
  timeLimit: number;
}

interface IAllowedPage {
  domain: string;
}

interface Action<T> {
  (item: T): void;
}

interface Func<T, TResult> {
  (item: T): TResult;
}

export {
  Consts,
  TimeStamp,
  IPageAndSpentTime,
  TableColumnType,
  ITableColumnSchema,
  SubmitEvent,
  IStore,
  IKeyValueObject,
  IBlockedPage,
  IAllowedPage,
  Action,
  Func,
};
