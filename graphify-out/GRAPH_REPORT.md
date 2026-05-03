# Graph Report - .  (2026-04-27)

## Corpus Check
- Corpus is ~21,933 words - fits in a single context window. You may not need a graph.

## Summary
- 84 nodes · 173 edges · 7 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Components & Canvas|UI Components & Canvas]]
- [[_COMMUNITY_App Core & AI Integration|App Core & AI Integration]]
- [[_COMMUNITY_Board & Card Management|Board & Card Management]]
- [[_COMMUNITY_HTML Entry Point|HTML Entry Point]]
- [[_COMMUNITY_API Key & Localization|API Key & Localization]]
- [[_COMMUNITY_Database Read|Database Read]]
- [[_COMMUNITY_Database Write|Database Write]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 6 edges
2. `fmtDate()` - 6 edges
3. `BoardScreen()` - 6 edges
4. `getAIKey()` - 5 edges
5. `getThemeCSS()` - 5 edges
6. `LobbyScreen()` - 5 edges
7. `getL()` - 4 edges
8. `useIsMobile()` - 4 edges
9. `JoinScreen()` - 4 edges
10. `setL()` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "UI Components & Canvas"
Cohesion: 0.07138047138047138
Nodes (53): AddForm(), AddStickerForm(), AIKeySetup(), AIPanel(), AttachZone(), BoardGrid(), CanvasCardNode(), CanvasSkillNode() (+45 more)

### Community 1 - "App Core & AI Integration"
Cohesion: 0.23636363636363636
Nodes (11): App(), BoardScreen(), callAI(), getAIKey(), getL(), getThemeCSS(), JoinScreen(), LobbyScreen() (+3 more)

### Community 2 - "Board & Card Management"
Cohesion: 0.4
Nodes (5): BoardTile(), CardReaderModal(), ConnCard(), fmtDate(), StickerNode()

### Community 3 - "HTML Entry Point"
Cohesion: 1.0
Nodes (3): main.jsx, MindStorm, root

### Community 4 - "API Key & Localization"
Cohesion: 1.0
Nodes (2): saveAIKey(), setL()

### Community 5 - "Database Read"
Cohesion: 1.0
Nodes (2): dbGetBoardData(), dbToData()

### Community 6 - "Database Write"
Cohesion: 1.0
Nodes (2): boardToDb(), dbCreateBoard()

## Knowledge Gaps
- **Thin community `API Key & Localization`** (2 nodes): `saveAIKey()`, `setL()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Database Read`** (2 nodes): `dbGetBoardData()`, `dbToData()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Database Write`** (2 nodes): `boardToDb()`, `dbCreateBoard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.