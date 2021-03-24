import Helpers from '../js/helpers';

test('urlToDomain returns domain when given url', () => {
  // arrange
  const url = 'https://example.com/test?q=lol';
  const expected = 'example.com';

  //act
  let result = Helpers.urlToDomain(url);

  //assert
  expect(result).toStrictEqual(expected);
});

test('urlToDomain returns same string when given valid domain with subdomain', () => {
  // arrange
  const url = 'subdomain.example.com';
  const expected = url;

  //act
  let result = Helpers.urlToDomain(url);

  //assert
  expect(result).toStrictEqual(expected);
});

test('urlToDomain returns domain with subdomain when given url with subdomain', () => {
  // arrange
  const url = 'https://testing.example.com/test?q=lol';
  const expected = 'testing.example.com';

  //act
  let result = Helpers.urlToDomain(url);

  //assert
  expect(result).toStrictEqual(expected);
});

test('urlToDomain throws exception when given empty string', () => {
  // arrange
  const url = '';

  //act

  //assert
  expect(() => {
    Helpers.urlToDomain(url);
  }).toThrow(TypeError);
});

test('urlToDomain throws exception when given null', () => {
  // arrange
  let url: string = null;

  //act

  //assert
  expect(() => {
    Helpers.urlToDomain(url);
  }).toThrow(TypeError);
});

test('isDomainValid returns false when given empty string', () => {
  // arrange
  const domain = '';

  //act
  let result = Helpers.isDomainValid(domain);

  //assert
  expect(result).toBe(false);
});

test('isDomainValid returns false when given "undefined"', () => {
  // arrange
  let domain = undefined;

  //act
  let result = Helpers.isDomainValid(domain);

  //assert
  expect(result).toBe(false);
});

test('isDomainValid returns false when given full URL', () => {
  // arrange
  let domain = 'http://example.com/';

  //act
  let result = Helpers.isDomainValid(domain);

  //assert
  expect(result).toBe(false);
});

test('isDomainValid returns false when given URL without subdomain', () => {
  // arrange
  let domain = 'http://example.com';

  //act
  let result = Helpers.isDomainValid(domain);

  //assert
  expect(result).toBe(false);
});

test('isDomainValid returns false when given domain with parameters', () => {
  // arrange
  let domain = 'example.com/test';

  //act
  let result = Helpers.isDomainValid(domain);

  //assert
  expect(result).toBe(false);
});

test('isDomainValid returns true when given domain URL with subdomain', () => {
  // arrange
  let domain = 'subdomain.example.com';

  //act
  let result = Helpers.isDomainValid(domain);

  //assert
  expect(result).toBe(true);
});

test('isDomainValid returns true when given domain URL with hyphen', () => {
  // arrange
  let domain = 'domain-example.com';

  //act
  let result = Helpers.isDomainValid(domain);

  //assert
  expect(result).toBe(true);
});

test('isDomainValid returns true when given domain URL with dash', () => {
  // arrange
  let domain = 'domain_example.com';

  //act
  let result = Helpers.isDomainValid(domain);

  //assert
  expect(result).toBe(true);
});

test('isDomainValid returns true when given valid domain URL', () => {
  // arrange
  let domain = 'example.com';

  //act
  let result = Helpers.isDomainValid(domain);

  //assert
  expect(result).toBe(true);
});

test('urlIsChromeExtensions returns true when given Chrome extension URL', () => {
  // arrange
  const pendingUrl =
    'chrome-extension://faaeenegfiogpnlgjkmejakhmkkbcmgn/html/config.html';

  //act
  let result = Helpers.urlIsChromeExtensions(pendingUrl);

  //assert
  expect(result).toBe(true);
});

test('urlIsChromeExtensions returns true when given Chrome speed dial tab url', () => {
  // arrange
  const pendingUrl = '"chrome://startpageshared/"';

  //act
  let result = Helpers.urlIsChromeExtensions(pendingUrl);

  //assert
  expect(result).toBe(true);
});

test('urlIsChromeExtensions returns false when given regular URL', () => {
  // arrange
  const pendingUrl = 'https://example.com/config.html';

  //act
  let result = Helpers.urlIsChromeExtensions(pendingUrl);

  //assert
  expect(result).toBe(false);
});

test('timestampToLongString returns long time string when given timestamp', () => {
  // arrange
  const timestamp = 1234567890;
  const expected = '14 days, 6 hrs, 56 min, 7 sec';

  //act
  let result = Helpers.timestampToLongString(timestamp);

  //assert
  expect(result).toBe(expected);
});

test('timestampToLongString returns empty string when given timestamp = 0', () => {
  // arrange
  const timestamp = 0;
  const expected = '';

  //act
  let result = Helpers.timestampToLongString(timestamp);

  //assert
  expect(result).toBe(expected);
});

test('timestampToLongString returns empty string when given null timestamp', () => {
  // arrange
  let timestamp = null;
  const expected = '';

  //act
  let result = Helpers.timestampToLongString(timestamp);

  //assert
  expect(result).toBe(expected);
});

test('secondsToHrsMinSecString returns proper string when given seconds', () => {
  // arrange
  const timestamp = 12345;
  const expected = '3:25:45';

  //act
  let result = Helpers.secondsToHrsMinSecString(timestamp);

  //assert
  expect(result).toBe(expected);
});

test('secondsToHrsMinSecString returns `0:00:00` string when given 0 seconds', () => {
  // arrange
  const timestamp = 0;
  const expected = '0:00:00';

  //act
  let result = Helpers.secondsToHrsMinSecString(timestamp);

  //assert
  expect(result).toBe(expected);
});

test('secondsToHrsMinSecString returns `0:00:00` string when given null', () => {
  // arrange
  const timestamp: number = null;
  const expected = '0:00:00';

  //act
  let result = Helpers.secondsToHrsMinSecString(timestamp);

  //assert
  expect(result).toBe(expected);
});
