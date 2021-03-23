import {
  IBlockedPage,
  IKeyValueObject,
  ITableColumnSchema,
  SubmitEvent,
  TableColumnType,
} from './common';
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

async function addBlockedPage(e: SubmitEvent) {
  e.preventDefault();
  const domain: string = $newBlockedPageUrl.value;
  const timeLimit: number = Number($newBlockedPageTimeLimit.value);
  const blockedPages: Array<IBlockedPage> = (await optionsStore.getOption(
    'blockedPages'
  )) as Array<IBlockedPage>;
  if ($blockedPagesTableBody) {
    const rowData: Array<ITableColumnSchema> = [
      { value: domain },
      { value: timeLimit.toString() },
      { value: '', type: TableColumnType.DeleteButton },
    ];
    $blockedPagesTableBody.insertBefore(
      TableHelper.createRow(rowData),
      $blockedPagesTableBody.querySelectorAll('tr:last-child')[0]
    );
  }
  blockedPages.push({ domain, timeLimit });
  await optionsStore.setOption('blockedPages', blockedPages);
}

async function removeBlockedPage(e: MouseEvent) {
  const $button: HTMLButtonElement = e.target as HTMLButtonElement;
  if ($button && $button.classList.contains('delete')) {
    const $parentRow = $button.closest('tr');
    const domain: string = ($parentRow.getElementsByClassName(
      'domain'
    )[0] as HTMLElement).innerText;
    //const  = $button.getAttribute('data-id');
    $parentRow.remove();
    const blockedPages: Array<IBlockedPage> = (await optionsStore.getOption(
      'blockedPages'
    )) as Array<IBlockedPage>;
    var removeIndex = blockedPages
      .map(function (item) {
        return item.domain;
      })
      .indexOf(domain);
    blockedPages.splice(removeIndex, 1);
    await optionsStore.setOption('blockedPages', blockedPages);
  }
}

function onOptionsPageLoaded(): void {
  optionsStore = new OptionsStore();
  pagesStore = new PagesStore();
  initHtmlElements();
  initTabButtons();
  renderDashboardTable();
  $blockedPagesForm.addEventListener('click', removeBlockedPage);
  $blockedPagesForm.addEventListener('submit', addBlockedPage);
}

document.addEventListener('DOMContentLoaded', onOptionsPageLoaded, false);
