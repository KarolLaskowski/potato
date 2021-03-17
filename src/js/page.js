"use strict";

import Helpers from "./helpers.js";

class PageVisit {
  constructor(from, to, type, tabIndex) {
    this.from = from;
    this.to = to;
    this.type = type;
    this.tabIndex = tabIndex;
  }
}

function addDomainAsPage(pages, domain) {
  pages[domain] = {
    visits: [],
  };
  return pages[domain];
}

function finishSingleVisit(finishTime, visit) {
  if (!visit.to) {
    visit.to = finishTime;
    visit.sum = visit.to - visit.from;
  }
}

function finishPageVisits(pages, finishTime) {
  const domains = Object.keys(pages);
  domains.forEach((domain) => {
    pages[domain].visits.forEach(finishSingleVisit.bind(null, finishTime));
  });
}

function startPageVisit(page, startTime, type, tabIndex) {
  if (!!page) {
    page.visits.push({
      from: startTime,
      to: null,
      type: type,
      tabIndex: tabIndex,
    });
  }
}

function startPageVisits(pages, domain, pageChangedTime, type, tabIndex) {
  const page = addPage(pages, domain);
  startPageVisit(page, pageChangedTime, type, tabIndex);
}

function finishAndStartPageVisits(pages, domain, type, tabIndex) {
  const pageChangedTime = new Date();
  finishPageVisits(pages, pageChangedTime);
  startPageVisits(pages, domain, pageChangedTime, type, tabIndex);
}

function initPageVisits(page, currentTime) {
  startPageVisit(page, currentTime);
}

function addPage(pages, domain) {
  let page = null;
  if (Helpers.isDomainValid(domain)) {
    page = pages[domain];
    if (!page) {
      page = addDomainAsPage(pages, domain);
    }
  }
  return page;
}

const Page = {
  PageVisit,
  initPageVisits,
  addPage,
  finishAndStartPageVisits,
};

export default Page;
