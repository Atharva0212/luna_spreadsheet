
import { $ } from 'jquery';
import { register_events } from './events';
import { columns, row_data } from './data';

// const columns = 20;
// const rows = 40;
const freeze_column = 3;

function get_frozen_column_left(index: number, cell_width: number) {
	const border_width = 0.5;

	if (index === 0) {
		return 0;
	}

	return cell_width + border_width + (index - 1) * cell_width;
}

function createSpreadsheet(freeze_column: number) {
	const table = $('<table>', {
		'tabindex': 0
	});

	// THEAD
	const thead = $('<thead>');
	const colgroup = $('<colgroup>');
	const header_row = $('<tr>');

	for (let i = 0; i < columns.length; i++) {
		const column = columns[i];

		const th = $('<th>', {
			text: column.title,
			'data-column': i
		});
		header_row.append(th);
		
		const col = $('<col>', {
        	style: 'min-width: ' + column.width + 'px;'
    	});

    	colgroup.append(col);
	}

	thead.append(header_row);

	// TBODY
	const tbody = $('<tbody>');

	for (let i = 0; i < row_data.length; i++) {
		const bodyRow = $('<tr>');

		for (let j = 0; j < columns.length; j++) {
			const frozen_column_left = get_frozen_column_left(j, 69.25);

			const td = $('<td>', {
				text: row_data[i][j],
				'tabindex': '-1',
				'role': 'gridcell',
				'data-row': i,
				'data-column': j,
				class: j < freeze_column ? 'freeze-columns' : ''
			});

			bodyRow.append(td);
		}

		tbody.append(bodyRow);
	}

	table.append(thead);
	table.append(colgroup);
	table.append(tbody);

	$('.luna-spreadsheet').append(table);
}

createSpreadsheet(freeze_column);
register_events()
