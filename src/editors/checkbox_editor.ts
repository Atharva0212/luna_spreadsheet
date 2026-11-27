import { $ } from "jquery";
import { get_column_type_by_index } from "../editor";
import { SPREADSHEET_KEY } from "../keyboard_constants";
import { get_cell_from_coordinates, get_spreadsheet_selection, type CellRange } from "../selection";
import type { CreateCellParameters, GetValueParameters, KeydownEventParameters, SetValueParameters } from "./type";
// import 'jquery-ui/dist/themes/base/jquery-ui.css';
// import 'jquery-ui/dist/jquery-ui.js';


export const checkbox_editor_methods = {
	create_cell: function(td: CreateCellParameters[0], row: CreateCellParameters[1], column: CreateCellParameters[2]) {
		const input = $('<input>', {
			type: 'checkbox',
			id: `checkbox_${row}_${column}`
		});

		input.css({
			width: '100%',
			display: 'flex'
		});

		td.empty().append(input);

		return td;
	},
	open_editor: function () {
	},
	close_editor: function() { 
	},
	get_value: function(td: GetValueParameters[0]) {
		return td.find('input[type="checkbox"]').is(':checked') ? 1 : -1;
	},
	set_value: function(td: SetValueParameters[0], value: SetValueParameters[1]) {
		td.find('input[type="checkbox"]').prop('checked', value);
	},
	handle_keydown_event: function(event: KeydownEventParameters) {
		if (event.key === SPREADSHEET_KEY.SPACE) {
			const spreadsheet_selection = get_spreadsheet_selection();
			const selected_cell_range = spreadsheet_selection.selected_cell_range as CellRange;
	
			const should_check_all = should_check_all_selected_checkboxes(selected_cell_range);
			
			for (let i = selected_cell_range.start_row; i <= selected_cell_range.end_row; i++) {
				for (let j = selected_cell_range.start_column; j <= selected_cell_range.end_column; j++) {
					const column_type = get_column_type_by_index(j);
	
					if (column_type === 'checkbox') {
						const td = get_cell_from_coordinates(i, j) as JQuery<HTMLTableCellElement>;
						checkbox_editor_methods.set_value(td, should_check_all);
					}
				}
			}
		}
	}
}

function should_check_all_selected_checkboxes(selected_cell_range: CellRange) {
	for (let i = selected_cell_range.start_row; i <= selected_cell_range.end_row; i++) {
		for (let j = selected_cell_range.start_column; j <= selected_cell_range.end_column; j++) {
			const column_type = get_column_type_by_index(j);

			if (column_type === 'checkbox') {
				const td = get_cell_from_coordinates(i, j) as JQuery<HTMLTableCellElement>;
				const checkbox_value = checkbox_editor_methods.get_value(td);

				if (checkbox_value !== 1) {
					return true;
				}
			}
		}
	}

	return false;
}