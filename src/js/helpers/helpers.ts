import { TimeStamp } from '../types/types';

function urlToDomain(url: string): string {
  let result;
  let match;
  if (!url) {
    throw new TypeError('`url` parameter cannot be empty or null');
  }
  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
    ))
  ) {
    result = match[1];
  }
  return result;
}

function isDomainValid(domain: string): boolean {
  return (
    !!domain && !!domain.match(/^([a-z0-9-\_\]+\.)?([a-z0-9-\_\]+\.[a-z0-9]+)$/)
  );
}

function urlIsChromeExtensions(url: string): boolean {
  return url && (url.includes('chrome-extension') || url.includes('chrome://'));
}

function tabIsChromeExtensions(tab: chrome.tabs.Tab): boolean {
  return (
    !!tab &&
    (urlIsChromeExtensions(tab.pendingUrl) || urlIsChromeExtensions(tab.url))
  );
}

function timestampToLongString(timestamp: TimeStamp): string {
  if (!!timestamp) {
    const timeSpent = new Date(timestamp);
    const sec: number = timeSpent.getSeconds();
    const min: number = timeSpent.getMinutes();
    const hrs: number = timeSpent.getUTCHours();
    const days: number = timeSpent.getDate() - 1;
    const months: number = timeSpent.getMonth();
    const years: number = timeSpent.getFullYear() - 1970;
    let result: string = years > 0 ? `${years} years, ` : '';
    result += months > 0 ? `${months} months, ` : '';
    result += days > 0 ? `${days} days, ` : '';
    result += hrs > 0 ? `${hrs} hrs, ` : '';
    result += min > 0 ? `${min} min, ` : '';
    result += sec > 0 ? `${sec} sec` : '';
    return result;
  }
  return '';
}

function secondsToHrsMinSecString(seconds: number = 0) {
  const sec: number = ~~(seconds % 60);
  const min: number = ~~((seconds % 3600) / 60);
  const hr: number = ~~(seconds / 3600);
  const minString = min > 10 ? min : `0${min}`;
  const secString = sec > 10 ? sec : `0${sec}`;
  return `${hr}:${minString}:${secString}`;
}

function hrsMinSecStringToSeconds(time: string = '0:00:00'): number {
  const timeParts = time.split(':').map(p => +p);
  const hrs: number = timeParts[0],
    min: number = timeParts[1],
    sec: number = timeParts[2];
  if (hrs < 24 && min < 60 && sec < 60) {
    return (hrs * 60 + min) * 60 + sec;
  } else {
    throw TypeError('Invalid time format!');
  }
}

const Helpers = {
  urlToDomain,
  isDomainValid,
  tabIsChromeExtensions,
  urlIsChromeExtensions,
  timestampToLongString,
  secondsToHrsMinSecString,
  hrsMinSecStringToSeconds,
};

export default Helpers;
