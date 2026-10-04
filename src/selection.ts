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

        set_active_cell_selection({
            start_row: 0,
            start_column: column,
            end_row: column_cells.length,
            end_column: column
        });
        spreadsheet_selection.is_selecting = true;
    }
    else if (cell.closest("tbody").length > 0) {
        const coordinates = get_cell_coordinates(cell);

        set_active_cell_selection({
            start_row: coordinates.row,
            start_column: coordinates.column,
            end_row: coordinates.row,
            end_column: coordinates.column
        });
        spreadsheet_selection.is_selecting = true;
    }
}

export function mouseenter_handler(event: JQuery.MouseEnterEvent) {
    if (!spreadsheet_selection.active_cell || !spreadsheet_selection.is_selecting) {
        return;
    }

    const td = $(event.target).closest("td");

    if (td.length === 0) {
        return;
    }

    const coordinates = get_cell_coordinates(td);
    const selected_cell_range = normalize_range(spreadsheet_selection.active_cell.row, spreadsheet_selection.active_cell.column, coordinates.row, coordinates.column);

    set_selection(selected_cell_range);
}

export function mouseup_handler() {
    console.log("hi", Math.random());
    
    spreadsheet_selection.is_selecting = false;
}

export function keydown_handler(event: JQuery.KeyDownEvent) {  
    if (event.key === SPREADSHEET_KEY.ENTER) {
        event.preventDefault();
        
    }
    else if (event.key === SPREADSHEET_KEY.TAB) {
        event.preventDefault();

        let row = 0;
        let column = 0;

        if (spreadsheet_selection.active_cell) {
            const active_cell_row = spreadsheet_selection.active_cell.row;
            const active_cell_column = spreadsheet_selection.active_cell.column;
            const td = get_cell_from_coordinates(active_cell_row, active_cell_column);

            if (td && td.length > 0) {

                if (event.shiftKey) {
                    if (td.is(":first-of-type")) {
                        const row_count = td.closest("tbody").find('tr').length;
                        
                        row = (active_cell_row - 1 + row_count) % row_count;
                        column = Math.max(0, td.closest('tr').find('td').length - 1);
                    }
                    else {
                        row = active_cell_row;
                        column = active_cell_column - 1;
                    }
                }
                else {
                    if (td.is(":last-of-type")) {
                        const row_count = td.closest("tbody").find("tr").length;
                        row = (active_cell_row + 1) % row_count;
                    }
                    else {
                        row = active_cell_row;
                        column = active_cell_column + 1;
                    }
                }
            }
        }
        
        set_active_cell_selection({
            start_row: row,
            start_column: column,
            end_row: row,
            end_column: column,
        });  
        
        const active_cell = get_cell_from_coordinates(row, column);

        if (active_cell && active_cell.length > 0) {
            active_cell[0].focus();
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

function set_active_cell_selection(cell_range: CellRange) {
    $(".luna-spreadsheet table tbody td.active-cell").removeClass("active-cell");

    const active_cell = get_cell_from_coordinates(cell_range.start_row, cell_range.start_column) as JQuery<HTMLTableCellElement>;
    active_cell.addClass('active-cell');
    
    spreadsheet_selection.active_cell = {
        row: cell_range.start_row,
        column: cell_range.start_column
    };
    set_selection(cell_range);
}

function set_selection(cell_range: CellRange) {
    spreadsheet_selection.selected_cell_range = cell_range;

    // For now
    $(".luna-spreadsheet table tbody td.selected-cell").removeClass("selected-cell");
    update_selection(cell_range);
}

function update_selection(cell_range: CellRange) {
    const start_row = cell_range.start_row;
    const start_column = cell_range.start_column;
    const end_row = cell_range.end_row;
    const end_column = cell_range.end_column;

    for (let i = start_row; i <= end_row; i++) {
        for (let j = start_column; j <= end_column; j++) {
            const td = get_cell_from_coordinates(i, j);

            if (td) {
                td.addClass('selected-cell')
            }
        }
    }
}

function get_cell_coordinates(td: JQuery<HTMLTableCellElement>) {
    // Improve the logic
    return {
        row: Number(td.attr("data-row")),
        column: Number(td.attr("data-column"))
    };
}

function get_cell_from_coordinates(row: number, column: number): JQuery<HTMLTableCellElement> | null {
    return $('.luna-spreadsheet tbody td[data-row="' + row + '"][data-column="' + column + '"]');
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
