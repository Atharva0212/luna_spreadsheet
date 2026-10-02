
import { $ } from 'jquery';
import { register_events } from './events';

const columns = 20;
const rows = 40;
const freeze_column = 3;

function get_frozen_column_left(index: number, cell_width: number) {
  const border_width = 0.5;

  if (index === 0) {
    return 0;
  }

  return cell_width + border_width + (index - 1) * cell_width;
}

function createSpreadsheet(columns: number, rows: number, freeze_column: number) {
  const table = $("<table>");

  // THEAD
  const thead = $("<thead>");
  const headerRow = $("<tr>");
  const cell_width = 69.25;

  for (let i = 0; i < columns; i++) {
    const frozen_column_left = get_frozen_column_left(i, cell_width);
    const th = $("<th>", {
      text: String.fromCharCode(65 + i),
      "data-column": i,
      style:
        i < freeze_column ? `left: ${frozen_column_left}px; z-index: 999;` : "",
    });
    headerRow.append(th);
  }

  thead.append(headerRow);

  // TBODY
  const tbody = $("<tbody>");

  for (let i = 0; i < rows; i++) {
    const bodyRow = $("<tr>");

    for (let j = 0; j < columns; j++) {
      const frozen_column_left = get_frozen_column_left(j, cell_width);

      const td = $("<td>", {
        text: `R-${i} C-${j}`,
        "data-row": i,
        "tabindex": "-1",
        "role": "gridcell",
        "data-column": j,
        class: j < freeze_column ? "freeze-columns" : "",
        style: `left: ${frozen_column_left}px;`,
      });

      bodyRow.append(td);
    }

    tbody.append(bodyRow);
  }

  table.append(thead);
  table.append(tbody);

  $('.luna-spreadsheet').append(table);

  // Set the initial keyboard focus cell
  $('.luna-spreadsheet table tbody td[data-row="0"][data-column="0"]').attr('tabindex', '0');
  
}

createSpreadsheet(columns, rows, freeze_column);
register_events()
