const spreadsheet_selection = {
    active_cell: null,
    range: null
};

export function mousedown_handler(event) {
    const td = $(event.target).closest("td");

    if (td.length === 0) {
        return;
    }
    const coordinate = get_cell_coordinate(td);

    spreadsheet_selection.active_cell = coordinate;

    spreadsheet_selection.range = {
        start_row: coordinate.row,
        start_column: coordinate.column,
        end_row: coordinate.row,
        end_column: coordinate.column
    };

    update_selection();
}

export function mouseover_handler(event) {
    const td = $(event.target).closest("td");

    if (td.length === 0) {
        return;
    }
    
    $("td.selection").removeClass("selection");
    td.addClass('selection');
}

export function mouseup_handler(event) {
    const td = $(event.target).closest("td");

    if (td.length === 0) {
        return;
    }
    
    $("td.selection").removeClass("selection");
    td.addClass('selection');
}


function get_cell_coordinate(td) {
    return {
        row: td.attr("data-row") * 1,
        column: td.attr("data-column") * 1
    };
}


function update_selection_borders(cell_coordinate, selection_range) {
    if (selection_range.start_row === cell_coordinate.row) {
        // top border
    }

    if (selection_range.start_column === cell_coordinate.column) {
        // left border
    }

    if (selection_range.end_row === cell_coordinate.row) {
        // bottom border
    }

    if (selection_range.end_column === cell_coordinate.column) {
        // right border
    }
}

// function d()