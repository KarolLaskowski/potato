"use strict";

function setBadge(badgePayload) {
  chrome.browserAction.setBadgeText({
    text: `S: ${badgePayload.secondsCounter}`,
  });
}

function resetBadgeIntervalTimer(badgeRefreshInterval, secondsCounter) {
  if (badgeRefreshInterval) {
    window.clearInterval(badgeRefreshInterval);
  }
  badgeRefreshInterval = window.setInterval(function () {
    setBadge({
      secondsCounter: secondsCounter,
    });
    secondsCounter++;
  }, 1000);
  return badgeRefreshInterval;
}

function resetBadge(badgeRefreshInterval, indexSeconds) {
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
