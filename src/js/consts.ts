import { TableColumnType } from './enums';

const Consts = {
  badgeRefreshIntervalTimeInMs: 1000,
};

const TableSchemas = {
  BlockedPages: [
    {
      type: TableColumnType.Text,
      class: 'domain',
    },
    {
      type: TableColumnType.Text,
    },
    {
      type: TableColumnType.DeleteButton,
    },
  ],
  AllowedPages: [
    {
      type: TableColumnType.Text,
      class: 'domain',
    },
    {
      type: TableColumnType.DeleteButton,
    },
  ],
  DashboardPage: [
    { type: TableColumnType.Text },
    { type: TableColumnType.Text },
  ],
};

export { Consts, TableSchemas };
