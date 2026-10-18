
import { $ } from 'jquery';
import { register_events } from './events';
import { columns, row_data } from './data';
import { get_column_type_by_index, spreadsheet_editors } from './editor';

// const columns = 20;
// const rows = 40;
const freeze_column = 3;

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
			let td = $('<td>', {
				'tabindex': '-1',
				'role': 'gridcell',
				'data-row': i,
				'data-column': j,
				class: j < freeze_column ? 'freeze-columns' : ''
			}) as JQuery<HTMLTableCellElement>;

			const column_type = get_column_type_by_index(j);
				
			if (column_type) {
				const editor = spreadsheet_editors[column_type];
				if (editor) {
					td = editor.create_cell(td, i, j);
				}
			}
			
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
