import { IDomainTimePair, SubmitEvent } from './types/types';
import Config from './config';
import TableHelper from './helpers/tableHelper';
import OptionsStore from './stores/optionsStore';
import '../scss/options.scss';
import { TableData } from './types/types';
import { StoreKeys, TableSchemas } from './types/consts';
import {
  addConfiguredPage,
  mapConfiguredPageToTableRowData,
  removeConfiguredPage,
} from './options/pagesTables';

let $tabButtons: Array<HTMLElement>;
let $tabs: Array<HTMLElement>;
let $dashboardTable: HTMLTableElement;
let $blockedPagesForm: HTMLFormElement;
let $blockedPagesTableBody: HTMLElement;
let $newBlockedPageUrl: HTMLInputElement;
let $newBlockedPageTimeLimit: HTMLInputElement;
let $allowedPagesForm: HTMLFormElement;
let $allowedPagesTableBody: HTMLElement;
let $newAllowedPageUrl: HTMLInputElement;

let optionsStore: OptionsStore;

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
  $allowedPagesForm = <HTMLFormElement>(
    Array.from(document.querySelectorAll('form#allowed-pages--form'))[0]
  );
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

function selectTabButton(
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
  selectTabButton($clickedBtn, $tabButtons);
  const tabId: string = $clickedBtn.getAttribute('data-for');
  selectTab(tabId, $tabs);
}

function initTabButtons(): void {
  for (let i = 0; i < $tabButtons.length; i++) {
    $tabButtons[i].addEventListener('click', openTab);
  }
}

function addBlockedPage(e: SubmitEvent) {
  e.preventDefault();
  addConfiguredPage(
    optionsStore,
    StoreKeys.BlockedPages,
    $blockedPagesTableBody,
    TableSchemas.BlockedPages,
    $newBlockedPageUrl,
    $newBlockedPageTimeLimit
  );
}

function addAllowedPage(e: SubmitEvent) {
  e.preventDefault();
  addConfiguredPage(
    optionsStore,
    StoreKeys.AllowedPages,
    $allowedPagesTableBody,
    TableSchemas.AllowedPages,
    $newAllowedPageUrl,
    null
  );
}

async function removeBlockedPage(e: MouseEvent) {
  const $button: HTMLButtonElement = e.target as HTMLButtonElement;
  if ($button && $button.classList.contains('delete')) {
    removeConfiguredPage(optionsStore, StoreKeys.BlockedPages, $button);
  }
}

async function removeAllowedPage(e: MouseEvent) {
  const $button: HTMLButtonElement = e.target as HTMLButtonElement;
  if ($button && $button.classList.contains('delete')) {
    removeConfiguredPage(optionsStore, StoreKeys.AllowedPages, $button);
  }
}

async function renderDashboardTable() {
  const tableData: TableData = await Config.getPagesWithVisits();

  TableHelper.addRowsToTable(
    $dashboardTable,
    TableSchemas.DashboardPage,
    tableData
  );
}

async function renderBlockedPagesTable() {
  const blockedPages: Array<IDomainTimePair> = ((await optionsStore.getOption(
    StoreKeys.BlockedPages
  )) || []) as Array<IDomainTimePair>;
  const blockedPagesData: TableData = mapConfiguredPageToTableRowData(
    blockedPages
  );
  TableHelper.addRowsToTable(
    $blockedPagesTableBody,
    TableSchemas.BlockedPages,
    blockedPagesData
  );
}

async function renderAllowedPagesTable() {
  const allowedPages: Array<IDomainTimePair> = ((await optionsStore.getOption(
    StoreKeys.AllowedPages
  )) || []) as Array<IDomainTimePair>;
  const allowedPagesData: TableData = mapConfiguredPageToTableRowData(
    allowedPages
  );
  TableHelper.addRowsToTable(
    $allowedPagesTableBody,
    TableSchemas.AllowedPages,
    allowedPagesData
  );
}

function onOptionsPageLoaded(): void {
  optionsStore = new OptionsStore();
  initHtmlElements();
  initTabButtons();
  renderDashboardTable();
  renderBlockedPagesTable();
  renderAllowedPagesTable();
  $blockedPagesForm.addEventListener('click', removeBlockedPage);
  $allowedPagesForm.addEventListener('click', removeAllowedPage);
  $blockedPagesForm.addEventListener('submit', addBlockedPage);
  $allowedPagesForm.addEventListener('submit', addAllowedPage);
}

document.addEventListener('DOMContentLoaded', onOptionsPageLoaded, false);
