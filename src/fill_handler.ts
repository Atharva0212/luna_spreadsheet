import { $ } from "jquery";
import type { ElementType } from "./editors/type";
import { get_cell_coordinates, get_cell_from_coordinates, get_spreadsheet_selection, set_active_cell, set_selection, type CellRange, type SpreadsheetSelection } from "./selection";
import { get_column_type_by_index, spreadsheet_editors } from "./editor";
import { fill_cells_with_repeating_data } from "./clipboard";
import { scroll_container } from ".";
import { get_numeric_value } from "./utils";

type FillSelection = null | {
	source_range: CellRange,
	target_range: null | CellRange,
};

export let fill_selection: FillSelection = null;

export function unset_fill_selection() {

	$(".luna-spreadsheet table tbody td.fill-range-cell").removeClass("fill-range-cell");

	if (!fill_selection || !fill_selection.target_range) {
		return;
	}

	let start_row;
	let start_column;
	let end_row;
	let end_column;

	if (fill_selection.target_range.end_row > fill_selection.source_range.end_row) {
		start_row = fill_selection.source_range.start_row;
		start_column = fill_selection.source_range.start_column;
		end_row = fill_selection.target_range.end_row;
		end_column = fill_selection.target_range.end_column;
	}
	else if (fill_selection.target_range.end_column > fill_selection.source_range.end_column) {
		start_row = fill_selection.source_range.start_row;
		start_column = fill_selection.source_range.start_column;
		end_row = fill_selection.target_range.end_row;
		end_column = fill_selection.target_range.end_column;
	}
	else if (fill_selection.target_range.start_row < fill_selection.source_range.start_row) {
		start_row = fill_selection.target_range.start_row;
		start_column = fill_selection.target_range.start_column;
		end_row = fill_selection.source_range.end_row;
		end_column = fill_selection.source_range.end_column;
	}
	else if (fill_selection.target_range.start_column < fill_selection.source_range.start_column) {
		start_row = fill_selection.target_range.start_row;
		start_column = fill_selection.target_range.start_column;
		end_row = fill_selection.source_range.end_row;
		end_column = fill_selection.source_range.end_column;
	}

	if (start_row != null && start_column != null && end_row != null && end_column != null) {
		set_active_cell({ row : start_row, column : start_column });

		const source_data = get_source_range_data(fill_selection);
		const target_row_count = fill_selection.target_range.end_row - fill_selection.target_range.start_row + 1;
		const target_column_count = fill_selection.target_range.end_column - fill_selection.target_range.start_column + 1;

		fill_cells_with_repeating_data(source_data, fill_selection.target_range.start_row, fill_selection.target_range.start_column, target_row_count, target_column_count);

		set_selection({
			start_row : start_row,
			start_column : start_column,
			end_row : end_row,
			end_column : end_column,
		});
	}

	fill_selection = null;
}

export function handle_fill_mousedown(spreadsheet_selection: SpreadsheetSelection) {
	const selected_cell_range = spreadsheet_selection.selected_cell_range;

	if (!selected_cell_range) {
		return;
	}

	spreadsheet_selection.is_selecting = false;

	fill_selection = {
		source_range : selected_cell_range,
		target_range : null
	}
}

export function handle_fill_mouseover(td : ElementType) {
	if (!fill_selection) {
		return;
	}

	const coordinates = get_cell_coordinates(td);

	$(".luna-spreadsheet table tbody td.fill-range-cell").removeClass("fill-range-cell");

	if (coordinates.row >= fill_selection.source_range.start_row && coordinates.row <= fill_selection.source_range.end_row) {
		// on the same row
		if (coordinates.column < fill_selection.source_range.start_column) {
			// moved left
			fill_selection.target_range = {
				start_row : fill_selection.source_range.start_row,
				start_column : coordinates.column,
				end_row : fill_selection.source_range.end_row,
				end_column : fill_selection.source_range.start_column - 1,
			};
		}
		else {
			// moved right
			fill_selection.target_range = {
				start_row : fill_selection.source_range.start_row,
				start_column : fill_selection.source_range.end_column + 1,
				end_row : fill_selection.source_range.end_row,
				end_column : coordinates.column,
			};
		}
	}
	else {
		// on the same column
		if (coordinates.row < fill_selection.source_range.start_row) {
			// moved top
			fill_selection.target_range = {
				start_row : coordinates.row,
				start_column : fill_selection.source_range.start_column,
				end_row : fill_selection.source_range.start_row - 1,
				end_column : fill_selection.source_range.end_column,
			}
		}
		else {
			// moved bottom
			fill_selection.target_range = {
				start_row : fill_selection.source_range.end_row + 1,
				start_column : fill_selection.source_range.start_column,
				end_row : coordinates.row,
				end_column : fill_selection.source_range.end_column,
			}
		}
	}

	const start_row = fill_selection.target_range.start_row;
	const start_column = fill_selection.target_range.start_column;
	const end_row = fill_selection.target_range.end_row;
	const end_column = fill_selection.target_range.end_column;

	for (let i = start_row; i < end_row + 1; i++) {
		for (let j = start_column; j < end_column + 1; j++) {
			const cell = get_cell_from_coordinates(i, j);

			if (cell && cell.length > 0) {
				cell.addClass('fill-range-cell');
			}
		}
	}
}

export function position_fill_handle(cell_range: CellRange) {
	let row, column;
	const spreadsheet_selection = get_spreadsheet_selection();
	const is_position_left = spreadsheet_selection.is_full_row_selected;

	if (is_position_left) {
		row = cell_range.end_row;
		column = cell_range.start_column;
	}
	else {
		row = cell_range.end_row;
		column = cell_range.end_column;
	}

	if (column === -1) {
		return;
	}

	const cell = get_cell_from_coordinates(row, column);

	if (cell == null || cell.length === 0) {
		return;
	}

	const cell_rect = cell[0].getBoundingClientRect();
	const x_scroll_position = get_numeric_value($(scroll_container.x_scroll_container).scrollLeft());
	const y_scroll_position = get_numeric_value($(scroll_container.y_scroll_container).scrollTop());
	const fill_handle_x_position = x_scroll_position + (is_position_left ? (cell_rect.left - 4)  : cell_rect.right - 2);
	const fill_handle_y_position = y_scroll_position + cell_rect.bottom - 2;

	if (cell.hasClass('freeze-columns')) {
		$('div.fill-handle-wrapper').css({
			display : 'block',
			top : `${fill_handle_y_position}px`,
			left : '',
			zIndex : 999,
		});

		$('div.fill-handle').css({
			position : 'sticky',
			left : `${fill_handle_x_position}px`,
		});
	}
	else {
		$('div.fill-handle-wrapper').css({
			display : 'block',
			top : `${fill_handle_y_position}px`,
			left : `${fill_handle_x_position}px`,
			zIndex : 9,
		});

		$('div.fill-handle').css({
			position : '',
			left : '',
		});
	}
}

export function unset_fill_handle() {
	$('div.fill-handle-wrapper').css({
		display : 'none',
		top : '',
		left : '',
		zIndex : '',
	});

	$('div.fill-handle').css({
		position : '',
		left : '',
	});

	fill_selection = null;
}

function get_source_range_data(fill_selection: Exclude<FillSelection, null>) {
	const source_data = [];

	for (let i = fill_selection.source_range.start_row; i < fill_selection.source_range.end_row + 1; i++) {
		const row_data = [];
		for (let j = fill_selection.source_range.start_column; j < fill_selection.source_range.end_column + 1; j++) {
			const cell = get_cell_from_coordinates(i, j);

			if (!cell) {
				row_data.push('');
				continue;
			}

			const column_type = get_column_type_by_index(j);

			if (!column_type) {
				row_data.push('');
				continue;
			}

			const editor = spreadsheet_editors[column_type];

			if (!editor) {
				row_data.push('');
				continue;
			}

			row_data.push(editor.get_value(cell));

		}
		source_data.push(row_data);
	}

	return source_data;
}