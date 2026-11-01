export function get_numeric_value(value: any, default_value: number = 0) {
    return typeof value === 'number' && !isNaN(value) ? value : default_value;
}