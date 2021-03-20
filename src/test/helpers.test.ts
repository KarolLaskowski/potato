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
