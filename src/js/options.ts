import { TabStatus } from './enums';
import Helpers from './helpers';
import { Consts, TimeStamp } from './common';
import { PageHelper, PageVisit } from './pages';
import Config from './config';
import '../scss/options.scss';

let $tabButtons: Array<HTMLElement>;
let $tabs: Array<HTMLElement>;

async function render() {
  const $pagesTable = document.querySelectorAll('#pages').item(0);
  const data = await Config.getPagesWithVisits();
  Config.DOM.fillTableWithData($pagesTable, data);
}

function selectButton(
  $clickedBtn: HTMLElement,
  $tabButtons: Array<HTMLElement>
) {
  for (let i = 0; i < $tabButtons.length; i++) {
    $tabButtons[i].classList.remove('is-active');
  }
  $clickedBtn.classList.add('is-active');
}

function selectTab(tabId: string, $tabs: Array<HTMLElement>) {
  for (let i = 0; i < $tabs.length; i++) {
    if ($tabs[i].id === tabId) {
      $tabs[i].classList.add('tab-visible');
    } else {
      $tabs[i].classList.remove('tab-visible');
    }
  }
}

function openTab(e: MouseEvent) {
  e.preventDefault();
  const $clickedBtn: HTMLElement = this as HTMLElement;
  selectButton($clickedBtn, $tabButtons);
  const tabId: string = $clickedBtn.getAttribute('data-for');
  selectTab(tabId, $tabs);
}

function initTabButtons() {
  $tabButtons = Array.from(document.querySelectorAll('div.tabs > ul > li'));
  $tabs = Array.from(document.querySelectorAll('div.tab'));
  for (let i = 0; i < $tabButtons.length; i++) {
    $tabButtons[i].addEventListener('click', openTab);
  }
}

render();
initTabButtons();
