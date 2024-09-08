import React, { useEffect, useCallback } from 'react';

interface HistorySliderProps {
  currentIndex: number;
  historyLength: number;
  onMoveToIndex: (index: number) => void;
  onNextGeneration: () => void;
  canMoveBackward: boolean;
  canMoveForward: boolean;
}

const HistorySlider: React.FC<HistorySliderProps> = ({
  currentIndex,
  historyLength,
  onMoveToIndex,
  onNextGeneration,
  canMoveBackward,
  canMoveForward
}) => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onMoveToIndex(Number(event.target.value));
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' && canMoveBackward) {
      onMoveToIndex(currentIndex - 1);
    } else if (event.key === 'ArrowRight' && canMoveForward) {
      onMoveToIndex(currentIndex + 1);
    }
  }, [currentIndex, canMoveBackward, canMoveForward, onMoveToIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const sliderValue = historyLength > 0 ? currentIndex : 0;
  const sliderMax = Math.max(0, historyLength - 1);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-2 w-full">
        <button 
          onClick={() => onMoveToIndex(currentIndex - 1)}
          disabled={!canMoveBackward}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${!canMoveBackward && 'opacity-50 cursor-not-allowed'}`}
        >
          Previous
        </button>
        <input
          type="range"
          min="0"
          max={sliderMax}
          value={sliderValue}
          onChange={handleSliderChange}
          disabled={historyLength <= 1}
          className="w-full"
        />
        <button 
          onClick={() => canMoveForward ? onMoveToIndex(currentIndex + 1) : onNextGeneration()}
          disabled={false}  // Never disable this button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HistorySlider;