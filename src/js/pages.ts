import Helpers from './helpers';
import { TabStatus } from './enums';

class PageVisit {
  from: Date;
  to: Date;
  status: TabStatus;
  tabIndex: number;
  sum: number;

  constructor(
    from: Date,
    to: Date,
    status: TabStatus,
    tabIndex: number,
    sum: number = 0
  ) {
    this.from = from;
    this.to = to;
    this.status = status;
    this.tabIndex = tabIndex;
    this.sum = sum;
  }
}

class Page {
  visits: Array<PageVisit>;

  constructor() {
    this.visits = [];
  }
}

function addDomainAsPage(pages: any, domain: string): Page {
  pages[domain] = new Page();
  return pages[domain];
}

function finishSingleVisit(finishTime: Date, visit: PageVisit): void {
  if (!visit.to) {
    visit.to = finishTime;
    visit.sum = visit.to.getTime() - visit.from.getTime();
  }
}

function finishPageVisits(pages: any, finishTime: Date): void {
  const domains = Object.keys(pages);
  domains.forEach(domain => {
    pages[domain].visits.forEach(finishSingleVisit.bind(null, finishTime));
  });
}

function startPageVisit(
  page: Page,
  startTime: Date,
  type: TabStatus = TabStatus.Complete,
  tabIndex: number = null
): void {
  if (!!page) {
    page.visits.push(new PageVisit(startTime, null, type, tabIndex));
  }
}

function startPageVisits(
  pages: any,
  domain: string,
  pageChangedTime: Date,
  type: TabStatus = TabStatus.Complete,
  tabIndex: number = null
): void {
  const page = addPage(pages, domain);
  startPageVisit(page, pageChangedTime, type, tabIndex);
}

function finishAndStartPageVisits(
  pages: any,
  domain: string,
  type: TabStatus = TabStatus.Complete,
  tabIndex: number = null
): void {
  const pageChangedTime = new Date();
  finishPageVisits(pages, pageChangedTime);
  startPageVisits(pages, domain, pageChangedTime, type, tabIndex);
}

function initPageVisits(page: any, currentTime: Date): void {
  startPageVisit(page, currentTime);
}

function addPage(pages: any, domain: string): Page {
  let page = null;
  if (Helpers.isDomainValid(domain)) {
    page = pages[domain];
    if (!page) {
      page = addDomainAsPage(pages, domain);
    }
  }
  return page;
}

const PageHelper = {
  initPageVisits,
  addPage,
  finishAndStartPageVisits,
};

export { PageHelper, Page, PageVisit };
