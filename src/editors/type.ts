import type { Cell, get_cell_from_coordinates } from "../selection";

export type SpreadsheetEditor =
  | null
  | {
      cell: Cell;
      original_value: string;
    };

type ElementType = Exclude<ReturnType<typeof get_cell_from_coordinates>, null>;

export type SpreadsheetEditorMethods = {
  create_cell: (td: ElementType, row: Cell['row'], column: Cell['column']) => ElementType;
  open_editor: (td: ElementType, empty: boolean) => string;
  close_editor: (td: ElementType, should_restore_original_value: boolean) => void;
  get_value: (td: ElementType) => string;
};

export type CreateCellParameters = Parameters<SpreadsheetEditorMethods['create_cell']>;
export type OpenEditorParameters = Parameters<SpreadsheetEditorMethods['open_editor']>;
export type CloseEditorParameters = Parameters<SpreadsheetEditorMethods['close_editor']>;
export type GetValueParameters = Parameters<SpreadsheetEditorMethods['get_value']>;
