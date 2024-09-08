import React, { useEffect, useState } from "react";
import { Pattern, Board } from "@/app/types/types";
import HistorySlider from "./HistorySlider";


// The interface for the Controls component
interface ControlsProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  resetBoard: () => void;
  resetAll: () => void; 
  nextGeneration: () => void;
  setSelectedPattern: (pattern: Pattern | null) => void;
  selectedPattern: Pattern | null;
  boardState: Board;
  applyPattern: (pattern: Pattern) => void;
  moveBackward: () => void;
  moveForward: () => void;
  canMoveBackward: boolean;
  canMoveForward: boolean;
  currentIndex: number;
  historyLength: number;
  onMoveToIndex: (index: number) => void;
  moveToIndex: (index: number) => void;
  hasLiveCells: boolean;
}

// Below the props are passed to the component
const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  setIsPlaying,
  resetBoard,
  resetAll,
  nextGeneration,
  setSelectedPattern,
  selectedPattern,
  boardState,
  applyPattern,
  moveBackward,
  moveForward,
  canMoveBackward,
  canMoveForward,
  currentIndex,
  historyLength,
  onMoveToIndex,
  hasLiveCells,
  moveToIndex,
  nextGeneration: nextGen,
}) => {

  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [playEnabled, setPlayEnabled] = useState(false);
  // fetch patterns from the server
  useEffect(() => {
    fetch('/api/patterns')
      .then(response => response.json())
      .then(data => setPatterns(data))
      .catch(error => console.error('Error fetching patterns:', error));
  }, []);

  useEffect(() => {
    const liveCells = boardState.flat().filter(cell => 
      Array.isArray(cell) ? cell[0] === 1 : cell === 1
    ).length;
    setPlayEnabled(liveCells > 0);
  }, [boardState]);

  // Apply the pattern to the board
  const handlePatternSelect = (pattern: Pattern) => {
    setSelectedPattern(pattern);
    if (typeof applyPattern === 'function') {
      applyPattern(pattern);
    } 
  };

  const handleClearPattern = () => {
    setSelectedPattern(null);
  };

  return (
    <div className="controls bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-white font-bold mb-2">Controls</h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button 
          onClick={resetBoard}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset Board
        </button>
        <button 
          onClick={resetAll}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset All
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          disabled={!playEnabled}
          className={`${isPlaying ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-500 hover:bg-purple-600'} text-white font-bold py-2 px-4 rounded ${!playEnabled && 'opacity-50 cursor-not-allowed'}`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-white font-bold mb-2">History</h3>
        <HistorySlider
          currentIndex={currentIndex}
          historyLength={historyLength}
          onMoveToIndex={onMoveToIndex}
          onNextGeneration={nextGeneration}
          canMoveBackward={canMoveBackward}
          canMoveForward={canMoveForward}
        />
      </div>
      <div>
        <h3 className="text-white font-bold mb-2">Patterns</h3>
        <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
          
          {/* Just in case the use case is needed */}
          {/* <button
            onClick={handleClearPattern}
            className={`pattern-button text-sm py-1 px-2 rounded bg-red-500 hover:bg-red-600 text-white hover:bg-gray-400`}
          >
            Clear Pattern
          </button> */}
          {patterns.map((pattern) => (
            <button
              key={pattern.name}
              onClick={() => handlePatternSelect(pattern)}
              className={`pattern-button text-sm py-1 px-2 rounded ${
                selectedPattern?.name === pattern.name 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
            >
              {pattern.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default React.memo(Controls);