import $ from 'jquery';
import { mousedown_handler, mousemove_handler, mouseup_handler, keydown_handler } from "./selection.ts";

export function register_events() {    
    const spreadsheet = $('.luna-spreadsheet');
    
    // Mouse Events
    spreadsheet.on('mousedown', mousedown_handler);
    spreadsheet.on('mousemove', mousemove_handler);
    spreadsheet.on('mouseup', mouseup_handler);

    // Keyboard Events
    spreadsheet.on('keydown', keydown_handler);

}