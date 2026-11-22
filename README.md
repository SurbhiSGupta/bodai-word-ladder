# Bodai Word Ladder

Change one letter at a time to climb from one word to another: FIRE → FORE → CORE → CORD → COLD.

A sister game to [Bodai Sudoku](https://sudoku.bodaijewels.com), designed and built by Surbhi S Gupta. It's built in React, TypeScript and Tailwind, with its look rebuilt as a small design system: tokens, light and dark themes, palettes and a component gallery.

## Run it

```bash
npm install
npm run dev
```

## Design system

```bash
npm run storybook
```

Every component, with a toolbar to switch Light/Dark and the five palettes. It's also published at [/storybook](https://surbhisgupta.github.io/bodai-word-ladder/storybook/).

**Colors have one master copy: `tokens/tokens.json`.**

- `npm run tokens` rebuilds `src/styles/tokens.css` and `src/styles/palettes.ts` from it.
- `npm run figma-sync` writes `tokens/figma-sync.js`, which creates or updates the Figma variables (Theme: Light/Dark, Palette: Bodai, Berry, Lavender, Mango, Ocean, and Shape) in the [design system file](https://www.figma.com/design/EaPQrTk1Co6Ls1nvAusEQ2).

## Before you push

```bash
npm run check
```

This runs the type check, lint, formatting check and tests. The same checks run on GitHub for every push and pull request, and nothing ships if they fail.

## Deploying

Every push to `main` that passes the checks goes live on GitHub Pages, for free and with no deploy limits:

- Game: https://surbhisgupta.github.io/bodai-word-ladder/
- Storybook: https://surbhisgupta.github.io/bodai-word-ladder/storybook/

It's set up in `.github/workflows/ship.yml`. Netlify is switched off (`netlify.toml` skips every build).

## Where things live

| Folder           | What's in it                                                          |
| ---------------- | --------------------------------------------------------------------- |
| `src/app`        | Screens and app-level wiring                                          |
| `src/components` | Reusable UI pieces (Rung, LetterTile, Key...)                         |
| `src/game`       | Pure game logic with no React, each file with a `.test.ts` beside it  |
| `src/styles`     | `tokens.css` holds every color; `index.css` connects them to Tailwind |
| `scripts`        | Offline tools: word-list builder, puzzle generator                    |
| `data`           | Generated word lists and puzzles                                      |

## Word lists

```bash
npm run words
```

This rebuilds everything in `src/data` from the sources below plus the hand-edited files in `wordlists/`, and writes `wordlists/report.md` with counts, dead ends and sample puzzles.

- **Common words** (puzzles, hints, suggestions): SCOWL size 35 and below.
- **Accepted words** (anything you can type): SCOWL size 70 and below.
- **Start and end words:** common words that aren't plurals or -ed/-ing forms, and aren't dead ends.

## Credits

- Words: [SCOWL](http://wordlist.aspell.net/) by Kevin Atkinson, via `wordlist-english` (MIT-style license; see its Copyright file).
- Meanings: [WordNet 3.1](https://wordnet.princeton.edu/), Princeton University, via `wordnet-db` (WordNet License).
- Blocklist: [List of Dirty, Naughty, Obscene, and Otherwise Bad Words](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words) (CC BY 4.0), via `naughty-words`, plus our own additions in `wordlists/never.txt`.
