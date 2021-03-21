import { Page, PageHelper, PageVisit } from './pages';
import { Sync } from './storage';

class PagesStore {
  pages: object;

  constructor(newPages: object = null) {
    if (newPages) {
      this.save(newPages);
    } else {
      this.pages = this.pages || {};
    }
  }

  private _copyVisitsFromDb(pageInDb: Page, pageToFill: Page) {
    for (const visit of pageInDb.visits) {
      pageToFill.visits.push(
        new PageVisit(visit.from, visit.to, visit.status, visit.tabIndex)
      );
    }
    return pageToFill;
  }

  private _copyPagesFromDb(
    storedPages: any,
    domainsAddTostore: Array<string>,
    pagesDb: any
  ) {
    for (let i = 0; i < domainsAddTostore.length; i++) {
      const domain: string = domainsAddTostore[i];
      const newPage: Page = PageHelper.addPage(storedPages, domain);
      const pageInDb: Page = pagesDb[domain];
      storedPages[domain] = this._copyVisitsFromDb(pageInDb, newPage);
    }
    return storedPages;
  }

  private _sync = async () => {
    const pagesDb: any = await Sync.get('pages');
    const domainsAddTostore = Object.keys(pagesDb).filter(
      d => !Object.keys(this.pages).includes(d)
    );
    this.pages = this._copyPagesFromDb(this.pages, domainsAddTostore, pagesDb);
    await Sync.set('pages', this.pages);
  };

  count = () => {
    return Object.keys(this.pages).length;
  };

  all = async () => {
    if (!this.count()) {
      await this._sync();
    }
    return this.pages || {};
  };

  save = async (newPages: object) => {
    this.pages = newPages;
    await Sync.set('pages', newPages);
  };
}

export default PagesStore;
