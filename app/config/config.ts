// Game board dimensions
const WIDTH = 600;
const HEIGHT = 600;
const CELL_SIZE = 10;
const LARGE_CELL_SIZE = CELL_SIZE * 10;

// Calculate the number of rows and columns based on board dimensions and cell size
const NUM_ROWS = Math.floor(HEIGHT / CELL_SIZE);
const NUM_COLS = Math.floor(WIDTH / CELL_SIZE);

// Define colors for dead and alive cells
const COLORS = ['black', '#FBAE3A'] as const;

const GAME_SPEED = 100; // Time frame for every step
const MAX_HISTORY = 1000; // Max number of steps to store on the board

// Export everything as a single object
export const config = {
  WIDTH,
  HEIGHT,
  CELL_SIZE,
  LARGE_CELL_SIZE,
  NUM_ROWS,
  NUM_COLS,
  COLORS,
  GAME_SPEED,
  MAX_HISTORY,
};