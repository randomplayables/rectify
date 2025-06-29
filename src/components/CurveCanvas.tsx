import React, { useRef, useEffect, useCallback } from 'react';
import { Curve, Point } from '../types';

interface CurveCanvasProps {
  curve: Curve;
  placedPoints: Point[];
  onPlacePoint: (point: Point) => void;
  width?: number;
  height?: number;
}

const CurveCanvas: React.FC<CurveCanvasProps> = ({ curve, placedPoints, onPlacePoint, width = 800, height = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getCanvasPoint = useCallback((event: React.MouseEvent<HTMLCanvasElement>): Point | undefined => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  const findClosestPointOnCurve = useCallback((clickPoint: Point, scaleFactor: Point, offset: Point): Point => {
      let closestT = curve.t_min;
      let minDistance = Infinity;

      // Search for the closest point on the curve to the click location
      for(let t = curve.t_min; t <= curve.t_max; t += 0.01){
          const p = curve.func(t);
          const canvasP = { x: p.x * scaleFactor.x + offset.x, y: -p.y * scaleFactor.y + offset.y };
          const d = Math.sqrt(Math.pow(canvasP.x - clickPoint.x, 2) + Math.pow(canvasP.y - clickPoint.y, 2));

          if(d < minDistance){
              minDistance = d;
              closestT = t;
          }
      }
      return curve.func(closestT);
  }, [curve]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Determine bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const curvePoints: Point[] = [];
    for (let t = curve.t_min; t <= curve.t_max; t += (curve.t_max - curve.t_min) / 1000) {
      const p = curve.func(t);
      curvePoints.push(p);
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    const margin = 50;
    const scaleX = (width - 2 * margin) / (maxX - minX);
    const scaleY = (height - 2 * margin) / (maxY - minY);
    const scaleFactor = {x: Math.min(scaleX, scaleY), y: Math.min(scaleX, scaleY)};
    
    const offsetX = (width - (maxX - minX) * scaleFactor.x) / 2 - minX * scaleFactor.x;
    const offsetY = (height + (maxY - minY) * scaleFactor.y) / 2 + minY * scaleFactor.y;
    const offset = {x: offsetX, y: offsetY};


    // Draw Curve
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    const firstPoint = curvePoints[0];
    ctx.moveTo(firstPoint.x * scaleFactor.x + offset.x, -firstPoint.y * scaleFactor.y + offset.y);
    for (const p of curvePoints) {
      ctx.lineTo(p.x * scaleFactor.x + offset.x, -p.y * scaleFactor.y + offset.y);
    }
    ctx.stroke();

    const allPoints = [
        curve.func(curve.t_min),
        ...placedPoints,
        curve.func(curve.t_max)
    ];


    // Draw lines
    ctx.beginPath();
    ctx.strokeStyle = '#10B981'; // Green for the path lines
    ctx.lineWidth = 3;
    const firstSegPoint = allPoints[0];
    ctx.moveTo(firstSegPoint.x * scaleFactor.x + offset.x, -firstSegPoint.y * scaleFactor.y + offset.y);
    for(const p of allPoints) {
         ctx.lineTo(p.x * scaleFactor.x + offset.x, -p.y * scaleFactor.y + offset.y);
    }
    ctx.stroke();

    // Draw points
    // REVISED: Removed the unused 'index' parameter to fix the VS Code problem.
    allPoints.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x * scaleFactor.x + offset.x, -p.y * scaleFactor.y + offset.y, 6, 0, 2 * Math.PI);
        // User-placed points are green, start/end points are red
        const isUserPlaced = placedPoints.some(pp => pp.x === p.x && pp.y === p.y);
        ctx.fillStyle = isUserPlaced ? '#059669' : '#ef4444'; // Green for user points, Red for endpoints
        ctx.fill();
    });

  }, [curve, placedPoints, width, height]);

  useEffect(() => {
    draw();
  }, [draw]);
  
  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
      const clickPoint = getCanvasPoint(event);
      if(!clickPoint || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      if(!ctx) return;
      
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let t = curve.t_min; t <= curve.t_max; t += 0.01) {
          const p = curve.func(t);
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
      }
      
      const margin = 50;
      const scaleX = (width - 2 * margin) / (maxX - minX);
      const scaleY = (height - 2 * margin) / (maxY - minY);
      const scaleFactor = {x: Math.min(scaleX, scaleY), y: Math.min(scaleX, scaleY)};
      
      const offsetX = (width - (maxX - minX) * scaleFactor.x) / 2 - minX * scaleFactor.x;
      const offsetY = (height + (maxY - minY) * scaleFactor.y) / 2 + minY * scaleFactor.y;
      const offset = {x: offsetX, y: offsetY};
      
      const curvePoint = findClosestPointOnCurve(clickPoint, scaleFactor, offset);
      onPlacePoint(curvePoint);
  }

  return <canvas ref={canvasRef} width={width} height={height} onClick={handleClick} className="bg-gray-900 border border-gray-700 rounded-lg cursor-crosshair" />;
};

export default CurveCanvas;