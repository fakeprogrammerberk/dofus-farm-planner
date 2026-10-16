# Dofus Farm Planner

## ▶ Open the tools

| Tool | Link |
|---|---|
| 🌾 Farm Planner | **https://fakeprogrammerberk.github.io/dofus-farm-planner/** |
| 📜 Quest Tracker | **https://fakeprogrammerberk.github.io/dofus-farm-planner/quests.html** |
| 🏆 Collection (archmonsters & dungeon bosses) | **https://fakeprogrammerberk.github.io/dofus-farm-planner/collection.html** |
| ⚒️ Profession XP Calculator | **https://fakeprogrammerberk.github.io/dofus-farm-planner/jobs.html** |
| 🕰️ Count Harebourg Simulator | **https://fakeprogrammerberk.github.io/dofus-farm-planner/harebourg.html** |
| 🌐 Translator (English, Türkçe, Español, Français) | **https://fakeprogrammerberk.github.io/dofus-farm-planner/translate.html** |

No install or account needed — just open a link. Your progress is saved in your own browser.

A single-page tool for planning Dofus farming sessions, in English.

- Browse areas and sub-areas (dungeons marked 🏰), or search a monster to see where it spawns
- See every drop in an area with its drop rate and which monsters drop it
- Enter your stock, marketplace price and 30-day sales to get a demand rating, farm value and kamas/hour
- Export tables to CSV; import/export your prices as JSON

Game data comes live from the public [DofusDB](https://dofusdb.fr) API. Your prices are stored only in your browser.

## Quest Tracker (`quests.html`)

- Every quest grouped by category, with level range, steps and prerequisites
- Tick whole quests or individual steps; progress is saved automatically in your browser
- Overall and per-category progress bars, filters (available now, in progress, completed, level range)
- Reset all progress or one category; export/import a progress backup

## Profession XP Calculator (`jobs.html`)

- Pick a profession, your current level (or exact XP) and a target level
- Every recipe with the XP it gives at your level, and how many crafts you need for the next level
- Add crafts with +1, “craft until the next 10 levels” or “craft until target” — XP is recalculated level by level
- XP coefficient (Almanax/events) and Epic server bonus
- Shopping list with every ingredient your plan needs, copyable

## Count Harebourg Simulator (`harebourg.html`)

- Clepsydra Tower (Frigost 3) map with walls and holes
- Pick your vitality range at the start of the turn (90° clockwise, 90° counter-clockwise or 180°)
- Left click to place yourself, right click to place the monster — the cell to hit is shown in blue
- Warns when the target cell is off the map or there is no line of sight

## Translator (`translate.html`)

- Translate between English, Turkish, Spanish and French
- Runs entirely in your browser with OPUS-MT and M2M100 models (Transformers.js) — your text never leaves your device
- Each language pack downloads once (about 110 MB, or 640 MB for English → Turkish) and then works offline
- Pairs without a direct pack go through English automatically; long texts are translated sentence by sentence and keep their line breaks
- **Flashcards:** every new word you translate is saved in its dictionary form (infinitive / singular) with its meaning and example sentence, then asked back at random — missed words come back more often
- Your word list is saved to a JSON file on your computer (Chrome/Edge) and loaded from it every time; edit or remove words in the list
- Dictionary forms come from [lemmatization-lists](https://github.com/michmech/lemmatization-lists) (English, Spanish, French — ODbL) and the [Zemberek](https://github.com/ahmetaa/zemberek-nlp) Turkish root dictionary (Apache 2.0)

## Usage

Open `index.html` (farm planner) or `quests.html` (quest tracker) in a browser (internet needed on first launch to download game data).

## Collection Tracker (`collection.html`)

- **Archmonsters:** all archmonsters with picture, level, the normal monster they replace, and their Eternal Harvest quest step
- **Dungeon bosses:** every boss with its dungeon and entrance coordinates (click to copy `/travel x,y`)
- Set a quantity for each; status shows Missing / Collected / Exchangeable (2 or more)
- Filter by status or quest step, search, sort by any column; progress is saved automatically
- Reset one list or everything; export/import a backup
