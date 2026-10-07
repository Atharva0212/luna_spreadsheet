import { get_cell_from_coordinates, get_spreadsheet_selection } from "./selection";

export function copy_handler(event: JQuery.Event) {
    const spreadsheet_selection = get_spreadsheet_selection();
    
    if (!spreadsheet_selection.selected_cell_range) {
        return;
    }

    const start_row = spreadsheet_selection.selected_cell_range.start_row;
    const start_column = spreadsheet_selection.selected_cell_range.start_column;
    const end_row = spreadsheet_selection.selected_cell_range.end_row;
    const end_column = spreadsheet_selection.selected_cell_range.end_column;
    let copied_data = '';

    for (let i = start_row; i <= end_row; i++) {
        for (let j = start_column; j <= end_column; j++) {
            const td = get_cell_from_coordinates(i, j);

            if (td) {
                copied_data += td.html() + '\t';
            }
        }
        copied_data += '\n';
    }
}