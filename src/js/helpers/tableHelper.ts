import { TableColumnType } from '../types/enums';
import Helpers from './helpers';
import {
  IDomainTimePair,
  ITableColumnSchema,
  TableData,
  TableRowData,
  TableSchema,
} from '../types/types';

function createDeleteButton(id: string): HTMLButtonElement {
  const $button: HTMLButtonElement = document.createElement('button');
  $button.setAttribute('data-id', id || '');
  $button.classList.add('delete');
  return $button;
}

function createCell(
  data: string,
  cellSchema: ITableColumnSchema
): HTMLTableCellElement {
  const $td: HTMLTableCellElement = document.createElement('td');
  if (cellSchema.class) {
    $td.classList.add(cellSchema.class);
  }
  switch (cellSchema.type) {
    case TableColumnType.DeleteButton:
      const $button: HTMLButtonElement = createDeleteButton(data);
      $td.appendChild($button);
      break;
    case TableColumnType.Text:
    default:
      $td.innerText = data;
      break;
  }
  return $td;
}

function createRow(
  dataRow: Array<string>,
  tableSchema: TableSchema
): HTMLElement {
  const $row: HTMLTableRowElement = document.createElement('tr');
  for (let i = 0; i < tableSchema.length; i++) {
    const $td: HTMLTableCellElement = createCell(dataRow[i], tableSchema[i]);
    if ($td) {
      $row.appendChild($td);
    }
  }
  return $row;
}

function addRowsToTable(
  $tableBody: HTMLElement,
  tableSchema: TableSchema,
  dataList: TableData
) {
  if ($tableBody) {
    const $inputRow: HTMLTableRowElement = $tableBody.querySelectorAll(
      'tr.editing:last-child'
    )[0] as HTMLTableRowElement;
    if ($inputRow) {
      for (const row of dataList) {
        $tableBody.insertBefore(createRow(row, tableSchema), $inputRow);
      }
    } else {
      for (const row of dataList) {
        $tableBody.appendChild(createRow(row, tableSchema));
      }
    }
  } else {
    throw TypeError('Table body element not found');
  }
}

function addConfiguredPageToTable(
  $configuredPagesTableBody: HTMLElement,
  tableSchema: TableSchema,
  addedPage: IDomainTimePair
) {
  const rowData: TableRowData = [addedPage.domain];
  if (addedPage.time) {
    rowData.push(Helpers.secondsToHrsMinSecString(addedPage.time));
  }
  addRowsToTable($configuredPagesTableBody, tableSchema, [rowData]);
}

const TableHelper = {
  createRow,
  createCell,
  addRowsToTable,
  addConfiguredPageToTable,
};

export default TableHelper;
