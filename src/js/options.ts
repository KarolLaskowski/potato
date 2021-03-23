import { TabStatus } from './enums';
import Helpers from './helpers';
import {
  Consts,
  ITableColumnSchema,
  SubmitEvent,
  TableColumnType,
  TimeStamp,
} from './common';
import { PageHelper, PageVisit } from './pages';
import Config from './config';
import TableHelper from './tableHelper';
import OptionsStore from './optionsStore';
import '../scss/options.scss';
import PagesStore from './pagesStore';

let $tabButtons: Array<HTMLElement>;
let $tabs: Array<HTMLElement>;
let $dashboardTable: HTMLTableElement;
let $blockedPagesForm: HTMLFormElement;
let $blockedPagesTableBody: HTMLElement;
let $newBlockedPageUrl: HTMLInputElement;
let $newBlockedPageTimeLimit: HTMLInputElement;
let $allowedPagesTableBody: HTMLElement;
let $newAllowedPageUrl: HTMLInputElement;

let optionsStore: OptionsStore;
let pagesStore: PagesStore;

function initDashboardHtmlElements(): void {
  $dashboardTable = <HTMLTableElement>(
    document.querySelectorAll('#pages').item(0)
  );
  if (!$dashboardTable) {
    throw TypeError('Elements missing on Dashboard tab!');
  }
}

function initBlockedPagesHtmlElements(): void {
  $blockedPagesForm = <HTMLFormElement>(
    Array.from(document.querySelectorAll('form#blocked-pages--form'))[0]
  );
  $blockedPagesTableBody = <HTMLElement>(
    Array.from(
      $blockedPagesForm.querySelectorAll('table#blocked-pages tbody')
    )[0]
  );
  $newBlockedPageUrl = <HTMLInputElement>(
    Array.from($blockedPagesTableBody.querySelectorAll('#blocked-page--url'))[0]
  );
  $newBlockedPageTimeLimit = <HTMLInputElement>(
    Array.from(
      $blockedPagesTableBody.querySelectorAll('#blocked-page--limit')
    )[0]
  );
  if (
    !$blockedPagesTableBody ||
    !$newBlockedPageUrl ||
    !$newBlockedPageTimeLimit
  ) {
    throw TypeError('Elements missing on Blocked Pages tab!');
  }
}

function initAllowedPagesHtmlElements(): void {
  $allowedPagesTableBody = <HTMLElement>(
    Array.from(document.querySelectorAll('table#allowed-pages tbody'))[0]
  );
  $newAllowedPageUrl = <HTMLInputElement>(
    document.getElementById('allowed-page--url')
  );
  if (!$allowedPagesTableBody || !$newAllowedPageUrl) {
    throw TypeError('Elements missing on Blocked Pages tab!');
  }
}

function initHtmlElements(): void {
  $tabButtons = Array.from(document.querySelectorAll('div.tabs > ul > li'));
  $tabs = Array.from(document.querySelectorAll('div.tab'));
  initDashboardHtmlElements();
  initBlockedPagesHtmlElements();
  initAllowedPagesHtmlElements();
}

async function renderDashboardTable() {
  const data = await Config.getPagesWithVisits();
  Config.DOM.fillTableWithData($dashboardTable, data);
}

function selectButton(
  $clickedBtn: HTMLElement,
  $tabButtons: Array<HTMLElement>
): void {
  for (let i = 0; i < $tabButtons.length; i++) {
    $tabButtons[i].classList.remove('is-active');
  }
  $clickedBtn.classList.add('is-active');
}

function selectTab(tabId: string, $tabs: Array<HTMLElement>): void {
  for (let i = 0; i < $tabs.length; i++) {
    if ($tabs[i].id === tabId) {
      $tabs[i].classList.add('tab-visible');
    } else {
      $tabs[i].classList.remove('tab-visible');
    }
  }
}

function openTab(e: MouseEvent): void {
  e.preventDefault();
  const $clickedBtn: HTMLElement = this as HTMLElement;
  selectButton($clickedBtn, $tabButtons);
  const tabId: string = $clickedBtn.getAttribute('data-for');
  selectTab(tabId, $tabs);
}

function initTabButtons(): void {
  for (let i = 0; i < $tabButtons.length; i++) {
    $tabButtons[i].addEventListener('click', openTab);
  }
}

async function addBlockedPage() {
  const domain: string = $newBlockedPageUrl.value;
  const timeLimit: string = $newBlockedPageTimeLimit.value;
  const blockedPagesOptions: object = await optionsStore.get('blockedPages');
  if ($blockedPagesTableBody) {
    const rowData: Array<ITableColumnSchema> = [
      { value: domain },
      { value: timeLimit },
      { value: '', type: TableColumnType.DeleteButton },
    ];
    $blockedPagesTableBody.insertBefore(
      TableHelper.createRow(rowData),
      $blockedPagesTableBody.querySelectorAll('tr:last-child')[0]
    );
  }
}

function removeBlockedPage($button: HTMLButtonElement): void {
  const id = $button.getAttribute('data-id');
  $button.closest('tr').remove();
}

function editBlockedPages(e: SubmitEvent): void {
  e.preventDefault();
  const $button: HTMLButtonElement = e.submitter as HTMLButtonElement;
  if ($button.classList.contains('add')) {
    addBlockedPage();
  } else if ($button.classList.contains('delete')) {
    removeBlockedPage($button);
  }
}

function onOptionsPageLoaded(): void {
  optionsStore = new OptionsStore();
  pagesStore = new PagesStore();
  initHtmlElements();
  initTabButtons();
  renderDashboardTable();
  $blockedPagesForm.addEventListener('submit', editBlockedPages);
}

document.addEventListener('DOMContentLoaded', onOptionsPageLoaded, false);
