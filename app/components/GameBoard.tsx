import React, { useEffect, useRef, useCallback } from "react";
import { config } from "@/app/config/config";
import { Board, CellState, ShadowState, CellWithShadow, types } from "@/app/types/types";

const { CELL_SIZE, HEIGHT, NUM_COLS, NUM_ROWS, WIDTH, COLORS } = config;
const { CELL_STATE_DEAD, CELL_STATE_ALIVE } = types;

interface GameBoardProps {
  boardState: Board;
  toggleCell: (row: number, col: number) => void;
}

// Using memo to prevent unnecessary re-renders here
const GameBoard: React.FC<GameBoardProps> = React.memo(({ boardState, toggleCell }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawBoard = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    boardState.forEach((row, r) => {
      row.forEach((cell, c) => {
        const [cellState, shadowState] = Array.isArray(cell) ? cell : [cell, 0];

        // Draw shadow
        ctx.fillStyle = `rgba(100, 100, 100, ${shadowState})`;
        ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        // Paint live cell
        if (cellState === CELL_STATE_ALIVE) {
          ctx.fillStyle = COLORS[1];
          ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      });
    });

    // Grid lines
    const drawGrid = (interval: number, style: string, width: number, dash: number[]) => {
      ctx.strokeStyle = style;
      ctx.lineWidth = width;
      ctx.setLineDash(dash);

      for (let i = 0; i <= Math.max(NUM_ROWS, NUM_COLS); i += interval) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(WIDTH, i * CELL_SIZE);
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, HEIGHT);
        ctx.stroke();
      }
    };

    drawGrid(1, "white", 0.05, [2, 2]);  // Small grid
    drawGrid(10, "yellow", 0.1, []);     // LArge grid
  }, [boardState]);

  useEffect(() => {
    drawBoard();
  }, [drawBoard]);

  // Canva click handler
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) * scaleY / CELL_SIZE);

    // Check if click is inside the board
    if (x >= 0 && x < NUM_COLS && y >= 0 && y < NUM_ROWS) {
      toggleCell(y, x);
    }
  }, [toggleCell]);

  return (
    <canvas
      onClick={handleClick}
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      style={{ width: '100%', height: 'auto' }}
      className="bg-grey"
    />
  );
});

GameBoard.displayName = 'GameBoard';

export default GameBoard;