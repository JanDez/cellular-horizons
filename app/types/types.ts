// Tpyes definitions
export type CellState = 0 | 1;
export type ShadowState = number;
export type CellWithShadow = [CellState, ShadowState];
export type Board = (CellState | CellWithShadow)[][];

// Interface for patterns definition
export interface Pattern {
	name: string;
	cells: [number, number][];
}

// Constant values for cell states
export const CELL_STATE_DEAD = 0 as const;
export const CELL_STATE_ALIVE = 1 as const;

// Exportation of constant values
export const types = {
	CELL_STATE_DEAD,
	CELL_STATE_ALIVE,
} as const;
