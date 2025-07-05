'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Player = 'X' | 'O' | null;

interface GameState {
  board: Player[];
  currentPlayer: 'X' | 'O';
  winner: Player;
  isDraw: boolean;
  gameOver: boolean;
}

interface Scoreboard {
  X: number;
  O: number;
  draws: number;
}

const TicTacToe = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
    gameOver: false,
  });

  const [scoreboard, setScoreboard] = useState<Scoreboard>({
    X: 0,
    O: 0,
    draws: 0,
  });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];

  const checkWinner = (board: Player[]): Player => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const checkDraw = (board: Player[]): boolean => {
    return board.every(cell => cell !== null);
  };

  const handleCellClick = (index: number) => {
    if (gameState.board[index] || gameState.gameOver) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const winner = checkWinner(newBoard);
    const isDraw = checkDraw(newBoard);
    const gameOver = winner !== null || isDraw;

    // Update scoreboard if game is over
    if (gameOver && !gameState.gameOver) {
      setScoreboard(prev => {
        if (winner) {
          return {
            ...prev,
            [winner]: prev[winner] + 1,
          };
        } else if (isDraw) {
          return {
            ...prev,
            draws: prev.draws + 1,
          };
        }
        return prev;
      });
    }

    setGameState({
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      isDraw,
      gameOver,
    });
  };

  const resetGame = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isDraw: false,
      gameOver: false,
    });
  };

  const resetScoreboard = () => {
    setScoreboard({
      X: 0,
      O: 0,
      draws: 0,
    });
    resetGame();
  };

  const getStatusMessage = () => {
    if (gameState.winner) {
      return `Player ${gameState.winner} wins!`;
    }
    if (gameState.isDraw) {
      return "It's a draw!";
    }
    return `Player ${gameState.currentPlayer}'s turn`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Scoreboard */}
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Scoreboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">Player X</div>
                <div className="text-3xl font-bold text-blue-800">{scoreboard.X}</div>
                <div className="text-sm text-blue-600">Wins</div>
              </div>
              <div className="bg-green-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">Player O</div>
                <div className="text-3xl font-bold text-green-800">{scoreboard.O}</div>
                <div className="text-sm text-green-600">Wins</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-600">Draws</div>
                <div className="text-3xl font-bold text-gray-800">{scoreboard.draws}</div>
                <div className="text-sm text-gray-600">Ties</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Board */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">
              Tic Tac Toe
            </CardTitle>
            <p className="text-lg text-gray-600 mt-2">
              {getStatusMessage()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Game Board */}
            <div className="grid grid-cols-3 gap-2">
              {gameState.board.map((cell, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="lg"
                  className="h-20 text-2xl font-bold bg-white hover:bg-gray-50 border-2 border-gray-300"
                  onClick={() => handleCellClick(index)}
                  disabled={cell !== null || gameState.gameOver}
                >
                  {cell}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetGame}
                className="px-6 py-2 text-lg font-semibold"
                variant="default"
              >
                New Game
              </Button>
              <Button
                onClick={resetScoreboard}
                className="px-6 py-2 text-lg font-semibold"
                variant="outline"
              >
                Reset Scoreboard
              </Button>
            </div>

            {/* Game Info */}
            <div className="text-center text-sm text-gray-500">
              <p>Click on any empty cell to make your move</p>
              <p className="mt-1">Get three in a row to win!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicTacToe; 