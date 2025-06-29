import React from 'react';
import { useRectifyGame } from '../hooks/useRectifyGame';
import CurveCanvas from './CurveCanvas';
import ScoreDisplay from './ScoreDisplay';

const GameUI: React.FC = () => {
  const {
    gameStarted,
    round,
    TOTAL_ROUNDS,
    selectedCurve,
    placedPoints,
    actualLength,
    approximatedLength,
    totalScore,
    isRoundFinished,
    isGameOver,
    startGame,
    placePoint,
    nextRound,
    restartGame,
    presetCurves,
  } = useRectifyGame();

  if (isGameOver) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl text-white">
        <h2 className="text-4xl font-bold text-yellow-400 mb-4">Game Over!</h2>
        <p className="text-xl mb-6">Your final score across {TOTAL_ROUNDS} rounds is:</p>
        <div className="text-5xl font-mono font-bold text-emerald-400 mb-8">
            {totalScore.toFixed(4)}
        </div>
        <button
          onClick={restartGame}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform transform hover:scale-105"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (!gameStarted || !selectedCurve) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Rectify</h1>
        <p className="text-lg text-gray-400 mb-8">Place points on a curve to make the longest possible path.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presetCurves.map((curve) => (
            <button
              key={curve.name}
              onClick={() => startGame(curve)}
              className="bg-gray-800 hover:bg-emerald-700 border border-gray-700 text-white font-bold py-4 px-6 rounded-lg transition"
            >
              <h3 className="text-xl">{curve.name}</h3>
              <p className="text-sm font-normal text-gray-400 mt-1">{curve.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-grow">
        <CurveCanvas
          curve={selectedCurve}
          placedPoints={placedPoints}
          onPlacePoint={placePoint}
        />
      </div>
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-gray-800 p-4 rounded-lg text-white shadow-lg space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{selectedCurve.name}</h2>
            <p className="text-lg">Round {round} / {TOTAL_ROUNDS}</p>
          </div>
          <p className="text-sm text-gray-400">
            Place {round - placedPoints.length} more point{round - placedPoints.length !== 1 ? 's' : ''} on the curve.
          </p>
          <ScoreDisplay actualLength={actualLength} approximatedLength={approximatedLength} />
          {isRoundFinished && (
            <button
              onClick={nextRound}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              {round === TOTAL_ROUNDS ? 'Finish Game' : 'Next Round'}
            </button>
          )}
           <div className="text-center pt-4">
              <p className="text-gray-400">Total Score: <span className="font-mono">{totalScore.toFixed(4)}</span></p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GameUI;