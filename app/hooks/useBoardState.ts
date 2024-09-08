import { useState, useCallback } from 'react';
import { Board, Pattern } from '@/app/types/types';
import { config } from '@/app/config/config'; // Import config as object

const { NUM_ROWS, NUM_COLS } = config; // Extract NUM_ROWS and NUM_COLS from the config object
import { createBoard } from '@/app/utils/boardUtils';

// Create a new board state with the createBoard function
export const useBoardState = () => {
  const [boardState, setBoardState] = useState<Board>(createBoard);
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  const resetBoard = useCallback(() => {
    setBoardState(createBoard());
  }, []);

  const toggleCell = useCallback((row: number, col: number) => {
    setBoardState((prevState) => {
      const newState = prevState.map((r) => [...r]);

      // Verification for the row and col to be inside the valids limits
      if (row >= 0 && row < NUM_ROWS && col >= 0 && col < NUM_COLS) {
        if (selectedPattern) {
          selectedPattern.cells.forEach(([r, c]) => {
            const newRow = (row + r + NUM_ROWS) % NUM_ROWS;
            const newCol = (col + c + NUM_COLS) % NUM_COLS;
            newState[newRow][newCol] = 1;
          });
        } else {
          // Toggle the clicked cell
          newState[row][col] = newState[row][col] === 0 ? 1 : 0;
        }
      } else {
        console.error(`Invalid cell coordinates: row=${row}, col=${col}`);
      }

      return newState;
    });
  }, [selectedPattern]);

  return {
    boardState,
    setBoardState,
    selectedPattern,
    setSelectedPattern,
    resetBoard,
    toggleCell
  };
};