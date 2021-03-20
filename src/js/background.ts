import { BadgeColors, TabStatus } from './enums';
import Badge from './badge';
import Helpers from './helpers';
import { Consts, TimeStamp } from './common';
import { PageHelper, PageVisit } from './pages';
import Config from './config';

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

function getHistoryLog(): void {
  console.table(Config.getPagesWithVisits(pages));
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

function processChangeOfTab(selectedTab: chrome.tabs.Tab): void {
  if (!Helpers.tabIsChromeExtensions(selectedTab)) {
    const domain: string = Helpers.urlToDomain(selectedTab.url);
    const status: TabStatus = (<any>TabStatus)[selectedTab.status];
    PageHelper.finishAndStartPageVisits(pages, domain, status);
    badgeRefreshInterval = Badge.resetBadge(badgeRefreshInterval, indexSeconds);
  }
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
    getHistoryLog(): void;
  }
}

if (process.env.NODE_ENV !== 'production') {
  // for easy debugging
  window.getPages = getPages;
  window.getIndexSeconds = getIndexSeconds;
  window.getPageSpentTime = getPageSpentTime;
  window.getHistoryLog = getHistoryLog;
}
