# Bodai Word Ladder: notes for AI helpers

Read README.md first. This file holds the rules that keep the code clean and readable for both people and AI.

## Rules

- **Colors come from tokens only.** Never hard-code a hex value in a component. Add or change a color in `tokens/tokens.json`, run `npm run tokens` (and `npm run figma-sync`, then run that script in Figma), and use it as a Tailwind class (`bg-surface`, `text-ink`). Never edit `src/styles/tokens.css` by hand.
- **Game logic stays pure.** Anything in `src/game` takes plain values and returns plain values, with no React, DOM or storage, and has a test beside it.
- **Accessibility is a feature.** Everything works by keyboard. Anything that changes on screen is announced to screen readers. Interactive elements have real labels.
- **Never hand-edit `src/data`.** Change the inputs in `wordlists/` or `scripts/build-words.ts`, then run `npm run words`.
- **Imports inside `src/game` use the `.ts` extension**, so the Node scripts can import game logic directly.
- **Small, named pieces.** One component per file in `src/components`, named for what it is (`Rung`, `LetterTile`), with a `.stories.tsx` beside it covering every state, checked in Light and Dark.
- **Run `npm run check` before calling anything done.**
- **Push in batches, deploy rarely.** Netlify's free plan counts every deploy. Commit as often as you like, but push only at milestones, and only a push whose latest commit message contains `[deploy]` goes live (see `netlify.toml`). Preview day to day with `npm run dev` and Storybook instead. GitHub's checks still run on every push, and they're free.

## Product decisions

The owner's decision log lives outside this repo, at `~/Documents/rewindthefuture-source/BodaiLadder/` (`roadmap.md`, `process-log.md`). Add new decisions to `process-log.md`.

## Tone

Every word players see is warm, plain and a little playful, never robotic. Bones, not lives. Frisky is the dog.
