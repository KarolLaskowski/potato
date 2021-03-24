import { Page } from '../js/classes/page';
import { PageVisit } from '../js/classes/pageVisit';
import { PageHelper } from '../js/pages';

test('finishAndStartPageVisits stops all started visits when given domain and time', () => {
  // arrange
  const domain1 = 'example.com';
  const domain2 = 'test.com';
  const pages: any = {};
  const visitStartedTime1 = new Date();
  const page: Page = (pages[domain1] = new Page());
  page.visits.push(new PageVisit(visitStartedTime1, null, null, 0));
  const expected = visitStartedTime1.getTime();

  //act
  PageHelper.finishAndStartPageVisits(pages, domain2);

  //assert
  expect(page.visits[0].to).not.toBeFalsy();
  expect(page.visits[0].to.getTime()).toBeGreaterThan(expected - 5);
  expect(page.visits[0].to.getTime()).toBeLessThan(expected + 5);
});

test('finishAndStartPageVisits adds new Page and PageVisit when given domain and time', () => {
  // arrange
  const domain1 = 'example.com';
  const domain2 = 'test.com';
  const pages: any = {};
  const visitStartedTime1 = new Date();
  pages[domain1] = new Page();
  pages[domain1].visits.push(new PageVisit(visitStartedTime1, null, null, 0));

  //act
  PageHelper.finishAndStartPageVisits(pages, domain2);

  //assert
  const page: Page = pages[domain2];
  expect(page).not.toBeUndefined();
  expect(page.visits).not.toBeUndefined();
  expect(page.visits).toHaveLength(1);
  expect(page.visits[0].from).toEqual(visitStartedTime1);
  expect(page.visits[0].to).toBeFalsy();
});

test('getTotalSpentTime return sum of visits time when added 2 visits to Page entry', () => {
  // arrange
  const domain = 'example.com';
  const pages: any = {};
  const now = new Date();
  const timespan3 = 9000;
  const visitStartTime3 = new Date(now.getTime() - timespan3);
  const breakTime2 = 9000;
  const visitEndTime2 = new Date(visitStartTime3.getTime() - breakTime2);
  const timespan2 = 8000;
  const visitStartTime2 = new Date(visitEndTime2.getTime() - timespan2);
  const breakTime1 = 7000;
  const visitEndTime1 = new Date(visitStartTime2.getTime() - breakTime1);
  const timespan1 = 6000;
  const visitStartTime1 = new Date(visitEndTime1.getTime() - timespan1);

  PageHelper.startPageVisits(pages, domain, visitStartTime1);
  PageHelper.finishPageVisits(pages, visitEndTime1);
  PageHelper.startPageVisits(pages, domain, visitStartTime2);
  PageHelper.finishPageVisits(pages, visitEndTime2);
  PageHelper.startPageVisits(pages, domain, visitStartTime3);

  const expected = timespan1 + timespan2 + timespan3;
  //act
  const result = pages[domain].getTotalSpentTime();

  //assert
  expect(result).toBeGreaterThan(expected - 5);
  expect(result).toBeLessThan(expected + 5);
});
