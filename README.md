# Dofus Farm Planner

## ▶ Open the tools

| Tool | Link |
|---|---|
| 🌾 Farm Planner | **https://fakeprogrammerberk.github.io/dofus-farm-planner/** |
| 📜 Quest Tracker | **https://fakeprogrammerberk.github.io/dofus-farm-planner/quests.html** |
| 🏆 Collection (archmonsters & dungeon bosses) | **https://fakeprogrammerberk.github.io/dofus-farm-planner/collection.html** |
| 🕰️ Count Harebourg Simulator | **https://fakeprogrammerberk.github.io/dofus-farm-planner/harebourg.html** |

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

## Count Harebourg Simulator (`harebourg.html`)

- Clepsydra Tower (Frigost 3) map with walls and holes
- Pick your vitality range at the start of the turn (90° clockwise, 90° counter-clockwise or 180°)
- Left click to place yourself, right click to place the monster — the cell to hit is shown in blue
- Warns when the target cell is off the map or there is no line of sight

## Usage

Open `index.html` (farm planner) or `quests.html` (quest tracker) in a browser (internet needed on first launch to download game data).

## Collection Tracker (`collection.html`)

- **Archmonsters:** all archmonsters with picture, level, the normal monster they replace, and their Eternal Harvest quest step
- **Dungeon bosses:** every boss with its dungeon and entrance coordinates (click to copy `/travel x,y`)
- Set a quantity for each; status shows Missing / Collected / Exchangeable (2 or more)
- Filter by status or quest step, search, sort by any column; progress is saved automatically
- Reset one list or everything; export/import a backup
