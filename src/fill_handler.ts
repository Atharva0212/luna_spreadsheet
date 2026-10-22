import { $ } from "jquery";
import type { ElementType } from "./editors/type";
import { get_cell_coordinates, get_cell_from_coordinates, type CellRange, type SpreadsheetSelection } from "./selection";

type FillSelection = null | {
    source_range: CellRange,
    target_range: null | CellRange,
};

export let fill_selection: FillSelection = null;

export function unset_fill_selection() {
    fill_selection = null;
    $(".luna-spreadsheet table tbody td.fill-range-cell").removeClass("fill-range-cell");

}

export function handle_fill_mousedown(spreadsheet_selection: SpreadsheetSelection) {
    const selected_cell_range = spreadsheet_selection.selected_cell_range;

    if (!selected_cell_range ) {
        return;
    }

    spreadsheet_selection.is_selecting = false;

    fill_selection = {
        source_range: selected_cell_range,
        target_range: null
    }
}

export function handle_fill_mouseover(td: ElementType) {
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
                start_row: fill_selection.source_range.start_row,
                start_column: coordinates.column,
                end_row: fill_selection.source_range.end_row,
                end_column: fill_selection.source_range.start_column - 1,
            };
        }
        else {
            // moved right
            fill_selection.target_range = {
                start_row: fill_selection.source_range.start_row,
                start_column: fill_selection.source_range.end_column + 1,
                end_row: fill_selection.source_range.end_row,
                end_column: coordinates.column,
            };
        }
    }
    else {
        // on the same column
        if (coordinates.row < fill_selection.source_range.start_row) {
            // moved top
            fill_selection.target_range = {
                start_row: coordinates.row,
                start_column: fill_selection.source_range.start_column,
                end_row: fill_selection.source_range.start_row - 1,
                end_column: fill_selection.source_range.end_column,
            }
        }
        else {
            // moved bottom
            fill_selection.target_range = {
                start_row: fill_selection.source_range.end_row + 1,
                start_column: fill_selection.source_range.start_column,
                end_row: coordinates.row,
                end_column: fill_selection.source_range.end_column,
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

            if (cell && cell.length > 0)  {
                cell.addClass('fill-range-cell');
            }
        }   
    }
}

export function position_fill_handle(cell: HTMLTableCellElement) {
    const cell_rect = cell.getBoundingClientRect();

        $('div.fill-handle').css({
            display: 'block',
            top: `${cell_rect.bottom - 2}px`,
            left: `${cell_rect.right - 2}px`
        });
}


function are_range_equal(source_range: CellRange, target_range: CellRange) {
    return (
        source_range.start_row === target_range.start_row &&
        source_range.start_column === target_range.start_column &&
        source_range.end_row === target_range.end_row &&
        source_range.end_column === target_range.end_column
    );
}