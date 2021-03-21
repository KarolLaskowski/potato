import { TimeStamp } from './common';
import Helpers from './helpers';
import { Page } from './pages';
import PagesStore from './pagesStore';

let pagesStore: PagesStore = new PagesStore();

interface IPageAndSpentTime {
  nr: number;
  domain: string;
  spentTime: TimeStamp;
}

async function getPagesWithVisits() {
  const pages: any = await pagesStore.all();
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

function createCell(value: string): HTMLElement {
  const $td: HTMLTableCellElement = document.createElement('td');
  $td.innerText = value;
  return $td;
}

function createRow(dataRow: IPageAndSpentTime): HTMLElement {
  const $row: HTMLTableRowElement = document.createElement('tr');
  $row.appendChild(createCell(dataRow.nr.toString()));
  $row.appendChild(createCell(dataRow.domain));
  $row.appendChild(
    createCell(Helpers.timestampToLongString(dataRow.spentTime))
  );
  return $row;
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
      $tbody.appendChild(createRow(data[i]));
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
