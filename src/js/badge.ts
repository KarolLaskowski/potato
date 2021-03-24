import { Consts } from './consts';
import Helpers from './helpers';

let secondsCounter: number = 0;

function setBadge(badgePayload: string): void {
  chrome.browserAction.setBadgeText({
    text: badgePayload,
  });
}

function setBadgeToTotalSpentTime(secondsCounter: number): void {
  setBadge(Helpers.secondsToHrsMinSecString(secondsCounter));
}

function resetBadgeTimer(
  badgeRefreshInterval: number,
  secondsCounter: number
): number {
  if (badgeRefreshInterval) {
    window.clearInterval(badgeRefreshInterval);
  }
  badgeRefreshInterval = window.setInterval(function () {
    setBadgeToTotalSpentTime(secondsCounter);
    secondsCounter++;
  }, Consts.badgeRefreshIntervalTimeInMs);
  return badgeRefreshInterval;
}

function resetBadgeAndTimer(
  badgeRefreshInterval: number,
  spentTime: number = 0
): number {
  secondsCounter = ~~(spentTime / 1000);
  setBadgeToTotalSpentTime(secondsCounter);
  return resetBadgeTimer(badgeRefreshInterval, secondsCounter);
}

const Badge = {
  resetBadgeAndTimer,
};

export default Badge;
