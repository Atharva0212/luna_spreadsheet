import { columns } from "./data";
import { text_editor_methods } from "./editors/text_editor";
import type { SpreadsheetEditor, SpreadsheetEditorMethods } from "./editors/type";
import { get_cell_from_coordinates, type Cell } from "./selection";

export let spreadsheet_editor: SpreadsheetEditor = null;

export const spreadsheet_editors: Partial<Record<typeof columns[number]['type'], SpreadsheetEditorMethods>> = {
  text: text_editor_methods,
};

export function open_editor(cell_coordinates: Cell, empty: boolean) {
    const td = get_cell_from_coordinates(cell_coordinates.row, cell_coordinates.column);

    if (!td) {
        return;
    }
    
    const column_type = get_column_type_by_index(cell_coordinates.column);
    
    if (!column_type) {
        return;
    }
    
    const editor = spreadsheet_editors[column_type];
    
    if (!editor) {
        return;
    }

    const original_value = editor.open_editor(td, empty);

    spreadsheet_editor = {
        cell: cell_coordinates,
        original_value: original_value,
    };    
}

export function close_editor(should_restore_original_value: boolean) {
    if (!spreadsheet_editor) {
        return;
    }

    const td  = get_cell_from_coordinates(spreadsheet_editor.cell.row, spreadsheet_editor.cell.column);

    if (!td) {
        return;
    }

    const column_type = get_column_type_by_index(spreadsheet_editor.cell.column);

    if (!column_type) {
        return;
    }

    const editor = spreadsheet_editors[column_type];

    if (!editor) {
        return;
    }
    editor.close_editor(td, should_restore_original_value);
    spreadsheet_editor = null;
}

export function get_column_type_by_index(column_index: Cell['column']): typeof columns[number]['type'] | null {
    const column = columns[column_index];

    if (!column) {
        return null;
    }

    return column['type'];
}


// export function handle_escape() {
//     if (!spreadsheet_editor.cell) {
//         return;
//     }

//     const td = get_cell_from_coordinates(spreadsheet_editor.cell.row, spreadsheet_editor.cell.column);

//     if (!td) {
//         return;
//     }

//     td.empty(); 
    
//     td.html(spreadsheet_editor.original_value);
//     spreadsheet_editor = null;
// }