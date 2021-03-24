import Helpers from './helpers';
import { TabStatus } from './enums';
import { IKeyValueObject, IPage, IPageVisit } from './types';
import { Page } from './classes/page';

function addDomainAsPage(pages: IKeyValueObject, domain: string): Page {
  pages[domain] = new Page();
  return pages[domain] as Page;
}

function startPageVisits(
  pages: IKeyValueObject,
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

function finishPageVisits(pages: IKeyValueObject, finishTime: Date): void {
  const domains = Object.keys(pages);
  domains.forEach(domain => {
    const page: Page = pages[domain] as Page;
    page.finishVisits(finishTime);
  });
}

function finishAndStartPageVisits(
  pages: IKeyValueObject,
  domain: string,
  type: TabStatus = TabStatus.Complete,
  tabIndex: number = null
): void {
  const pageChangedTime: Date = new Date();
  finishPageVisits(pages, pageChangedTime);
  startPageVisits(pages, domain, pageChangedTime, type, tabIndex);
}

function initPageVisits(page: Page, currentTime: Date): void {
  page.startVisit(currentTime);
}

function addPage(pages: IKeyValueObject, domain: string): Page {
  let page: Page = null;
  if (Helpers.isDomainValid(domain)) {
    page = pages[domain] as Page;
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

export { PageHelper };
