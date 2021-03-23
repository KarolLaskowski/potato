import {
  IPageAndSpentTime,
  ITableColumnSchema,
  TableColumnType,
  TimeStamp,
} from './common';
import Helpers from './helpers';
import { Page } from './pages';
import PagesStore from './pagesStore';
import TableHelper from './tableHelper';

let pagesStore: PagesStore = new PagesStore();

async function getPagesWithVisits() {
  const pages: any = await pagesStore.get();
  const domains: Array<string> = Object.keys(pages);
  const now: TimeStamp = new Date().getTime();
  return domains
    .map(
      (domain: string, i: number): IPageAndSpentTime => {
        return {
          nr: i,
          domain: domain,
          spentTime: pages[domain].getTotalSpentTime(now),
        } as IPageAndSpentTime;
      }
    )
    .sort((a, b) => a.spentTime - b.spentTime)
    .reverse();
}

function fillTableWithData(
  $table: Element,
  data: Array<IPageAndSpentTime>
): void {
  if (!$table) {
    throw TypeError('Table element not found');
  }
  const $tbodyCollection: HTMLCollection = $table.getElementsByTagName('tbody');
  if ($tbodyCollection) {
    const $tbody = $tbodyCollection.item(0);
    $tbody.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
      const rowData: Array<ITableColumnSchema> = [
        { value: data[i].nr.toString() },
        { value: data[i].domain },
        { value: Helpers.timestampToLongString(data[i].spentTime) },
      ];
      $tbody.appendChild(TableHelper.createRow(rowData));
    }
  }
}

const Config = {
  getPagesWithVisits,
  DOM: {
    fillTableWithData,
  },
};

export default Config;
