import { useState, useCallback, useEffect } from "react"
import {
	Board,
	Pattern,
	CellWithShadow,
	CellState,
	CELL_STATE_DEAD,
	CELL_STATE_ALIVE,
} from "@/app/types/types"
import { config } from "@/app/config/config"
import { createBoard, computeNextBoard } from "@/app/utils/boardUtils"
import { useMovementHistory } from "./useMovementHistory"
import { isGameOver, isInfiniteLoop } from "@/app/utils/boardUtils"
import { hasCells } from '@/app/utils/boardUtils';

const { GAME_SPEED, NUM_ROWS, NUM_COLS } = config

export const useGameLogic = () => {
	const [boardState, setBoardState] = useState<Board>(() => createBoard())
	const [isPlaying, setIsPlaying] = useState(false)
	const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null)
	const {
		history,
		addToHistory,
		moveBackward,
		moveForward,
		moveToIndex,
		resetHistory,
		canMoveBackward,
		canMoveForward,
		currentIndex,
		historyLength,
	} = useMovementHistory()

	// The resetBoard function is used to reset the board to its initial state
	const resetBoard = useCallback(() => {
		const newBoard = createBoard()
		setBoardState(newBoard)
		resetHistory()
		addToHistory(newBoard)
	}, [resetHistory, addToHistory])

	// The toggleCell function is used to toggle the state of a cell in the board
	const toggleCell = useCallback(
		(row: number, col: number) => {
			setBoardState((prevState: Board) => {
				const newState = prevState.map((r) => [...r])
				const cell = newState[row][col]
				if (Array.isArray(cell)) {
					newState[row][col] = [
						cell[0] === CELL_STATE_DEAD
							? CELL_STATE_ALIVE
							: CELL_STATE_DEAD,
						cell[1],
					] as CellWithShadow
				} else {
					newState[row][col] =
						cell === CELL_STATE_DEAD
							? CELL_STATE_ALIVE
							: CELL_STATE_DEAD
				}
				addToHistory(newState)
				return newState
			})
		},
		[addToHistory]
	)

	// The applyPattern function is used to apply a pattern to the board, this pattern comes from the api
	const applyPattern = useCallback(
		(pattern: Pattern) => {
			setBoardState((prevState: Board) => {
				const newState = prevState.map((row) => [...row])

				// Calculate the dimentions of the pattenr
				const patternWidth =
					Math.max(...pattern.cells.map(([_, col]) => col)) + 1
				const patternHeight =
					Math.max(...pattern.cells.map(([row, _]) => row)) + 1

				// Calculate the movement to center the pattern
				const offsetX = Math.floor((NUM_COLS - patternWidth) / 2)
				const offsetY = Math.floor((NUM_ROWS - patternHeight) / 2)

				// Apply the pattern to the board
				pattern.cells.forEach(([row, col]) => {
					const newRow = row + offsetY
					const newCol = col + offsetX
					// Validate the coordinates
					if (
						newRow >= 0 &&
						newRow < NUM_ROWS &&
						newCol >= 0 &&
						newCol < NUM_COLS
					) {
						const cell = newState[newRow][newCol]
						// Here we check if the cell is alive or dead
						if (Array.isArray(cell)) {
							newState[newRow][newCol] = [
								CELL_STATE_ALIVE,
								cell[1],
							] as CellWithShadow
						} else {
							newState[newRow][newCol] =
								CELL_STATE_ALIVE as CellState
						}
					}
				})
				// Adding the new state to the movement history	
				addToHistory(newState)
				return newState
			})
		},
		[addToHistory]
	)
	// The nextGeneration function is used to generate the next generation of the board
	const nextGeneration = useCallback(() => {
		setBoardState((prevBoard) => {
			const newBoard = computeNextBoard(prevBoard ?? createBoard())
			if (isGameOver(newBoard)) {
				setIsPlaying(false)
				alert("The game has ended. All cells have died.")
				resetHistory()
				return newBoard
			}

			if (isInfiniteLoop(history, newBoard)) {
				setIsPlaying(false)
				alert("The game has stopped due to an infinite loop.")
				return prevBoard
			}

			addToHistory(newBoard)
			return newBoard
		})
	}, [addToHistory, resetHistory, history])
	// The handleMoveBackward function is used to move backward in the movement history
	const handleMoveBackward = useCallback(() => {
		const previousBoard = moveBackward()
		if (previousBoard) {
			setBoardState(previousBoard)
		}
	}, [moveBackward, setBoardState])

	// The handleMoveForward function is used to move forward in the movement history
	const handleMoveForward = useCallback(() => {
		const nextBoard = moveForward()
		if (nextBoard) {
			setBoardState(nextBoard)
		}
	}, [moveForward, setBoardState])
	// The resetAll function is used to reset the board to its initial state
	const resetAll = useCallback(() => {
		resetBoard()
		setIsPlaying(false)
		setSelectedPattern(null)
	}, [resetBoard])

	// The hasLiveCells function is used to check if there are any live cells in the board
	const hasLiveCells = useCallback(() => hasCells(boardState), [boardState])
	// The useEffect hook is used to start the game loop
	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null
		//	If the game is playing, start the game loop
		if (isPlaying) {
			intervalId = setInterval(nextGeneration, GAME_SPEED)
		}
		// Clean up the interval when the component unmounts
		return () => {
			if (intervalId) clearInterval(intervalId)
		}
	}, [isPlaying, nextGeneration])

	// Move to the next generation
	const handleMoveToIndex = useCallback(
		(index: number) => {
			const board = moveToIndex(index)
			if (board) {
				setBoardState(board)
			}
		},
		[moveToIndex, setBoardState]
	)

	// Move to the next generation
	const handleNextGeneration = useCallback(() => {
		const newBoard = computeNextBoard(boardState)
		setBoardState(newBoard)
		addToHistory(newBoard)
	}, [boardState, addToHistory, setBoardState])
	
	return {
		boardState,
		setBoardState,
		isPlaying,
		setIsPlaying,
		selectedPattern,
		setSelectedPattern,
		resetAll,
		resetBoard,
		toggleCell,
		applyPattern,
		moveBackward: handleMoveBackward,
		moveForward: handleMoveForward,
		canMoveBackward,
		canMoveForward,
		currentIndex,
		historyLength,
		moveToIndex: handleMoveToIndex,
		hasLiveCells,
		nextGeneration: handleNextGeneration,
	}
}
