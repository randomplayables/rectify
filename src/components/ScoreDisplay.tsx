import React from 'react';

interface ScoreDisplayProps {
  actualLength: number;
  approximatedLength: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ actualLength, approximatedLength }) => {
  // REVISED: Score is now the difference, aiming for a smaller number.
  const score = actualLength - approximatedLength;

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white shadow-lg space-y-3">
      <div className="flex justify-between items-baseline">
        <span className="text-gray-400">Actual Curve Length (S):</span>
        <span className="font-mono text-lg">{actualLength.toFixed(4)}</span>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-gray-400">Your Path Length (ΣL):</span>
        <span className="font-mono text-lg text-emerald-400">{approximatedLength.toFixed(4)}</span>
      </div>
      <div className="flex justify-between items-baseline pt-3 border-t border-gray-700">
        {/* REVISED: Updated label to reflect new scoring */}
        <span className="font-bold text-xl">Round Score (S - ΣL):</span>
        <span className="font-mono text-xl font-bold text-yellow-400">{score.toFixed(4)}</span>
      </div>
    </div>
  );
};

export default ScoreDisplay;