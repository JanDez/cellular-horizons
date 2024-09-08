import { useState, useCallback, useRef, useEffect } from "react"
import { Board } from "@/app/types/types"
import { config } from "@/app/config/config"

const { GAME_SPEED, MAX_HISTORY } = config
import {
	computeNextBoard,
	isInfiniteLoop,
	isGameOver,
} from "@/app/utils/boardUtils"

export const useGameState = (
	boardState: Board,
	setBoardState: (board: Board | ((prevBoard: Board) => Board)) => void
) => {
	const [isPlaying, setIsPlaying] = useState(false)
	const boardHistoryRef = useRef<string[]>([])
	const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

	// The resetGame function is used to reset the board to its initial state
	const resetGame = useCallback(() => {
		boardHistoryRef.current = []
		if (gameLoopRef.current) {
			clearInterval(gameLoopRef.current)
			gameLoopRef.current = null
		}
		setIsPlaying(false)
	}, [])

	// The nextGeneration function is used to generate the next generation of the board
	const nextGeneration = useCallback(() => {
		setBoardState((prevBoard: Board) => {
			const newBoard = computeNextBoard(prevBoard)

			if (isInfiniteLoop(boardHistoryRef.current, newBoard)) {
				setIsPlaying(false)
				alert("The game has stopped due to an infinite loop.")
				return prevBoard
			}

			boardHistoryRef.current.push(JSON.stringify(newBoard))
			if (boardHistoryRef.current.length > MAX_HISTORY) {
				boardHistoryRef.current.shift()
			}

			if (isGameOver(newBoard)) {
				setIsPlaying(false)
				alert("The game has ended. All cells have died.")
				return newBoard
			}

			return newBoard
		})
	}, [setBoardState])

	// The useEffect hook is used to start the game loop
	useEffect(() => {
		if (isPlaying) {
			gameLoopRef.current = setInterval(() => {
				nextGeneration()
			}, GAME_SPEED)
			return () => clearInterval(gameLoopRef.current!)
		}
	}, [isPlaying, nextGeneration])
	return {
		isPlaying,
		setIsPlaying,
		resetGame,
		nextGeneration,
	}
}
