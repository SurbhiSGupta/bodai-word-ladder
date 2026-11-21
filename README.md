# Bodai Word Ladder

Change one letter at a time to climb from one word to another: FIRE → FORE → CORE → CORD → COLD.

A sister game to [Bodai Sudoku](https://sudoku.bodaijewels.com), designed and built by Surbhi S Gupta. It's built in React, TypeScript and Tailwind, with its look rebuilt as a small design system: tokens, light and dark themes, palettes and a component gallery.

## Run it

```bash
npm install
npm run dev
```

## Before you push

```bash
npm run check
```

This runs the type check, lint, formatting check and tests. The same checks run on GitHub and on Netlify, and nothing ships if they fail.

## Where things live

| Folder           | What's in it                                                          |
| ---------------- | --------------------------------------------------------------------- |
| `src/app`        | Screens and app-level wiring                                          |
| `src/components` | Reusable UI pieces (Rung, LetterTile, Key...)                         |
| `src/game`       | Pure game logic with no React, each file with a `.test.ts` beside it  |
| `src/styles`     | `tokens.css` holds every color; `index.css` connects them to Tailwind |
| `scripts`        | Offline tools: word-list builder, puzzle generator                    |
| `data`           | Generated word lists and puzzles                                      |
