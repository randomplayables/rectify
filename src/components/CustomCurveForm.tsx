import React, { useState } from 'react';
import * as math from 'mathjs';
import { Curve } from '../types';

interface CustomCurveFormProps {
  onStartGame: (curve: Curve) => void;
  onCancel: () => void;
}

const CustomCurveForm: React.FC<CustomCurveFormProps> = ({ onStartGame, onCancel }) => {
  const [formula, setFormula] = useState('x^2');
  const [xMin, setXMin] = useState('-2');
  const [xMax, setXMax] = useState('2');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const parsedXMin = parseFloat(xMin);
    const parsedXMax = parseFloat(xMax);

    if (isNaN(parsedXMin) || isNaN(parsedXMax) || parsedXMin >= parsedXMax) {
      setError('Please enter a valid domain (x_min < x_max).');
      return;
    }

    try {
      const compiledFormula = math.compile(formula);
      
      // Test the compiled function to ensure it's valid
      compiledFormula.evaluate({ x: parsedXMin });

      const customCurve: Curve = {
        name: `Custom: y = ${formula}`,
        description: `A user-defined curve from ${parsedXMin} to ${parsedXMax}.`,
        func: t => ({ x: t, y: compiledFormula.evaluate({ x: t }) }),
        t_min: parsedXMin,
        t_max: parsedXMax,
      };

      onStartGame(customCurve);

    } catch (e) {
      console.error("Formula compilation failed:", e);
      setError('Invalid formula. Please enter a valid expression of x.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create a Custom Curve</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="formula" className="block text-sm font-medium text-gray-300 mb-2">
              Formula (e.g., x^3 - 2*x)
            </label>
            <div className="flex items-center">
                <span className="bg-gray-700 p-3 rounded-l-md border border-r-0 border-gray-600">y =</span>
                <input
                    type="text"
                    id="formula"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    className="bg-gray-900 border border-gray-600 text-white p-3 rounded-r-md w-full font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="x_min" className="block text-sm font-medium text-gray-300 mb-2">
                Domain: x_min
              </label>
              <input
                type="number"
                id="x_min"
                step="any"
                value={xMin}
                onChange={(e) => setXMin(e.target.value)}
                className="bg-gray-900 border border-gray-600 text-white p-3 rounded-md w-full font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="x_max" className="block text-sm font-medium text-gray-300 mb-2">
                Domain: x_max
              </label>
              <input
                type="number"
                id="x_max"
                step="any"
                value={xMax}
                onChange={(e) => setXMax(e.target.value)}
                className="bg-gray-900 border border-gray-600 text-white p-3 rounded-md w-full font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 p-3 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Start Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomCurveForm;