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

function selectButton($clickedBtn: HTMLElement) {
  const $tabButtons: Array<HTMLElement> = Array.from(
    document.getElementsByClassName('tab-btn') as HTMLCollectionOf<HTMLElement>
  );
  for (let i = 0; i < $tabButtons.length; i++) {
    $tabButtons[i].classList.remove('tab-btn-selected');
  }
  $clickedBtn.classList.add('tab-btn-selected');
}

function selectTab(tabId: string) {
  const $tabs: Array<HTMLElement> = Array.from(
    document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>
  );
  for (let i = 0; i < $tabs.length; i++) {
    if ($tabs[i].id === tabId) {
      $tabs[i].classList.add('tab-visible');
    } else {
      $tabs[i].classList.remove('tab-visible');
    }
  }
}

function openTab(e: MouseEvent) {
  const $clickedBtn: HTMLElement = e.target as HTMLElement;
  selectButton($clickedBtn);
  const tabId: string = $clickedBtn.getAttribute('data-for');
  selectTab(tabId);
}

function initTabButtons() {
  const tabButtons: Array<HTMLElement> = Array.from(
    document.getElementsByClassName('tab-btn') as HTMLCollectionOf<HTMLElement>
  );
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener('click', openTab);
  }
}

render();
initTabButtons();
