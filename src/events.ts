import $ from 'jquery';
import { keydown_handler, mousedown_handler, mouseeover_handler, mouseup_handler } from "./selection.ts";
import { copy_handler, paste_handler } from './clipboard.ts';

export function register_events() {    
    const spreadsheet = $('.luna-spreadsheet');
    
    // Mouse Events
    spreadsheet.on('mousedown', mousedown_handler);
    spreadsheet.on('mouseover', 'table tbody td', mouseeover_handler);
    $(document).on('mouseup', mouseup_handler);

    // Keyboard Events
    spreadsheet.on('keydown', keydown_handler);
    
    spreadsheet.on('copy', copy_handler);
    spreadsheet.on('paste', paste_handler);

}