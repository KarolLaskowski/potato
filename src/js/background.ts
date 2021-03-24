import { BadgeColors, TabStatus } from './types/enums';
import Badge from './badge';
import Helpers from './helpers/helpers';
import { IKeyValueObject, TimeStamp } from './types/types';
import { PageHelper } from './pages';
import Config from './config';
import PagesStore from './stores/pagesStore';
import { Sync } from './stores/storage';
import { Page } from './types/classes/page';

export let indexSeconds: number = 0;
let badgeRefreshInterval: number;
let pagesStore: PagesStore;

function getPages(): Promise<IKeyValueObject> {
  return pagesStore.get();
}

function getIndexSeconds(): number {
  return indexSeconds || 0;
}

async function getPageSpentTime(domain: string) {
  const pages: IKeyValueObject = await pagesStore.get();
  if (Helpers.isDomainValid(domain) && !!pages[domain]) {
    const page: Page = pages[domain] as Page;
    if (!!page.visits && page.visits.length) {
      return page.getTotalSpentTime();
    }
    return 0;
  }
}

function getHistoryLog(): void {
  console.table(Config.getPagesWithVisits());
}

function initAllTabs(allTabs: Array<chrome.tabs.Tab>): void {
  const pages: IKeyValueObject = {};
  allTabs.forEach((tab: chrome.tabs.Tab) => {
    const domain: string = Helpers.urlToDomain(tab.url);
    const firstOpenedPage: Page = PageHelper.addPage(pages, domain);
    if (!!firstOpenedPage && tab.highlighted) {
      const currentTime: Date = new Date();
      PageHelper.initPageVisits(firstOpenedPage, currentTime);
    }
  });
  pagesStore.save(pages);
}

function tabCanBeRegistered(selectedTab: chrome.tabs.Tab): boolean {
  return (
    !!selectedTab &&
    !!selectedTab.url &&
    !Helpers.tabIsChromeExtensions(selectedTab)
  );
}

function registerTab(
  selectedTab: chrome.tabs.Tab,
  pages: IKeyValueObject,
  pageChangedTime: Date
) {
  const domain: string = Helpers.urlToDomain(selectedTab.url);
  const status: TabStatus = (<any>TabStatus)[selectedTab.status];
  PageHelper.startPageVisits(pages, domain, pageChangedTime, status);
  const pageToVisit: Page = pages[domain] as Page;
  return pageToVisit
    ? pageToVisit.getTotalSpentTime(pageChangedTime.getTime())
    : 0;
}

async function processChangeOfTab(selectedTab: chrome.tabs.Tab) {
  const pageChangedTime: Date = new Date();
  const pages: IKeyValueObject = await pagesStore.get();
  PageHelper.finishPageVisits(pages, pageChangedTime);
  let spentTimeOnNewTab: TimeStamp = 0;
  if (tabCanBeRegistered(selectedTab)) {
    spentTimeOnNewTab = registerTab(selectedTab, pages, pageChangedTime);
  }
  badgeRefreshInterval = Badge.resetBadgeAndTimer(
    badgeRefreshInterval,
    spentTimeOnNewTab
  );
  await pagesStore.save(pages);
}

function onTabActivated(activeInfo: chrome.tabs.TabActiveInfo): void {
  chrome.tabs.get(activeInfo.tabId, selectedTab => {
    processChangeOfTab(selectedTab);
  });
}

function onTabUpdated(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
): void {
  processChangeOfTab(tab);
}

function initBadge(): void {
  chrome.browserAction.setBadgeBackgroundColor({
    color: BadgeColors.Unblocked,
  });
}

function setTabEventListeners(): void {
  chrome.tabs.onActivated.addListener(onTabActivated);
  chrome.tabs.onUpdated.addListener(onTabUpdated);
}

function init(): void {
  pagesStore = new PagesStore();
  setTabEventListeners();
  initBadge();
  badgeRefreshInterval = Badge.resetBadgeAndTimer(badgeRefreshInterval);

  chrome.tabs.query(
    {
      currentWindow: true,
    },
    tabs => {
      initAllTabs(tabs);
    }
  );
}

init();

declare global {
  interface Window {
    getPages(): any;
    getIndexSeconds(): number;
    getPageSpentTime(domain: string): Promise<number>;
    getHistoryLog(): void;
    set(key: string, value: any): Promise<unknown>;
    get(key: string): Promise<unknown>;
    pagesStore: PagesStore;
  }
}

if (process.env.NODE_ENV !== 'production') {
  // for easy debugging
  window.getPages = getPages;
  window.getIndexSeconds = getIndexSeconds;
  window.getPageSpentTime = getPageSpentTime;
  window.getHistoryLog = getHistoryLog;
  window.set = Sync.set;
  window.get = Sync.get;
  window.pagesStore = pagesStore;
}
