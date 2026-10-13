# Dofus Farm Planner

## ▶ Open the tools

| Tool | Link |
|---|---|
| 🌾 Farm Planner | **https://fakeprogrammerberk.github.io/dofus-farm-planner/** |
| 📜 Quest Tracker | **https://fakeprogrammerberk.github.io/dofus-farm-planner/quests.html** |
| 🏆 Collection (archmonsters & dungeon bosses) | **https://fakeprogrammerberk.github.io/dofus-farm-planner/collection.html** |
| ⚔️ Build Planner | **https://fakeprogrammerberk.github.io/dofus-farm-planner/builds.html** |

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

## Build Planner (`builds.html`)

- Equip hat, cloak, amulet, 2 rings, belt, boots, weapon, shield, pet/mount and 6 Dofus/trophies — search any item by name and level
- Live stat totals: AP, MP, range, HP, initiative, prospecting, characteristics, damage and resistances, including set bonuses
- Characteristic points with the game's tiered costs, plus scrolls; max/min item rolls
- Save multiple builds, duplicate, share a build with a link, export/import

## Usage

Open `index.html` (farm planner) or `quests.html` (quest tracker) in a browser (internet needed on first launch to download game data).

## Collection Tracker (`collection.html`)

- **Archmonsters:** all archmonsters with picture, level, the normal monster they replace, and their Eternal Harvest quest step
- **Dungeon bosses:** every boss with its dungeon and entrance coordinates (click to copy `/travel x,y`)
- Set a quantity for each; status shows Missing / Collected / Exchangeable (2 or more)
- Filter by status or quest step, search, sort by any column; progress is saved automatically
- Reset one list or everything; export/import a backup
