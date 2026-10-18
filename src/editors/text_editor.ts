import { $ } from "jquery";
import { spreadsheet_editor } from "../editor";
import type { CloseEditorParameters, CreateCellParameters, GetValueParameters, OpenEditorParameters } from "./type";
import { row_data } from "../data";

export const text_editor_methods = {
    create_cell: function(td: CreateCellParameters[0], row: CreateCellParameters[1], column: CreateCellParameters[2]) {
        td.text(row_data[row][column]);
        return td;
    },
    open_editor: function (td: OpenEditorParameters[0], empty: OpenEditorParameters[1]) {
        const cell_value = this.get_value(td);
        const value = empty ? '' : cell_value;
        const input = $("<input>", {
            type: "text",
            class: "text-editor"
        }).val(value);
        
        td.empty().append(input);

        input.trigger("focus");

        return cell_value;
    },
    close_editor: function(td: CloseEditorParameters[0], should_restore_original_value: CloseEditorParameters[1]) { 
        let cell_value = '';

        if (should_restore_original_value) {
            if (spreadsheet_editor) {
                cell_value = spreadsheet_editor.original_value;
            }
        } 
        else {
            const input = td.find('input');
            const input_value = input.val();

            if (input_value) {
                cell_value = input_value;
            }
        }

        td.empty();
        
        td.text(cell_value);
    },
    get_value: function(td: GetValueParameters[0]) {
        return td.text();
    },
}