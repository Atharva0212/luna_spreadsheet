import { get_cell_from_coordinates, get_spreadsheet_selection, set_active_cell_and_range_selection } from "./selection";

let copied_data = '';

export function copy_handler(event: JQuery.TriggeredEvent) {
    const spreadsheet_selection = get_spreadsheet_selection();

    if (!spreadsheet_selection.selected_cell_range) {
        return;
    }

    const start_row = spreadsheet_selection.selected_cell_range.start_row;
    const start_column = spreadsheet_selection.selected_cell_range.start_column;
    const end_row = spreadsheet_selection.selected_cell_range.end_row;
    const end_column = spreadsheet_selection.selected_cell_range.end_column;
    copied_data = '';
    const rows = [];

    for (let i = start_row; i <= end_row; i++) {
        const row = [];
        for (let j = start_column; j <= end_column; j++) {
            const td = get_cell_from_coordinates(i, j);

            if (td) {
                row.push(td.html());
            }
        }
        rows.push(row.join('\t'));
    }

    copied_data = rows.join('\n');

    const clipboard_event = event.originalEvent as ClipboardEvent;

    if (clipboard_event && clipboard_event.clipboardData) {
        event.preventDefault();

        clipboard_event.clipboardData.setData('text/plain', copied_data);
    }
}

function parse_copied_data() {
    if (copied_data === '') {
        return null;
    }

    const rows = copied_data.split('\n');
    const data = [];

    for (let i = 0; i < rows.length; i++) {
        data.push(rows[i].split('\t'));
    }

    return data;
}

export function paste_handler(event: JQuery.Event) {
    event.preventDefault();

    const spreadsheet_selection = get_spreadsheet_selection();

    if (!spreadsheet_selection.selected_cell_range) {
        return;
    }

    const copied_data = parse_copied_data();

    if (!copied_data) {
        return;
    }
    
    const start_row = spreadsheet_selection.selected_cell_range.start_row;
    const start_column = spreadsheet_selection.selected_cell_range.start_column;
    const end_row = spreadsheet_selection.selected_cell_range.end_row;
    const end_column = spreadsheet_selection.selected_cell_range.end_column;

    const copied_rows = copied_data.length;
    const copied_columns = copied_data[0].length;

    const selected_rows = end_row - start_row + 1;
    const selected_columns = end_column - start_column + 1;

    const max_rows = Math.max(selected_rows, copied_rows);
    const max_columns = Math.max(selected_columns, copied_columns);

    fill_cells_with_repeating_data(copied_data, start_row, start_column, max_rows, max_columns);

    set_active_cell_and_range_selection({
        start_row: start_row,
        start_column: start_column,
        end_row: max_rows + start_row - 1,
        end_column: max_columns + start_column - 1
    });
}

export function fill_cells_with_repeating_data(copied_data: string[][], start_row: number, start_column: number, total_rows: number, total_columns: number) {
    for (let i = 0; i < total_rows; i++) {
        const source_row = i % copied_data.length;
        const row = copied_data[source_row];

        for (let j = 0; j < total_columns; j++) {
            const source_column = j % row.length;

            const destination_row = start_row + i;
            const destination_column = start_column + j;

            const td = get_cell_from_coordinates(destination_row, destination_column);

            if (td && td.length > 0) {
                td.html(row[source_column]);
            }
        }
    }
}