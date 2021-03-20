import { Consts } from './common';

function setBadge(badgePayload: any): void {
  chrome.browserAction.setBadgeText({
    text: `S: ${badgePayload.secondsCounter}`,
  });
}

function resetBadgeIntervalTimer(
  badgeRefreshInterval: number,
  secondsCounter: number
): number {
  if (badgeRefreshInterval) {
    window.clearInterval(badgeRefreshInterval);
  }
  badgeRefreshInterval = window.setInterval(function () {
    setBadge({
      secondsCounter: secondsCounter,
    });
    secondsCounter++;
  }, Consts.badgeRefreshIntervalTimeInMs);
  return badgeRefreshInterval;
}

function resetBadge(
  badgeRefreshInterval: number,
  indexSeconds: number
): number {
  indexSeconds = 0;
  setBadge({
    secondsCounter: indexSeconds,
  });
  return resetBadgeIntervalTimer(badgeRefreshInterval, indexSeconds);
}

const Badge = {
  resetBadge,
};

export default Badge;
