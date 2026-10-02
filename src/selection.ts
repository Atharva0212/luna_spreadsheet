import { $ } from "jquery";
import { SPREADSHEET_KEY } from "./keyboard_constants";

type ActiveCell = {
    row: number;
    column: number;
};

type CellRange = {
    start_row: number;
    start_column: number;
    end_row: number;
    end_column: number;
};

type SpreadsheetSelection = {
    active_cell: ActiveCell | null;
    selected_cell_range: CellRange | null;
    is_selecting: boolean;
};

const spreadsheet_selection: SpreadsheetSelection = {
    active_cell: null,
    selected_cell_range: null,
    is_selecting: false,
};

export function mousedown_handler(event: JQuery.MouseDownEvent) {
    const cell = $(event.target).closest<HTMLTableCellElement>("th, td");

    if (cell.length === 0) {
        return;
    }

    if (cell.closest("thead").length > 0) {
        const column = Number(cell.attr('data-column'));
        const column_cells = $('.luna-spreadsheet table tbody td[data-column="' + column + '"]');
        
        if (column_cells.length === 0) {
            return;
        }
        
        spreadsheet_selection.active_cell = {
            row: 0,
            column: column
        }
        $(".luna-spreadsheet table tbody td.selected-cell").removeClass("selected-cell");
        $(".luna-spreadsheet table tbody td.active-cell").removeClass("active-cell");
        const first_column_cell = get_cell_from_coordinates(0, column) as JQuery<HTMLTableCellElement>;
        first_column_cell.addClass('active-cell');
        update_selection({
            start_row: 0,
            start_column: column,
            end_row: column_cells.length,
            end_column: column
        });
    }
    else if (cell.closest("tbody").length > 0) {
        const coordinate = get_cell_coordinates(cell);

        spreadsheet_selection.active_cell = coordinate;
        spreadsheet_selection.selected_cell_range = {
            start_row: coordinate.row,
            start_column: coordinate.column,
            end_row: coordinate.row,
            end_column: coordinate.column
        };
        spreadsheet_selection.is_selecting = true;

        // For now
        $(".luna-spreadsheet table tbody td.selected-cell").removeClass("selected-cell");
        $(".luna-spreadsheet table tbody td.active-cell").removeClass("active-cell");
        cell.addClass('active-cell');
        update_selection({
            start_row: coordinate.row,
            start_column: coordinate.column
        });
    }
}

export function mousemove_handler(event: JQuery.MouseMoveEvent) {
    if (!spreadsheet_selection.active_cell || !spreadsheet_selection.is_selecting) {
        return;
    }

    const td = $(event.target).closest("td");

    if (td.length === 0) {
        return;
    }

    const coordinate = get_cell_coordinates(td);

    // For now
    $(".luna-spreadsheet td.selected-cell").removeClass("selected-cell");
    const selected_cell_range = normalize_range(spreadsheet_selection.active_cell.row, spreadsheet_selection.active_cell.column, coordinate.row, coordinate.column);
    spreadsheet_selection.selected_cell_range = selected_cell_range;
    update_selection(selected_cell_range);
}

export function mouseup_handler() {
    spreadsheet_selection.is_selecting = false;
}

export function keydown_handler(event: JQuery.KeyDownEvent) {
    if (event.key === SPREADSHEET_KEY.ENTER) {
        event.preventDefault();
        console.log("hello ravi");
    }
    else if (event.key === SPREADSHEET_KEY.TAB) {
        event.preventDefault();
        
    }
}

function get_cell_coordinates(td: JQuery<HTMLTableCellElement>) {
    return {
        row: Number(td.attr("data-row")),
        column: Number(td.attr("data-column"))
    };
}

function get_cell_from_coordinates(row: number, column: number): JQuery<HTMLTableCellElement> | null {
    return $('.luna-spreadsheet tbody td[data-row="' + row + '"][data-column="' + column + '"]');
}

function update_selection(selected_cell_range: Pick<CellRange, 'start_row' | 'start_column'> & Partial<Pick<CellRange, 'end_row' | 'end_column'>>) {
    const start_row = selected_cell_range.start_row;
    const start_column = selected_cell_range.start_column;
    const end_row = selected_cell_range.end_row;
    const end_column = selected_cell_range.end_column;

    if (end_row === undefined || end_column === undefined) {
        const td = get_cell_from_coordinates(start_row, start_column);

        if (td) {
            td.addClass('selected-cell')
        }
    }
    else {
        for (let i = start_row; i <= end_row; i++) {
            for (let j = start_column; j <= end_column; j++) {
                const td = get_cell_from_coordinates(i, j);

                if (td) {
                    td.addClass('selected-cell')
                }
            }
        }
    }
}

function normalize_range(start_row: CellRange['start_row'], start_column: CellRange['start_column'], end_row: CellRange['end_row'], end_column: CellRange['end_column']): CellRange {
    return {
        start_row: Math.min(start_row, end_row),
        start_column: Math.min(start_column, end_column),
        end_row: Math.max(start_row, end_row),
        end_column: Math.max(start_column, end_column)
    };
}

// function update_selection_borders(cell_coordinate, selection_range) {
//     if (selection_range.start_row === cell_coordinate.row) {
//         // top border
//     }

//     if (selection_range.start_column === cell_coordinate.column) {
//         // left border
//     }

//     if (selection_range.end_row === cell_coordinate.row) {
//         // bottom border
//     }

//     if (selection_range.end_column === cell_coordinate.column) {
//         // right border
//     }
// }
