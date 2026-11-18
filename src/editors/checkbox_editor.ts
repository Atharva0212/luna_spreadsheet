import { spreadsheet_editor } from "../editor";
import type { CloseEditorParameters, CreateCellParameters, GetValueParameters, OpenEditorParameters, SetValueParameters } from "./type";
// import 'jquery-ui/dist/themes/base/jquery-ui.css';
// import 'jquery-ui/dist/jquery-ui.js';


export const checkbox_editor_methods = {
	create_cell: function(td: CreateCellParameters[0], row: CreateCellParameters[1], column: CreateCellParameters[2]) {
		td.html(`<input type="checkbox" id="checkbox_${row}_${column}">`);
		return td;
	},
	open_editor: function (td: OpenEditorParameters[0]) {
		let checkbox = td.find('input');
		checkbox.prop('checked', !checkbox.prop('checked'));
	},
	close_editor: function(td: CloseEditorParameters[0], should_restore_original_value: CloseEditorParameters[1]) { 
	},
	get_value: function(td: GetValueParameters[0]) {
		return td.find('input[type="checkbox"]').is(':checked') ? 1 : -1;
	},
	set_value: function(td: SetValueParameters[0], value: SetValueParameters[1]) {
		td.find('input[type="checkbox"]').prop('checked', Boolean(value));
	}
}