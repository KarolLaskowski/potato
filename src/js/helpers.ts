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
  return !!domain && !!domain.match(/^([a-z0-9]+\.)?([a-z0-9]+\.[a-z0-9]+)$/);
}

const Helpers = {
  urlToDomain,
  isDomainValid,
};

export default Helpers;
