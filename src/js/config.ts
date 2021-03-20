import { TimeStamp } from './common';
import { Page } from './pages';

interface IPageAndSpentTime {
  nr: number;
  domain: string;
  spentTime: TimeStamp;
}

function getPagesWithVisits(pages: any) {
  const domains: Array<string> = Object.keys(pages);
  const now: TimeStamp = new Date().getTime();
  return domains.map(
    (domain: string): IPageAndSpentTime => {
      return {
        domain: domain,
        spentTime: pages[domain].getTotalSpentTime(now),
      } as IPageAndSpentTime;
    }
  );
}

function fillTableWithData(
  $table: HTMLElement,
  data: Array<IPageAndSpentTime>
): void {
  if ($table) {
    throw TypeError('Table element not found');
  }
  const $tbodyCollection: HTMLCollection = $table.getElementsByTagName('tbody');
  if ($tbodyCollection) {
    const $tbody = $tbodyCollection.item(0);
    $tbody.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
      const $row: HTMLTableRowElement = document.createElement('tr');
      const $tdId: HTMLTableCellElement = document.createElement('td');
      const $tdDomain: HTMLTableCellElement = document.createElement('td');
      const $tdTime: HTMLTableCellElement = document.createElement('td');

      $tdId.innerText = data[i].nr.toString();
      $tdDomain.innerText = data[i].domain;
      $tdTime.innerText = (data[i].spentTime / 1000).toString();

      $tbody.appendChild($row);
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
