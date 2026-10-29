
import { $ } from 'jquery';
import { register_events } from './events';
import { columns, row_data } from './data';
import { get_column_type_by_index, spreadsheet_editors } from './editor';
import { get_cell_from_coordinates } from './selection';

const freeze_column = 3;

function createSpreadsheet() {
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
		const body_row = $('<tr>');

		for (let j = 0; j < columns.length; j++) {
			let td = $('<td>', {
				'tabindex': '-1',
				'role': 'gridcell',
				'data-row': i,
				'data-column': j,
			}) as JQuery<HTMLTableCellElement>;

			const column_type = get_column_type_by_index(j);
				
			if (column_type) {
				const editor = spreadsheet_editors[column_type];
				if (editor) {
					td = editor.create_cell(td, i, j);
				}
			}
			
			body_row.append(td);
		}

		tbody.append(body_row);
	}

	table.append(thead);
	table.append(colgroup);
	table.append(tbody);

	$('.luna-spreadsheet').append(table);
}

function make_freeze_column(freeze_column: number) {
	if (freeze_column === 0) {
		return;
	}

	const max_rows = row_data.length;
	const max_columns = columns.length;

	for (let i = 0; i < max_columns; i++) {
		
		if (i >= freeze_column) {
			return;
		}
		
		const th = $('.luna-spreadsheet table thead tr th').eq(i);
		const th_left_position = th[0].getBoundingClientRect().left;
		th.css({
			'left': th_left_position + 'px',
			'z-index' : 999
		});

		for (let j = 0; j < max_rows; j++) {
			const cell = get_cell_from_coordinates(j, i);
			if (cell && cell.length > 0) {
				cell.addClass('freeze-columns');
				cell.css('left', th_left_position + 'px');
			}
		}
	}
}

createSpreadsheet();
make_freeze_column(freeze_column);
register_events()
