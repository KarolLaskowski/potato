import Pages from '../js/pages';

test('finishAndStartPageVisits stops all visits and adds new Page and PageVisit when given domain and time', () => {
  // arrange
  const domain1 = 'example.com';
  const domain2 = 'test.com';
  const pages = {};
  const visitStartedTime1 = new Date();
  pages[domain1] = new Pages.Page();
  pages[domain1].visits.push(
    new Pages.PageVisit(visitStartedTime1, null, null, 0)
  );

  //act
  Pages.finishAndStartPageVisits(pages, domain2);

  //assert
  expect(pages[domain1].visits[0].to).not.toBeFalsy();
  expect(pages[domain1].visits[0].to).toEqual(visitStartedTime1);
  expect(pages[domain2]).not.toBeUndefined();
  expect(pages[domain2].visits).not.toBeUndefined();
  expect(pages[domain2].visits.length).toBe(1);
  expect(pages[domain2].visits[0].from).toEqual(visitStartedTime1);
  expect(pages[domain2].visits[0].to).toBeFalsy();
});
