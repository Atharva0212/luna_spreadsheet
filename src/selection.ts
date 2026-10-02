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
    cell_range: CellRange | null;
};

const spreadsheet_selection: SpreadsheetSelection = {
    active_cell: null,
    cell_range: null
};

export function mousedown_handler(event: JQuery.MouseDownEvent) {
    if (!event.target) {
        return;
    }
    const td = $(event.target).closest("td");

    if (td.length === 0) {
        return;
    }
    const coordinate = get_cell_coordinate(td);

    spreadsheet_selection.active_cell = coordinate;

    spreadsheet_selection.cell_range = {
        start_row: coordinate.row,
        start_column: coordinate.column,
        end_row: coordinate.row,
        end_column: coordinate.column
    };

    // update_selection();
}

export function mouseenter_handler(event: JQuery.MouseEnterEvent) {
    const td = $(event.target).closest("td");

    if (td.length === 0) {
        return;
    }
    
    $("td.selection").removeClass("selection");
    td.addClass('selection');
}

export function mouseup_handler(event: JQuery.MouseUpEvent) {
    if (!event.target) {
        return;
    }

    const td = $(event.target).closest("td");

    if (td.length === 0) {
        return;
    }
    
    $("td.selection").removeClass("selection");
    td.addClass('selection');
}


function get_cell_coordinate(td: JQuery<HTMLTableCellElement>) {
    return {
        row: Number(td.attr("data-row")),
        column: Number(td.attr("data-column"))
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
