import Helpers from '../js/helpers';

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
