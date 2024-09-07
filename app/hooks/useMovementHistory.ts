import { useState, useCallback } from 'react';
import { Board } from '@/app/types/types';

export const useMovementHistory = () => {
  const [history, setHistory] = useState<Board[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = useCallback((board: Board) => {
  setHistory(prev => {
    const newHistory = [...prev.slice(0, currentIndex + 1), board];
    setCurrentIndex(newHistory.length - 1);
    return newHistory;
  });
}, [currentIndex]);

  const moveToIndex = useCallback((index: number) => {
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index);
      return history[index];
    }
    return null;
  }, [history]);

  const moveBackward = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  const moveForward = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  const resetHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    addToHistory,
    moveBackward,
    moveForward,
    moveToIndex,
    resetHistory,
    canMoveBackward: currentIndex > 0,
    canMoveForward: currentIndex < history.length - 1,
    currentIndex,
    historyLength: history.length,
    history
  };
};
