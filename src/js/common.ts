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

export {
  Consts,
  TimeStamp,
  IPageAndSpentTime,
  TableColumnType,
  ITableColumnSchema,
  SubmitEvent,
};
