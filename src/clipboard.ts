import { get_cell_from_coordinates, get_spreadsheet_selection } from "./selection";

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
    console.log(copied_data);

    if (!copied_data) {
        return;
    }



    const start_row = spreadsheet_selection.selected_cell_range.start_row;
    const start_column = spreadsheet_selection.selected_cell_range.start_column;
    const end_row = spreadsheet_selection.selected_cell_range.end_row;
    // const end_column = spreadsheet_selection.selected_cell_range.end_column;
    const copied_rows = copied_data.length;

    for (let i = start_row; i <= end_row; i++) {
        const normalised_row = i - start_row;
        const selected_row = normalised_row % copied_rows;

        // if ()

        for (let j = 0; j < copied_data[selected_row].length; j++) {
            const destination_column = start_column + j;
            const td = get_cell_from_coordinates(i, destination_column);

            if (td && td.length > 0) {
                td.html(copied_data[selected_row][j]);
            }
        }
    }
}