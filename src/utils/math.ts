import { Point } from '../types';

/**
 * Numerically differentiates a parametric function at a given point t.
 * Uses the central difference method for higher accuracy.
 * @param func The parametric function t => {x, y}.
 * @param t The point at which to find the derivative.
 * @param h A small step size.
 * @returns The derivative {dx/dt, dy/dt} as a Point.
 */
export function derivative(func: (t: number) => Point, t: number, h = 1e-5): Point {
  const p1 = func(t - h);
  const p2 = func(t + h);
  return {
    x: (p2.x - p1.x) / (2 * h),
    y: (p2.y - p1.y) / (2 * h),
  };
}

/**
 * Calculates the arc length of a parametric curve using numerical integration.
 * It uses the Trapezoidal Rule.
 * @param func The parametric function t => {x, y}.
 * @param t_min The start of the interval.
 * @param t_max The end of the interval.
 * @param segments The number of segments to use for integration.
 * @returns The calculated arc length of the curve.
 */
export function calculateArcLength(
  func: (t: number) => Point,
  t_min: number,
  t_max: number,
  segments = 1000
): number {
  let length = 0;
  const dt = (t_max - t_min) / segments;

  const integrand = (t: number): number => {
    const { x: dx, y: dy } = derivative(func, t);
    return Math.sqrt(dx * dx + dy * dy);
  };

  for (let i = 0; i < segments; i++) {
    const t1 = t_min + i * dt;
    const t2 = t_min + (i + 1) * dt;
    length += ((integrand(t1) + integrand(t2)) / 2) * dt;
  }

  return length;
}

/**
 * Calculates the Euclidean distance between two points.
 * @param p1 The first point.
 * @param p2 The second point.
 * @returns The distance between the two points.
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Calculates the total length of a path made of line segments connecting a series of points.
 * @param points An array of points in order.
 * @returns The total length of the path.
 */
export function calculatePathLength(points: Point[]): number {
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalLength += distance(points[i], points[i + 1]);
  }
  return totalLength;
}