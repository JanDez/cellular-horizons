"use client";

import React from 'react';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import { useGameLogic } from './hooks/index';

const Home: React.FC = () => {
  const {
    boardState,
    isPlaying,
    setIsPlaying,
    selectedPattern,
    setSelectedPattern,
    resetAll,
    resetBoard,
    toggleCell,
    nextGeneration,
    applyPattern,
    moveBackward,
    moveForward,
    canMoveBackward,
    canMoveForward,
    currentIndex,
    historyLength,
    moveToIndex,
    hasLiveCells,
  } = useGameLogic();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Cellular Horizons</h1>
      <div className="flex flex-col md:flex-row justify-center items-start w-full max-w-6xl gap-8">
        <div className="w-full md:w-1/3">
          <Controls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            resetAll={resetAll}
            resetBoard={resetBoard}
            nextGeneration={nextGeneration}
            setSelectedPattern={setSelectedPattern}
            selectedPattern={selectedPattern}
            boardState={boardState}
            applyPattern={applyPattern}
            moveBackward={moveBackward}
            moveForward={moveForward}
            canMoveBackward={canMoveBackward}
            canMoveForward={canMoveForward}
            currentIndex={currentIndex}
            historyLength={historyLength}
            onMoveToIndex={moveToIndex}  
            hasLiveCells={hasLiveCells()}
          />
        </div>
        <div className="w-full md:w-2/3">
          <GameBoard
            boardState={boardState}
            toggleCell={toggleCell}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

