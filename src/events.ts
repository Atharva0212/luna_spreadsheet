import $ from 'jquery';
import { keydown_handler, mousedown_handler, mouseenter_handler, mouseup_handler } from "./selection.ts";

export function register_events() {    
    const spreadsheet = $('.luna-spreadsheet');
    
    // Mouse Events
    spreadsheet.on('mousedown', mousedown_handler);
    spreadsheet.on('mouseenter', 'table tbody td', mouseenter_handler);
    $(document).on('mouseup', mouseup_handler);

    // Keyboard Events
    spreadsheet.on('keydown', keydown_handler);

}