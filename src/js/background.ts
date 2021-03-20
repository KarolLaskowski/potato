import { BadgeColors, TabStatus } from './enums';
import Badge from './badge';
import Helpers from './helpers';
import { Consts, TimeStamp } from './common';
import { PageHelper, PageVisit } from './pages';

export let indexSeconds: number = 0;
export let pages: any = {};
let badgeRefreshInterval: number;

function getPages(): any {
  return pages || {};
}

function getIndexSeconds(): number {
  return indexSeconds || 0;
}

function getPageSpentTime(domain: string): number {
  if (
    Helpers.isDomainValid(domain) &&
    !!pages[domain] &&
    !!pages[domain].visits.length
  ) {
    return pages[domain].getSpentTime();
  }
  return 0;
}

function getHistoryTable(): void {
  const domains = Object.entries(pages);
  // console.table(
  //   domains.flatMap(domain => [
  //     {
  //       domain: domain[0],
  //       visit: domain[1].visits,
  //     },
  //   ])
  // );
}

function initAllTabs(allTabs: Array<any>): void {
  allTabs.forEach(tab => {
    const domain = Helpers.urlToDomain(tab.url);
    const firstOpenedPage = PageHelper.addPage(pages, domain);
    if (!!firstOpenedPage && tab.selected) {
      const currentTime = new Date();
      PageHelper.initPageVisits(firstOpenedPage, currentTime);
    }
  });
}

function processChangeOfTab(selectedTab: any): void {
  const domain = Helpers.urlToDomain(selectedTab.url);
  const status = selectedTab.status;
  PageHelper.finishAndStartPageVisits(pages, domain, status);
  badgeRefreshInterval = Badge.resetBadge(badgeRefreshInterval, indexSeconds);
}

function onTabActivated(activeInfo: any): void {
  chrome.tabs.get(activeInfo.tabId, selectedTab => {
    processChangeOfTab(selectedTab);
  });
}

function onTabUpdated(tabId: number, changeInfo: any, tab: any): void {
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
  setTabEventListeners();
  initBadge();
  badgeRefreshInterval = Badge.resetBadge(badgeRefreshInterval, indexSeconds);

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
    getHistoryTable(): void;
  }
}

if (process.env.NODE_ENV !== 'production') {
  // for easy debugging
  window.getPages = getPages;
  window.getIndexSeconds = getIndexSeconds;
  window.getPageSpentTime = getPageSpentTime;
  window.getHistoryTable = getHistoryTable;
}
