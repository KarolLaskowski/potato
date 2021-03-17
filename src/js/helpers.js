"use strict";

function urlToDomain(url) {
  var result;
  var match;
  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
    ))
  ) {
    result = match[1];
    if ((match = result.match(/^[^\.]+\.(.+\..+)$/))) {
      result = match[1];
    }
  }
  return result;
}

function isDomainValid(domain) {
  return !!domain && domain.includes(".");
}

const Helpers = {
  urlToDomain,
  isDomainValid,
};

export default Helpers;
