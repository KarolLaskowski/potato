import Helpers from '../helpers/helpers';
import OptionsStore from '../stores/optionsStore';
import TableHelper from '../helpers/tableHelper';
import {
  IDomainTimePair,
  TableData,
  TableRowData,
  TableSchema,
} from '../types/types';

async function addConfiguredPageToStore(
  optionsStore: OptionsStore,
  optionsKey: string,
  addedPage: IDomainTimePair
) {
  const configuredPages: Array<IDomainTimePair> = ((await optionsStore.getOption(
    optionsKey
  )) || []) as Array<IDomainTimePair>;
  configuredPages.push(addedPage);
  await optionsStore.setOption(optionsKey, configuredPages);
}

function addConfiguredPage(
  optionsStore: OptionsStore,
  optionsKey: string,
  $configuredPagesTableBody: HTMLElement,
  tableSchema: TableSchema,
  $inputPageUrl: HTMLInputElement,
  $inputPageTimeLimit: HTMLInputElement = null
) {
  const addedPage: IDomainTimePair = {
    domain: $inputPageUrl.value,
    time: $inputPageTimeLimit
      ? Helpers.hrsMinSecStringToSeconds($inputPageTimeLimit.value)
      : undefined,
  };
  TableHelper.addConfiguredPageToTable(
    $configuredPagesTableBody,
    tableSchema,
    addedPage
  );
  addConfiguredPageToStore(optionsStore, optionsKey, addedPage);
  resetInputsAfterAddedPage($inputPageUrl, $inputPageTimeLimit);
}

function resetInputsAfterAddedPage(
  $inputPageUrl: HTMLInputElement,
  $inputPageTimeLimit: HTMLInputElement = null
) {
  $inputPageUrl.value = '';
  if ($inputPageTimeLimit) {
    $inputPageTimeLimit.value = '';
  }
  $inputPageUrl.focus();
}

async function removeConfiguredPage(
  optionsStore: OptionsStore,
  optionsKey: string,
  $button: HTMLButtonElement
) {
  const $parentRow = $button.closest('tr');
  const domain: string = ($parentRow.getElementsByClassName(
    'domain'
  )[0] as HTMLElement).innerText;
  $parentRow.remove();
  const configuredPages: Array<IDomainTimePair> = ((await optionsStore.getOption(
    optionsKey
  )) || []) as Array<IDomainTimePair>;
  var removeIndex = configuredPages
    .map(function (item) {
      return item.domain;
    })
    .indexOf(domain);
  configuredPages.splice(removeIndex, 1);
  await optionsStore.setOption(optionsKey, configuredPages);
}

function mapConfiguredPageToTableRowData(
  configuredPages: Array<IDomainTimePair>
): TableData {
  return configuredPages.map(p => {
    const result: TableRowData = [];
    result.push(p.domain);
    if (p.time) {
      result.push(Helpers.secondsToHrsMinSecString(p.time));
    }
    return result;
  });
}

export {
  addConfiguredPageToStore,
  addConfiguredPage,
  resetInputsAfterAddedPage,
  removeConfiguredPage,
  mapConfiguredPageToTableRowData,
};
