import type { ElementType } from "./editors/type";
import { get_cell_coordinates, type Cell, type CellRange, type SpreadsheetSelection } from "./selection";

type FillSelection = null | {
    source_range: CellRange,
    target_range: null | CellRange,
};

export let fill_selection: FillSelection = null;

export function set_fill_selection(value: FillSelection) {
    fill_selection = value;
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
    td.addClass('fill-range-cell');

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
            console.log("its on top");
        }
        else {
            // moved bottom
            console.log("its on bottom");
        }
    }

    console.log(fill_selection.target_range);
    
}

function are_range_equal(source_range: CellRange, target_range: CellRange) {
    return (
        source_range.start_row === target_range.start_row &&
        source_range.start_column === target_range.start_column &&
        source_range.end_row === target_range.end_row &&
        source_range.end_column === target_range.end_column
    );
}