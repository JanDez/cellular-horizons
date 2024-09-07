import { Board, CellState, CellWithShadow, CELL_STATE_ALIVE } from "@/app/types/types";
import { config } from '@/app/config/config';

const { NUM_ROWS, NUM_COLS } = config;

// Create an empty board with all cells dead (0)
export const createBoard = (): Board => {
  return Array.from({ length: NUM_ROWS }, () => 
    Array.from({ length: NUM_COLS }, () => [0, 0] as [CellState, ShadowState])
  );
};

// Count the number of live neighbors for a given cell
export const countNeighbors = (board: Board, row: number, col: number): number => {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newRow = (row + i + NUM_ROWS) % NUM_ROWS;
      const newCol = (col + j + NUM_COLS) % NUM_COLS;
      const cell = board[newRow][newCol];
      
      // VErify if the cell is an array (CellWithShadow) or a number (CellState)
      if (Array.isArray(cell)) {
        count += cell[0]; // Add the cell state to the count, pin this for future use
      } else {
        count += cell;
      }
    }
  }
  return count;
};

// Compute the next generation of the board based on Game of Life rules
export const computeNextBoard = (board: Board): Board => {
  const newBoard = board.map(row => row.map(cell => {
    if (Array.isArray(cell)) {
      return [...cell] as CellWithShadow;
    } else {
      return [cell, 0] as CellWithShadow; // Convert the CellState to CellWithShadow
    }
  }));
  
  for (let r = 0; r < NUM_ROWS; r++) {
    for (let c = 0; c < NUM_COLS; c++) {
      const aliveNeighbors = countNeighbors(board, r, c);
      let currentState: CellState;
      let currentShadow: ShadowState;

      const cell = newBoard[r][c];
      if (Array.isArray(cell)) {
        [currentState, currentShadow] = cell;
      } else {
        currentState = cell;
        currentShadow = 0;
      }

      let newState: CellState;
      let newShadow: ShadowState;

      if (currentState === 1) {
        newState = (aliveNeighbors === 2 || aliveNeighbors === 3) ? 1 : 0;
        newShadow = currentShadow;
      } else {
        newState = aliveNeighbors === 3 ? 1 : 0;
        newShadow = currentShadow;
      }

      if (currentState === 1 && newState === 0) {
        // Cell died, increase shadow
        newShadow = Math.min(currentShadow + 0.1, 1);
      } else if (currentState === 0 && newState === 1) {
        // Cell born, slightly decrease shadow
        newShadow = Math.max(currentShadow - 0.05, 0);
      } else {
        // Gradually fade shadow
        newShadow = Math.max(currentShadow - 0.01, 0);
      }

      newBoard[r][c] = [newState, newShadow];
    }
  }

  return newBoard;
};

// Function to determine if a cell has shadow
function isCellWithShadow(cell: CellState | CellWithShadow): cell is CellWithShadow {
  return Array.isArray(cell);
}

// Check if the current board state is in a loop
// Future use, to create a score board of some sort, pin this
export const isInfiniteLoop = (
  boardHistory: Board[] | string[] | { current: Board[] },
  currentBoard: Board
): boolean => {
  const boardString = JSON.stringify(currentBoard);

  if (Array.isArray(boardHistory)) {
    return boardHistory.some((board) =>
      typeof board === "string"
        ? board === boardString
        : JSON.stringify(board) === boardString
    );
  } else if (typeof boardHistory === "object" && boardHistory !== null) {
    if ("current" in boardHistory && Array.isArray(boardHistory.current)) {
      return boardHistory.current.some(
        (board) => JSON.stringify(board) === boardString
      );
    }
  }

  return false;
};

// Check if the game is over (all cells are dead)
// Future use, to create a score board of some sort, pin this
export const isGameOver = (board: Board): boolean => {
  return board.every(row => row.every(cell => cell === 0));
};

// Check if the board has any live cells
export const hasCells = (board: Board): boolean => {
  return board.some(row => row.some(cell => 
    Array.isArray(cell) ? cell[0] === CELL_STATE_ALIVE : cell === CELL_STATE_ALIVE
  ));
};