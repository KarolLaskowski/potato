import { BadgeColors, TabStatus } from './enums';
import Badge from './badge';
import Helpers from './helpers';
import { Consts, TimeStamp } from './common';
import { Page, PageHelper, PageVisit } from './pages';
import Config from './config';
import PagesStore from './pagesStore';
import { Sync } from './storage';

export let indexSeconds: number = 0;
let badgeRefreshInterval: number;
let pagesStore: PagesStore;

function getPages(): any {
  return pagesStore.all();
}

function getIndexSeconds(): number {
  return indexSeconds || 0;
}

function getPageSpentTime(domain: string): number {
  const pages: any = pagesStore.all();
  if (
    Helpers.isDomainValid(domain) &&
    !!pages[domain] &&
    !!pages[domain].visits.length
  ) {
    return pages[domain].getTotalSpentTime();
  }
  return 0;
}

function getHistoryLog(): void {
  console.table(Config.getPagesWithVisits());
}

function initAllTabs(allTabs: Array<any>): void {
  const pages: object = {};
  allTabs.forEach(tab => {
    const domain = Helpers.urlToDomain(tab.url);
    const firstOpenedPage = PageHelper.addPage(pages, domain);
    if (!!firstOpenedPage && tab.selected) {
      const currentTime = new Date();
      PageHelper.initPageVisits(firstOpenedPage, currentTime);
    }
  });
  pagesStore.save(pages);
}

async function processChangeOfTab(selectedTab: chrome.tabs.Tab) {
  const pageChangedTime: Date = new Date();
  const pages: any = await pagesStore.all();
  PageHelper.finishPageVisits(pages, pageChangedTime);
  let spentTimeOnNewTab: TimeStamp = 0;
  if (
    !!selectedTab &&
    !!selectedTab.url &&
    !Helpers.tabIsChromeExtensions(selectedTab)
  ) {
    const domain: string = Helpers.urlToDomain(selectedTab.url);
    const status: TabStatus = (<any>TabStatus)[selectedTab.status];
    PageHelper.startPageVisits(pages, domain, pageChangedTime, status);
    spentTimeOnNewTab = pages[domain]
      ? pages[domain].getTotalSpentTime(pageChangedTime)
      : 0;
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
    getPageSpentTime(domain: string): number;
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
