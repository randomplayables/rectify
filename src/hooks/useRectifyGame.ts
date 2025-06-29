import { useState, useEffect, useCallback } from 'react';
import { Curve, Point, RoundData } from '../types';
import { PRESET_CURVES } from '../utils/curves';
import { calculateArcLength, calculatePathLength } from '../utils/math';
import { initGameSession, saveGameData } from '../services/apiService';

const TOTAL_ROUNDS = 10;

export const useRectifyGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [selectedCurve, setSelectedCurve] = useState<Curve | null>(null);
  const [placedPoints, setPlacedPoints] = useState<Point[]>([]);
  const [actualLength, setActualLength] = useState(0);
  const [approximatedLength, setApproximatedLength] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameSession, setGameSession] = useState<any>(null);

  useEffect(() => {
    const initSession = async () => {
        const session = await initGameSession('rectify');
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

  const placePoint = (point: Point) => {
    if (isRoundFinished) return;

    setPlacedPoints(prevPoints => {
      const newPoints = [...prevPoints, point].sort((a, b) => a.x - b.x);
      
      if (selectedCurve) {
          const endPoints = [selectedCurve.func(selectedCurve.t_min), selectedCurve.func(selectedCurve.t_max)].sort((a,b) => a.x - b.x);
          const fullPath = [endPoints[0], ...newPoints, endPoints[1]];
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
    
    // Save data for the completed round
    const roundData: RoundData = {
        roundNumber: round,
        curve: selectedCurve.name,
        placedPoints,
        approximatedLength,
        actualLength,
        score: approximatedLength - actualLength
    };
    
    if (gameSession) {
        await saveGameData(round, roundData);
    }

    setTotalScore(prev => prev + (approximatedLength - actualLength));

    if (round < TOTAL_ROUNDS) {
      setRound(prev => prev + 1);
      resetRound(selectedCurve);
    } else {
      setIsGameOver(true);
      if (gameSession){
          await saveGameData(TOTAL_ROUNDS + 1, { finalScore: totalScore + (approximatedLength - actualLength) });
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