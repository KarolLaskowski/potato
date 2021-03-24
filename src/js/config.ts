import {
  IDomainTimePair,
  IKeyValueObject,
  TableData,
  TableRowData,
  TimeStamp,
} from './types';
import { IPageAndSpentTime, ITableColumnSchema } from './types';
import Helpers from './helpers';
import PagesStore from './pagesStore';
import TableHelper from './tableHelper';
import { Page } from './pages';

let pagesStore: PagesStore = new PagesStore();

async function getPagesWithVisits() {
  const pages: IKeyValueObject = await pagesStore.get();
  const domains: Array<string> = Object.keys(pages);
  const now: TimeStamp = new Date().getTime();
  const pagesArray: Array<IDomainTimePair> = domains.map(
    (domain: string): IDomainTimePair => {
      return {
        domain,
        time: (pages[domain] as Page).getTotalSpentTime(now),
      };
    }
  );
  return pagesArray
    .sort((a, b) => a.time - b.time)
    .reverse()
    .map(p => {
      return [p.domain, Helpers.timestampToLongString(p.time)];
    });
}

// function fillTableWithData(
//   $table: Element,
//   data: Array<IPageAndSpentTime>
// ): void {
//   if (!$table) {
//     throw TypeError('Table element not found');
//   }
//   const $tbodyCollection: HTMLCollection = $table.getElementsByTagName('tbody');
//   if ($tbodyCollection) {
//     const $tbody = $tbodyCollection.item(0);
//     $tbody.innerHTML = '';
//     for (let i = 0; i < data.length; i++) {
//       const rowData: Array<ITableColumnSchema> = [
//         { value: data[i].nr.toString() },
//         { value: data[i].domain },
//         { value: Helpers.timestampToLongString(data[i].spentTime) },
//       ];
//       $tbody.appendChild(TableHelper.createRow(rowData));
//     }
//   }
// }

const Config = {
  getPagesWithVisits,
  // DOM: {
  //   fillTableWithData,
  // },
};

export default Config;
