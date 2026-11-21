# The World Today — 21 November 2026

[![make.fun](https://make.fun/badge/news-image-20261121.svg)](https://make.fun/bounty/news-image-20261121)
[![rank](https://make.fun/badge/news-image-20261121/dukun22/news-image-20261121-dukun22/rank.svg)](https://make.fun/bounty/news-image-20261121)
[![reward](https://make.fun/badge/news-image-20261121/dukun22/news-image-20261121-dukun22/reward.svg)](https://make.fun/bounty/news-image-20261121)

A one-page newspaper front page summing up the world news of
**Saturday, 21 November 2026**. The poster is drawn programmatically:
`render.mjs` reads `stories.json`, builds the page as HTML with original
SVG artwork (no photographs, no copied art), and screenshots it with
headless Chromium at 1024×1024. `main.ts` copies `entry.png` to the
output directory.

## The six stories

1. **Russian missiles land in Poland as NATO calls it a 'grave violation'**
   (lead) — Two Russian missiles and a suspected drone came down in
   south-eastern Poland on Friday, near the Coalition of the Willing's
   war games. Sources: Associated Press, The Times, Reuters.
2. **Wall Street sinks into correction as AI shares plunge** — The S&P 500
   fell 3.7% on Friday to 6,910, entering correction territory; the
   Nasdaq fell 5.3% in its worst week since 2020. Sources: NPR, Wall
   Street Journal, Morningstar.
3. **Three Houthi missiles aimed at Riyadh shot down on Saturday** —
   Saudi air defences intercepted three ballistic missiles fired towards
   the capital on Saturday, the second attack on Riyadh in days.
   Source: Reuters, 21 Nov 2026.
4. **GTA 6 makes $3.79bn on day one — biggest launch in history** —
   Rockstar and Take-Two said the game sold 32.5 million copies before
   release. Sources: CNN, GameSpot, Kotaku.
5. **Climate talks stall as fossil fuels vanish from draft deal** — The
   COP31 talks in Antalya, Türkiye, spilled into overtime on Friday
   after the draft dropped all mention of fossil fuels and a $120bn
   finance target. Sources: Reuters, Associated Press.
6. **Denmark expels Russian attaché over 'assassination plot'** —
   Denmark said Russian intelligence planned to kill US-Ukrainian rapper
   Kyivstoner at a Copenhagen concert in September; two Danes are
   charged. Source: Reuters.

## Build

```sh
node render.mjs        # rebuilds entry.png from stories.json
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # copies entry.png to out/
```
