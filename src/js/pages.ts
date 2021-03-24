import Helpers from './helpers';
import { TabStatus } from './enums';
import { TimeStamp } from './types';

interface IPageVisit {
  to: Date;
  from: Date;
  status: TabStatus;
  tabIndex: number;
}

interface IPage {
  visits: Array<PageVisit>;
}

class PageVisit implements IPageVisit {
  to: Date;
  from: Date;
  status: TabStatus;
  tabIndex: number;
  private _spentTime: TimeStamp;

  constructor(from: Date, to: Date, status: TabStatus, tabIndex: number) {
    this.from = typeof from === 'string' ? new Date(Date.parse(from)) : from;
    this.to = typeof to === 'string' ? new Date(Date.parse(to)) : to;
    this.status = status;
    this.tabIndex = tabIndex;
    this._spentTime = this._countSpentTime();
  }

  private _countSpentTime(): TimeStamp {
    return !!this.from && !!this.to
      ? this.to.getTime() - this.from.getTime()
      : 0;
  }

  finish = (finishTime: Date): void => {
    if (!this.to) {
      this.to = finishTime;
      this._spentTime = this._countSpentTime();
    }
  };

  getSpentTime = (now: TimeStamp = null): TimeStamp => {
    if (this._spentTime > 0) {
      return this._spentTime;
    }
    if (!!this.from && !this.to) {
      const nowTimestamp = now || new Date().getTime();
      return nowTimestamp - this.from.getTime();
    }
    return 0;
  };
}

class Page implements IPage {
  visits: Array<PageVisit>;

  constructor() {
    this.visits = [];
  }

  getTotalSpentTime = (now: TimeStamp = null): TimeStamp => {
    if (this.visits.length) {
      const nowTimestamp: TimeStamp = now || new Date().getTime();
      const reducingTimes = (acc: TimeStamp, item: PageVisit, i: number) => {
        return acc + item.getSpentTime(nowTimestamp);
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
    const page: Page = pages[domain];
    page.finishVisits(finishTime);
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

export { IPageVisit, IPage, PageHelper, Page, PageVisit };
