import { $ } from "jquery";
import { get_cell_from_coordinates, type Cell } from "./selection"
import { columns } from "./data";

type SpreadsheetEditor =
  | null
  | {
      cell: Cell;
      original_value: string;
    };
    
export let spreadsheet_editor: SpreadsheetEditor = null;

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

function get_column_type_by_index(column_index: Cell['column']): typeof columns[number]['type'] | null {
    const column = columns[column_index];

    if (!column) {
        return null;
    }

    return column['type'];
}

const text_editor_methods = {
    create_cell: function() {

    },
    open_editor: function (td: Parameters<SpreadsheetEditorMethods['open_editor']>[0], empty: Parameters<SpreadsheetEditorMethods['open_editor']>[1]): ReturnType<SpreadsheetEditorMethods['open_editor']> {
        const cell_value = this.get_value(td);
        const value = empty ? '' : cell_value;
        const input = $("<input>", {
            type: "text",
            class: "text-editor"
        }).val(value);

        
        td.empty().append(input);

        return cell_value;
    },
    close_editor: function() {

    },
    get_value: function(td: Parameters<SpreadsheetEditorMethods['get_value']>[0]) {
        return td.text();
    },
}

type SpreadsheetEditorMethods = {
  create_cell: () => void;
  open_editor: (td: JQuery<HTMLTableCellElement>, empty: boolean) => string;
  close_editor: () => void;
  get_value: (td: JQuery<HTMLTableCellElement>) => string;
};

const spreadsheet_editors: Partial<Record<typeof columns[number]['type'], SpreadsheetEditorMethods>> = {
  text: text_editor_methods,
};


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