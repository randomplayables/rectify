# Rectify - A RandomPlayables Game

## Overview

Rectify is a mathematical game based on the concept of arc length rectification from differential geometry. The goal is to strategically place points along a given curve to maximize the total length of the line segments connecting them.

This project was created with React, TypeScript, and Vite.

## Gameplay

1.  **Select a Curve**: Choose from a list of predefined mathematical curves.
2.  **Place Points**: In each round `n`, you will place `n` points on the curve.
3.  **Maximize Length**: The objective is to make the sum of the straight-line distances between your points as large as possible.
4.  **Scoring**: Your score for each round is the difference between your path's length and the true arc length of the curve.
5.  **Win**: Achieve the highest possible total score across 10 rounds.

## Running the Project

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```