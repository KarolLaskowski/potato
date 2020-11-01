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

	function findNotMatchingRules(rules, address) {
		return rules.filter(rule => !address.match(rule.regex));
	}

	function findMatchingRules(rules, address) {
		return rules.filter(rule => address.match(rule.regex));
	}

	function findAndSortMatchingRules(rules, address) {
		const matchingRules = findMatchingRules(rules, address);
		return matchingRules.sort(sortRulesByTimeAllowed);
	}

	function finishRules(rulesToFinish, finishTime) {
		rulesToFinish.forEach(rule => {
			const usesToClose = rule.uses.filter(use => use.from && !use.to);
			usesToClose.forEach(use => { use.to = finishTime; });
			console.log(`closed use from ${rule.regex}`);
		});

	}

	function startRules(rulesToStart, startTime) {
		rulesToStart.forEach(rule => {
			rule.uses.push({ from: startTime, to: null });
			console.log(`added use to ${rule.regex}`);
		});
	}

	function finishNotMatchingRules(rules, address, tabSwitchedTime) {
		const notMatchingRules = findNotMatchingRules(rules, address);
		finishRules(notMatchingRules, tabSwitchedTime);
	}

	function startMatchingRules(rules, address, tabSwitchedTime) {
		const matchingRules = findAndSortMatchingRules(rules, address);
		startRules(matchingRules, tabSwitchedTime);
	}
	
	function startAndFinishRules(rules, address){
		const tabSwitchedTime = new Date();
		finishNotMatchingRules(rules, address, tabSwitchedTime);
		startMatchingRules(rules, address, tabSwitchedTime);
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

	function onTabActivated(activeInfo) {
		chrome.tabs.get(activeInfo.tabId, (selectedTab) => {
			const address = selectedTab.url;
			startAndFinishRules(rules, address);
			badgeRefreshInterval = resetBadge(badgeRefreshInterval, indexSeconds);
		});
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
		return result
	}

	function init() {
		chrome.tabs.onActivated.addListener(onTabActivated);

		chrome.browserAction.setBadgeBackgroundColor({
			color: badgeColors.Unblocked,
		});

		badgeRefreshInterval = resetBadge(badgeRefreshInterval, indexSeconds);

		chrome.tabs.query({
			currentWindow: true,
		}, (tabs) => {
			tabs.forEach(tab => {
				const domainUrl = domainFromUrl(tab.url);
				if (!pages[domainUrl]) {
					pages[domainUrl] = {
						uses: [],
					};
				}
			});
		});
	}

	init();

	return {
		Rules: rules,
		Pages: pages,
		IndexSeconds: indexSeconds,
	};
})();