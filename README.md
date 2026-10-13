# Dofus Farm Planner

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

## Usage

Open `index.html` (farm planner) or `quests.html` (quest tracker) in a browser (internet needed on first launch to download game data).
