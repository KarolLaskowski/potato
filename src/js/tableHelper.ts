import {
  IPageAndSpentTime,
  ITableColumnSchema,
  TableColumnType,
} from './common';
import Helpers from './helpers';

function createDeleteButton(id: string): HTMLButtonElement {
  const $button: HTMLButtonElement = document.createElement('button');
  $button.setAttribute('data-id', id || '');
  $button.classList.add('delete');
  return $button;
}

function createCell(dataCell: ITableColumnSchema): HTMLTableCellElement {
  const $td: HTMLTableCellElement = document.createElement('td');
  switch (dataCell.type) {
    case TableColumnType.DeleteButton:
      const $button: HTMLButtonElement = createDeleteButton(dataCell.value);
      $td.appendChild($button);
      break;
    case TableColumnType.Text:
    default:
      $td.innerText = dataCell.value;
      break;
  }
  return $td;
}

function createRow(dataRow: Array<ITableColumnSchema>): HTMLElement {
  const $row: HTMLTableRowElement = document.createElement('tr');
  for (let i = 0; i < dataRow.length; i++) {
    $row.appendChild(createCell(dataRow[i]));
  }
  return $row;
}

const TableHelper = {
  createRow,
  createCell,
};

export default TableHelper;
