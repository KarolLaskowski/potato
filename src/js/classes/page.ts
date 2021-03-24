import { TabStatus } from '../enums';
import { IPage, TimeStamp } from '../types';
import { PageVisit } from './pageVisit';

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

export { Page };
