import { IDomainTimePair, IKeyValueObject, TimeStamp } from './types';
import Helpers from './helpers';
import PagesStore from './pagesStore';
import { Page } from './pages';

let pagesStore: PagesStore = new PagesStore();

async function getPagesWithVisits() {
  const pages: IKeyValueObject = await pagesStore.get();
  const domains: Array<string> = Object.keys(pages);
  const now: TimeStamp = new Date().getTime();
  const pagesArray: Array<IDomainTimePair> = domains.map(
    (domain: string): IDomainTimePair => {
      return {
        domain,
        time: (pages[domain] as Page).getTotalSpentTime(now),
      };
    }
  );
  return pagesArray
    .sort((a, b) => a.time - b.time)
    .reverse()
    .map(p => {
      return [p.domain, Helpers.timestampToLongString(p.time)];
    });
}

const Config = {
  getPagesWithVisits,
};

export default Config;
