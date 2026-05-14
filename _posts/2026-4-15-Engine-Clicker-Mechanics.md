---
layout: post
title: Engine Clicker Mechanics Plan
permalink: /game-engine/engine-clicker-plan
---

# 🖱️ Clicker Mechanics: Secret Bonus Coins Across the Gate Game

**Gate Game | v1.1 | Cannonball · Escape Room · Zone Catch**

---

## Overview

All three Gate Game levels share a hidden "cookie-clicker" mechanic powered by `Clicker.js`. Each level hides a special clickable object somewhere on screen. Players who find it and repeatedly mouse-click it earn **bonus coins** on top of the normal coin pickups — the more you click, the more you earn (up to a cap).

---

## How `Clicker.js` Works

`Clicker` extends `Npc`. It adds two things:

1. **Click counter** — every mouse click on the object increments an internal `this.clcks` counter.
2. **Counter overlay** — `draw()` renders the current click count in bold yellow text on top of the sprite, so players can see their progress at a glance.

```js
handleClick(event) {
    if (this.interact) {
        this.clcks++;
        this.interact(this.clcks, this.spriteData?.id || 'unknown', this);
    }
}
```

Each level then defines its own `interact(clicks)` function on the clicker's data object to control the reward rate and cap.

---

## Level-by-Level Breakdown

---

### 🔦 Escape Room — Hidden Treasure Chest

| Property | Value |
|---|---|
| ID | `HiddenTreasure` |
| Location | `(340, 620)` — tucked in the bottom-left behind the fog |
| Rate | Every **3 clicks = +1 coin** |
| Cap | **15 bonus coins** |

The treasure chest is deliberately hidden behind the fog-of-war. Players have to explore the dungeon with their limited circle of light and stumble across it. Finding it at all is part of the reward.

```js
interact: function (clicks) {
    const CLICKS_PER_COIN = 3;
    const MAX_BONUS       = 15;
    if (this._bonusCoinsGiven >= MAX_BONUS) return;
    if (clicks % CLICKS_PER_COIN === 0) {
        gameEnv.stats.coinsCollected++;
        this._bonusCoinsGiven++;
    }
}
```

The chest sits alongside 9 walk-over coins scattered through the dungeon, so the clicker is a secondary bonus on top of normal exploration rewards.

---

### 💣 Cannonball — Blinking Coin

| Property | Value |
|---|---|
| ID | `BonusChest` |
| Location | Randomized — blinks around the arena every ~2 seconds |
| Rate | Every **3 clicks = +1 coin** |
| Cap | **40 bonus coins** |

This level has **no walk-over coins at all** — the blinking coin-clicker is the only coin source. It appears at a random position, stays visible for ~2 seconds, then hides and repositions. Players must balance dodging incoming cannonballs while clicking the coin before it disappears.

```js
_startClickerBlink() {
    // visible ~2s → hidden 0.8s → reposition → reappear
    // Retry on a 300ms delay if the sprite sheet hasn't loaded yet.
}
```

The high cap (40) reflects that this is the sole coin source, giving dedicated clickers a meaningful coin haul.

---

### 🎯 Zone Catch — Power Core

| Property | Value |
|---|---|
| ID | `PowerCore` |
| Location | Fixed — top-center of the screen (`x: width * 0.5, y: height * 0.12`) |
| Rate | Every **4 clicks = +1 coin** |
| Cap | **20 bonus coins** |

Zone Catch already has 3 walk-over coins placed around the arena. The Power Core sits visibly at the top of the screen — it is not hidden. The harder click rate (4 per coin vs 3) and lower cap balance the fact that it is easy to find and click while the zone-catch minigame is running in the overlay.

```js
interact: function (clicks) {
    const CLICKS_PER_COIN = 4;
    const MAX_BONUS       = 20;
    if (this._bonusCoinsGiven >= MAX_BONUS) return;
    if (clicks % CLICKS_PER_COIN === 0) {
        gameEnv.stats.coinsCollected++;
        this._bonusCoinsGiven++;
    }
}
```

---

## Design Comparison

| Level | Clicker Name | Clicks/Coin | Max Bonus | Hidden? | Other Coins? |
|---|---|---|---|---|---|
| Escape Room | Hidden Treasure | 3 | 15 | ✅ Behind fog | ✅ 9 walk-over coins |
| Cannonball | Blinking Coin | 3 | 40 | ✅ Blinks randomly | ❌ Only coin source |
| Zone Catch | Power Core | 4 | 20 | ❌ Visible at top | ✅ 3 walk-over coins |

---

## Key Takeaway

The `Clicker` class is a single, reusable game engine component. Each level just defines a different `interact()` callback — adjusting the clicks-per-coin ratio, the cap, and the placement to fit the level's theme and difficulty. The click counter overlay on the sprite keeps players informed so clicking never feels like a blind action.