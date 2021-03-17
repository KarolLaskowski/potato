"use strict";

class Rule {
  constructor(id, regex, timeAllowed, isActive, visits) {
    this.id = id;
    this.regex = regex;
    this.timeAllowed = timeAllowed || new Date(0, 0, 0, 0, 15, 0, 0);
    this.active = isActive || true;
    this.visits = visits || [];
  }
}

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
  return rules.filter((rule) => address.match(rule.regex));
}

function anyRulesMatchAddress(rules, address) {
  rules.some((rule) => address.match(rule.regex));
}

const Rules = {
  Rule,
  sortRulesByTimeAllowed,
  findMatchingRules,
  anyRulesMatchAddress,
};

export default Rules;
