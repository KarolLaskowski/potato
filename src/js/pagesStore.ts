import { IKeyValueObject } from './common';
import { IPage, Page, PageHelper, IPageVisit, PageVisit } from './pages';
import { Sync } from './storage';
import Store from './store';

class PagesStore extends Store {
  constructor(newPages: object = null) {
    super('pages');
  }

  private _mapAsVisits(visits: Array<IPageVisit>): Array<PageVisit> {
    const resultVisits: Array<PageVisit> = [];
    for (const visit of visits) {
      resultVisits.push(
        new PageVisit(visit.from, visit.to, visit.status, visit.tabIndex)
      );
    }
    return resultVisits;
  }

  private _mapAsPages(dataFromDb: IKeyValueObject): IKeyValueObject {
    const keysFromDb = Object.keys(dataFromDb);
    const pagesToReturn: IKeyValueObject = {};
    for (let i = 0; i < keysFromDb.length; i++) {
      const domain: string = keysFromDb[i];
      const newPage: Page = PageHelper.addPage(pagesToReturn, domain);
      const pageInDb: IPage = dataFromDb[domain] as IPage;
      //pagesToReturn[domain].visits = this._mapAsVisits(pageInDb.visits);
      newPage.visits = this._mapAsVisits(pageInDb.visits);
    }
    return pagesToReturn;
  }

  protected _sync = async () => {
    const dataFromDb: any = await Sync.get(this._storeKeyName);
    const newMergedData = {
      ...this._mapAsPages(dataFromDb),
      ...this._storeData,
    };
    this._storeData = newMergedData;
    await Sync.set(this._storeKeyName, this._storeData);
  };
}

export default PagesStore;
