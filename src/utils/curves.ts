import { Curve } from '../types';

export const PRESET_CURVES: Curve[] = [
  {
    name: "Sine Wave",
    func: (t) => ({ x: t, y: Math.sin(t) }),
    t_min: 0,
    t_max: 2 * Math.PI,
    description: "A smooth, periodic wave: y = sin(x)"
  },
  {
    name: "Parabola",
    func: (t) => ({ x: t, y: t * t }),
    t_min: -2,
    t_max: 2,
    description: "A standard U-shaped curve: y = x^2"
  },
  {
    name: "Circle",
    func: (t) => ({ x: Math.cos(t), y: Math.sin(t) }),
    t_min: 0,
    t_max: 2 * Math.PI,
    description: "A perfect circle with radius 1."
  },
  {
    name: "Spiral of Archimedes",
    func: (t) => ({ x: t * Math.cos(t), y: t * Math.sin(t) }),
    t_min: 0,
    t_max: 4 * Math.PI,
    description: "A spiral that moves away from the center at a constant speed."
  },
  {
      name: "Lissajous Curve",
      func: (t) => ({ x: Math.sin(3 * t), y: Math.sin(4 * t) }),
      t_min: 0,
      t_max: 2 * Math.PI,
      description: "A complex, looping curve created from harmonic motion."
  }
];