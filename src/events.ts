import $ from 'jquery';
import { mousedown_handler, mouseenter_handler, mouseup_handler } from "./selection.ts";

export function register_events() {    
    $('.luna-spreadsheet').on('mousedown', mousedown_handler);
    $('.luna-spreadsheet').on('mouseenter', mouseenter_handler);
    $('.luna-spreadsheet').on('mouseup', mouseup_handler);
}