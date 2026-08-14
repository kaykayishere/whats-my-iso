# What’s My ISO?

Standalone public web tool to look up ISO language codes and related identifiers.

Part of the **SILICON Public Tools / ISO Crosswalk** workstream (Project 37).

## Features

- Search by English name, autonym, alternate names, ISO 639-1/2/3, BCP 47, Keyman/SIL, Glottolog
- Fuzzy matching + exact code priority
- Shows all relevant codes, deprecated status, macrolanguage relations, geographic info
- Clear ambiguity indicator when multiple languages match
- Click any code to copy
- Dark mode support
- Fully client-side after first data load (works offline once loaded)

## Tech

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Fuse.js for fuzzy search
- Data: SILICON FINAL Crosswalk (≈ 8 400 language / family entries)

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this repo to GitHub
2. Import in Vercel
3. Deploy (no env vars needed)

The large `public/data/crosswalk.json` is served statically.

## Data source

`public/data/crosswalk.json` is generated from  
**FINAL Crosswalk ISO / Edited & Revised w/Keyman.xlsx**  
(sheet `FINALCrosswalk-wCountry + Regio`).

To regenerate:

```bash
# (from project root, after placing the xlsx)
python3 scripts/build-data.py
```

## Project structure

```
src/
  app/          # pages & layout
  components/   # SearchBar, ResultCard
  lib/          # types + search logic
public/
  data/         # crosswalk.json
```

## License

Internal SILICON / IDLI project use. Data derived from ISO / SIL / Glottolog sources.
