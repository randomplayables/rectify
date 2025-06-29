# Playing Rectify In Real Life

## Overview
Rectify is a game about approximating the length of a curve. In this version, you'll physically draw a curve and then try to place points on it to make the longest possible "path" by connecting those points with straight lines.

## Materials Needed
- Large sheet of paper or whiteboard
- Markers (at least two colors)
- A flexible ruler or a piece of string
- A standard ruler
- Calculator

## Setup
1.  **Draw a Curve**: Using one color marker, one player (the "Curve Drawer") draws a large, smooth, non-intersecting curve on the paper. It should have clear start and end points.
2.  **Measure the True Length (S)**: The Curve Drawer carefully measures the actual length of the curve using a piece of string or a flexible ruler. They write this number down and keep it secret. This is the value 'S'.

## Gameplay (10 Rounds)

The game is played over 10 rounds. The other player is the "Point Placer".

### Round 1
1.  The Point Placer must place **one dot** anywhere on the curve, except at the start or end points.
2.  Using a different colored marker, draw straight lines connecting the **start point -> the new dot -> the end point**.
3.  Use the standard ruler to measure the length of these two straight lines.
4.  Add the lengths together. This is your approximated length, `ΣL`.
5.  Your score for Round 1 is `S - ΣL` (The Curve Drawer can now reveal S).

### Round 2
1.  Erase the dot and lines from Round 1.
2.  The Point Placer must now place **two dots** anywhere on the curve.
3.  Draw straight lines connecting the points in order: **start -> dot 1 -> dot 2 -> end**.
4.  Measure the total length of these three straight lines to get the new `ΣL`.
5.  Calculate the score for Round 2: `S - ΣL`.

### Subsequent Rounds
- For each round `n`, the Point Placer places `n` dots on the curve.
- The total path will always consist of `n+1` line segments.
- The total score is the sum of the scores from all 10 rounds.

### Objective
The goal is to place the points in such a way that the total length of the straight-line segments is as large as possible, minimizing your score.