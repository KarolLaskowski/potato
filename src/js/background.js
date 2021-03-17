"use strict";

import { BadgeColors, TabStatus } from "./enums.js";
import Badge from "./badge.js";
import Helpers from "./helpers.js";
import Consts from "./consts.js";
import Rules from "./rule.js";
import Page from "./page.js";

export let indexSeconds = 0;
export let pages = {};
let badgeRefreshInterval;

function getPages() {
  return pages || {};
}

function getIndexSeconds() {
  return indexSeconds || 0;
}

function getPageSpentTime(domain) {
  if (
    Helpers.isDomainValid(domain) &&
    !!pages[domain] &&
    !!pages[domain].visits.length
  ) {
    const reducingTimes = (a, b) => {
      return a + (!!b.to ? b.sum : new Date() - b.from);
    };
    return new Date(pages[domain].visits.reduce(reducingTimes, 0));
  }
  return 0;
}

function getHistoryTable() {
  const domains = Object.keys(pages);
  console.table(domains.flatMap((domain) => pages[domain].visits));
}

function initAllTabs(allTabs) {
  allTabs.forEach((tab) => {
    const domain = Helpers.urlToDomain(tab.url);
    const firstOpenedPage = Page.addPage(pages, domain);
    if (!!firstOpenedPage && tab.selected) {
      const currentTime = new Date();
      Pages.initPageVisits(firstOpenedPage, currentTime);
    }
  });
}

function processChangeOfTab(selectedTab) {
  const domain = Helpers.urlToDomain(selectedTab.url);
  const status = selectedTab.status;
  Page.finishAndStartPageVisits(pages, domain, status);
  badgeRefreshInterval = Badge.resetBadge(badgeRefreshInterval, indexSeconds);
}

function onTabActivated(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, (selectedTab) => {
    processChangeOfTab(selectedTab);
  });
}

function onTabUpdated(tabId, changeInfo, tab) {
  processChangeOfTab(tab);
}

function initBadge() {
  chrome.browserAction.setBadgeBackgroundColor({
    color: BadgeColors.Unblocked,
  });
}

function setTabEventListeners() {
  chrome.tabs.onActivated.addListener(onTabActivated);
  chrome.tabs.onUpdated.addListener(onTabUpdated);
}

function init() {
  setTabEventListeners();
  initBadge();
  badgeRefreshInterval = Badge.resetBadge(badgeRefreshInterval, indexSeconds);

  chrome.tabs.query(
    {
      currentWindow: true,
    },
    (tabs) => {
      initAllTabs(tabs);
    }
  );
}

init();

/*
// for easy debugging
window.getPages = getPages;
window.getIndexSeconds = getIndexSeconds;
window.getPageSpentTime = getPageSpentTime;
window.getHistoryTable = getHistoryTable;
*/
