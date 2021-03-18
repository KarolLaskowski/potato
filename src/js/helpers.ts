function urlToDomain(url: string) {
  let result;
  let match;
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

function isDomainValid(domain: string) {
  return !!domain && !!domain.match(/^([a-z0-9]+\.)?([a-z0-9]+\.[a-z0-9]+)$/);
}

const Helpers = {
  urlToDomain,
  isDomainValid,
};

export default Helpers;
