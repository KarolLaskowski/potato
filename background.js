"use strict";
const potatoModule = (function () {
	const BadgeColors = {
		Unblocked: 'darkgreen',
		Blocked: 'red',
	};
	const TabStatus = {
		Unloaded: 'unloaded',
		Loading: 'loading',
		Complete: 'complete',
	};
	const badgeRefreshIntervalTimeInMs = 1000;

	let indexSeconds = 0;
	let rules = [];
	let badgeRefreshInterval;
	let pages = {};

	rules.push({
		id: 1,
		regex: /wykop.pl/g,
		timeAllowed: new Date(0, 0, 0, 0, 15, 0, 0),
		active: true,
		visits: [],
	});

	function sortRulesByTimeAllowed(a, b) {
		if (a.timeAllowed < b.timeAllowed) {
			return -1;
		}
		if (a.timeAllowed > b.timeAllowed) {
			return 1;
		}
		return 0;
	}

	function findMatchingRules(rules, address) {
		return rules.filter(rule => address.match(rule.regex));
	}

	function finishSingleVisit(finishTime, visit) {
		if (!visit.to) {
			visit.to = finishTime;
			visit.sum = visit.to - visit.from;
		}
	}

	function finishAllPageVisits(pages, finishTime) {
		const domains = Object.keys(pages);
		domains.forEach(domain => {
			pages[domain].visits.forEach(finishSingleVisit.bind(null, finishTime));
		});
	}

	function startPageVisit(page, startTime, type, tabIndex) {
		if (!!page) {
			page.visits.push({ from: startTime, to: null, type: type, tabIndex: tabIndex });
		}
	}

	function anyRulesMatchAddress(rules, address) {
		rules.some(rule => address.match(rule.regex));
	}

	function addPage(pages, domain) {
		pages[domain] = {
			visits: [],
		};
		return pages[domain];
	}

	function startMatchingPageVisits(pages, domain, tabSwitchedTime, type, tabIndex) {
		const page = addUrlToPagesAndGetPage(pages, domain);
		startPageVisit(page, tabSwitchedTime, type, tabIndex);
	}
	
	function startAndFinishPageVisits(pages, domain, type, tabIndex) {
		const tabSwitchedTime = new Date();
		finishAllPageVisits(pages, tabSwitchedTime);
		startMatchingPageVisits(pages, domain, tabSwitchedTime, type, tabIndex);
	}
	
	function setBadge(badgePayload) {
		chrome.browserAction.setBadgeText({
			text: `S: ${badgePayload.secondsCounter}`,
		});
	}
	
	function resetBadgeIntervalTimer(badgeRefreshInterval, secondsCounter) {
		if (badgeRefreshInterval) {
			window.clearInterval(badgeRefreshInterval);
		}
		badgeRefreshInterval = window.setInterval(function() {
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

	function processChangeOfTab(selectedTab) {
		const domain = domainFromUrl(selectedTab.url);
		const status = selectedTab.status;
		startAndFinishPageVisits(pages, domain, status);
		badgeRefreshInterval = resetBadge(badgeRefreshInterval, indexSeconds);
	}

	function onTabActivated(activeInfo) {
		chrome.tabs.get(activeInfo.tabId, (selectedTab) => {
			processChangeOfTab(selectedTab);
		});
	}

	function onTabUpdated(tabId, changeInfo, tab) {
		processChangeOfTab(tab);
	}

	function domainFromUrl(url) {
		var result
		var match
		if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
				result = match[1]
				if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
						result = match[1]
				}
		}
		return result;
	}

	function getPageSpentTime(domain) {
		if (isDomainValid(domain) && !!pages[domain] && !!pages[domain].visits.length) {
			const reducingTimes = (a, b) => {
				return a + (!!b.to ? b.sum : new Date() - b.from);
			};
			return new Date(pages[domain].visits.reduce(reducingTimes, 0));
		}
		return 0;
	}

	function getHistoryTable() {
		const domains = Object.keys(pages);
		console.table(domains.flatMap(domain => pages[domain].visits));
	}

	function isDomainValid(domain) {
		return !!domain && domain.includes('.');
	}

	function addUrlToPagesAndGetPage(pages, domain) {
		let page = null;
		if (isDomainValid(domain)) {
			page = pages[domain];
			if (!page) {
				page = addPage(pages, domain);
			}
		}
		return page;
	}

	function initExistingTabs(tabs) {
		tabs.forEach(tab => {
			const domain = domainFromUrl(tab.url);
			const page = addUrlToPagesAndGetPage(pages, domain);
			if (!!page && tab.selected) {
				const currentTime = new Date();
				startPageVisit(page, currentTime);
			}
		});
	}

	function init() {
		chrome.tabs.onActivated.addListener(onTabActivated);
		chrome.tabs.onUpdated.addListener(onTabUpdated);

		chrome.browserAction.setBadgeBackgroundColor({
			color: BadgeColors.Unblocked,
		});

		badgeRefreshInterval = resetBadge(badgeRefreshInterval, indexSeconds);

		chrome.tabs.query({
			currentWindow: true,
		}, (tabs) => {
			initExistingTabs(tabs);
		});
	}

	init();

	return {
		Rules: rules,
		Pages: pages,
		IndexSeconds: indexSeconds,
		GetHistoryTable: getHistoryTable,
		GetPageSpentTime: getPageSpentTime,
	};
})();