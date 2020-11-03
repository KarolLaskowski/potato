"use strict";
const potatoModule = (function () {
	const badgeColors = {
		Unblocked: 'darkgreen',
		Blocked: 'red',
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
		uses: [],
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

	function finishSingleUse(finishTime, use) {
		if (!use.to) {
			use.to = finishTime;
			use.sum = use.to - use.from;
		}
	}

	function finishAllPageUses(pages, finishTime) {
		const domains = Object.keys(pages);
		domains.forEach(domain => {
			pages[domain].uses.forEach(finishSingleUse.bind(null, finishTime));
		});
	}

	function startPageUse(page, startTime) {
		if (!!page) {
			page.uses.push({ from: startTime, to: null });
		}
	}

	function anyRulesMatchAddress(rules, address) {
		rules.some(rule => address.match(rule.regex));
	}

	function addPage(pages, domain) {
		pages[domain] = {
			uses: [],
		};
		return pages[domain];
	}

	function startMatchingPageUses(pages, domain, tabSwitchedTime) {
		const page = addUrlToPagesAndGetPage(pages, domain);
		startPageUse(page, tabSwitchedTime);
	}
	
	function startAndFinishPageUses(pages, domain){
		const tabSwitchedTime = new Date();
		finishAllPageUses(pages, tabSwitchedTime);
		startMatchingPageUses(pages, domain, tabSwitchedTime);
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
		startAndFinishPageUses(pages, domain);
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
		if (isDomainValid(domain) && !!pages[domain] && !!pages[domain].uses.length) {
			const reducingTimes = (a, b) => {
				return a + (!!b.to ? b.sum : new Date() - b.from);
			};
			return new Date(pages[domain].uses.reduce(reducingTimes, 0));
		}
		return 0;
	}

	function getHistoryTable() {
		const domains = Object.keys(pages);
		console.table(domains.flatMap(domain => pages[domain].uses));
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
				startPageUse(page, currentTime);
			}
		});
	}

	function init() {
		chrome.tabs.onActivated.addListener(onTabActivated);
		chrome.tabs.onUpdated.addListener(onTabUpdated);

		chrome.browserAction.setBadgeBackgroundColor({
			color: badgeColors.Unblocked,
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