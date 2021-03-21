import { TabStatus } from './enums';
import Helpers from './helpers';
import { Consts, TimeStamp } from './common';
import { PageHelper, PageVisit } from './pages';
import Config from './config';

async function render() {
  const $pagesTable = document.querySelectorAll('#pages').item(0);
  const data = await Config.getPagesWithVisits();
  Config.DOM.fillTableWithData($pagesTable, data);
}

render();
