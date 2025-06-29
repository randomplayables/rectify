import { useState, useEffect, useCallback } from 'react';
import { Curve, PlacedPoint, RoundData } from '../types';
import { PRESET_CURVES } from '../utils/curves';
import { calculateArcLength, calculatePathLength } from '../utils/math';
import { initGameSession, saveGameData } from '../services/apiService';

const TOTAL_ROUNDS = 10;

export const useRectifyGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [selectedCurve, setSelectedCurve] = useState<Curve | null>(null);
  const [placedPoints, setPlacedPoints] = useState<PlacedPoint[]>([]);
  const [actualLength, setActualLength] = useState(0);
  const [approximatedLength, setApproximatedLength] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [gameSession, setGameSession] = useState<any>(null);

  useEffect(() => {
    const initSession = async () => {
        const session = await initGameSession();
        setGameSession(session);
    };
    initSession();
  }, []);

  const startGame = useCallback((curve: Curve) => {
    setSelectedCurve(curve);
    const curveLength = calculateArcLength(curve.func, curve.t_min, curve.t_max);
    setActualLength(curveLength);
    setGameStarted(true);
    resetRound(curve);
  }, []);

  const placePoint = (point: PlacedPoint) => {
    if (isRoundFinished) return;

    setPlacedPoints(prevPoints => {
      const newPoints = [...prevPoints, point].sort((a, b) => a.t - b.t);
      
      if (selectedCurve) {
          const startPoint = selectedCurve.func(selectedCurve.t_min);
          const endPoint = selectedCurve.func(selectedCurve.t_max);

          // Check if the curve is closed by comparing start and end points
          const isClosed = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y) < 1e-9;
          
          const fullPath = isClosed
            ? [startPoint, ...newPoints, startPoint] // For closed: start -> p1...pn -> start
            : [startPoint, ...newPoints, endPoint];  // For open:   start -> p1...pn -> end

          const pathLength = calculatePathLength(fullPath);
          setApproximatedLength(pathLength);
      }
      
      if(newPoints.length === round){
          setIsRoundFinished(true);
      }
      return newPoints;
    });
  };

  const nextRound = async () => {
    if (!selectedCurve) return;
    
    // REVISED: The round score is now S - ΣL
    const roundScore = actualLength - approximatedLength;

    // Save data for the completed round
    const roundData: RoundData = {
        roundNumber: round,
        curve: selectedCurve.name,
        placedPoints,
        approximatedLength,
        actualLength,
        // REVISED: Store the new score
        score: roundScore
    };
    
    if (gameSession) {
        await saveGameData(round, roundData);
    }

    // REVISED: Update total score with the new scoring logic
    setTotalScore(prev => prev + roundScore);

    if (round < TOTAL_ROUNDS) {
      setRound(prev => prev + 1);
      resetRound(selectedCurve);
    } else {
      setIsGameOver(true);
      if (gameSession){
          // REVISED: Calculate final score correctly
          await saveGameData(TOTAL_ROUNDS + 1, { finalScore: totalScore + roundScore });
      }
    }
  };
  
  const resetRound = (curve: Curve) => {
      setPlacedPoints([]);
      const endPoints = [curve.func(curve.t_min), curve.func(curve.t_max)];
      const initialLength = calculatePathLength(endPoints);
      setApproximatedLength(initialLength);
      setIsRoundFinished(false);
  };

  const restartGame = () => {
      setGameStarted(false);
      setRound(1);
      setSelectedCurve(null);
      setPlacedPoints([]);
      setActualLength(0);
      setApproximatedLength(0);
      setTotalScore(0);
      setIsRoundFinished(false);
      setIsGameOver(false);
      // Re-initialize the session for the new game
      initGameSession().then(session => setGameSession(session));
  };

  return {
    // State
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
    
    // Actions
    startGame,
    placePoint,
    nextRound,
    restartGame,
    
    // Data
    presetCurves: PRESET_CURVES
  };
};