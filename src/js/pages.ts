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

  finish = (finishTime: Date): void => {
    if (!this.to) {
      this.to = finishTime;
      this.sum = this.to.getTime() - this.from.getTime();
    }
  };
}

class Page {
  visits: Array<PageVisit>;

  constructor() {
    this.visits = [];
  }

  getTotalSpentTime = (): number => {
    if (this.visits.length) {
      const now = new Date().getTime();
      const reducingTimes = (acc: number, item: PageVisit, i: number) => {
        return acc + (!!item.to ? item.sum : now - item.from.getTime());
      };
      return this.visits.reduce(reducingTimes, 0);
    }
    return 0;
  };

  finishVisits = (finishTime: Date): void => {
    this.visits.forEach((visit: PageVisit) => visit.finish(finishTime));
  };

  startVisit = (
    startTime: Date,
    type: TabStatus = TabStatus.Complete,
    tabIndex: number = null
  ): void => {
    this.visits.push(new PageVisit(startTime, null, type, tabIndex));
  };
}

function addDomainAsPage(pages: any, domain: string): Page {
  pages[domain] = new Page();
  return pages[domain];
}

function startPageVisits(
  pages: any,
  domain: string,
  pageChangedTime: Date,
  type: TabStatus = TabStatus.Complete,
  tabIndex: number = null
): void {
  const page = addPage(pages, domain);
  if (page) {
    page.startVisit(pageChangedTime, type, tabIndex);
  }
}

function finishPageVisits(pages: any, finishTime: Date): void {
  const domains = Object.keys(pages);
  domains.forEach(domain => {
    pages[domain].finishVisits(finishTime);
  });
}

function finishAndStartPageVisits(
  pages: any,
  domain: string,
  type: TabStatus = TabStatus.Complete,
  tabIndex: number = null
): void {
  const pageChangedTime: Date = new Date();
  finishPageVisits(pages, pageChangedTime);
  startPageVisits(pages, domain, pageChangedTime, type, tabIndex);
}

function initPageVisits(page: any, currentTime: Date): void {
  page.startVisit(currentTime);
}

function addPage(pages: any, domain: string): Page {
  let page: Page = null;
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
  startPageVisits,
  finishPageVisits,
};

export { PageHelper, Page, PageVisit };
