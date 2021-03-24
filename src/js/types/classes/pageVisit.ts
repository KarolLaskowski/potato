import { TabStatus } from '../enums';
import { IPage, IPageVisit, TimeStamp } from '../types';

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

export { PageVisit };
