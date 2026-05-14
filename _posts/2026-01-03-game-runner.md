---
layout: post
codemirror: true
title: Group Work On Game Levels — Aryan Malik
description: A CS111 mini-lesson walkthrough of the three-level slime escape game our group built together. Covers control structures, data types, and operators as they appear in GameLevelCannonball, GameLevelEscaperoom, and GameLevelZonecatch.
permalink: /rpg/aryan-game-blog
---

## THE OBJECTIVE OF THE GAME

This game is really simple and based on objective. Your player is a slime, and the slime is tossed around in the air. Throughout the process, you try to make it fast enough that you don't melt. You go through three levels:
1. A cannonball dodge level
2. A maze escape room
3. A zone capture challenge

To go past all of them, you reach the sea, so you're on the surface as fast as possible.

---

## HOW WE USED DEBUGGING

### Inspect

The way we use debugging tools in this project is by using the inspect tool in Google Chrome. Using the browser DevTools, we can see the hitboxes for investigation into the code files. We used this to tune collision detection in the cannonball level and to verify that the ZoneCatch overlay canvas was rendering at the correct viewport coordinates.

#### HTML Component

- File: `_includes/runners/game.html`
- Reusable component for GameEngine integration
- Automatically creates gameContainer and gameCanvas
- Provides game controls: Start, Pause/Resume, Stop, Reset
- Level selector dropdown for switching between game levels

#### SCSS Styling

- Main file: `_sass/open-coding/forms/game-runner.scss`
- Uses runner-base mixin for consistency
- Game output constrained to 400–600 px height for education
- Canvas automatically sized and centered
- Color-coded buttons: Green (Start), Yellow (Pause), Red (Stop)

### Game Output Area

The game renders in a constrained canvas for educational purposes:

- Min height: 400 px
- Max height: 600 px
- Canvas max height: 580 px
- Black background with accent-colored border
- Automatically centers the canvas
- Scrollable if content exceeds container

### Controls

- **▶ Start**: Runs the game code and starts the game engine
- **⏸ Pause / ▶ Resume**: Pauses and resumes game execution
- **■ Stop**: Stops the game and clears the canvas
- **↻ Reset**: Resets code to original and stops the game
- **Level Selector**: Dropdown to switch between game levels
- **📋 Copy**: Copy code to clipboard
- **🗑️ Clear**: Clear the editor

### Code Structure

Your game code must export two things:

1. **GameControl**: Your GameControl class (usually imported)
2. **gameLevelClasses**: Array of game level classes

```javascript
import GameControl from '/assets/js/GameEnginev1/essentials/GameControl.js';
import GameLevelCannonball from '/assets/js/GameEnginev1/GameLevelCannonball.js';
import GameLevelEscaperoom from '/assets/js/GameEnginev1/GameLevelEscaperoom.js';
import GameLevelZonecatch  from '/assets/js/GameEnginev1/GameLevelZonecatch.js';

export const gameLevelClasses = [GameLevelCannonball, GameLevelEscaperoom, GameLevelZonecatch];
export { GameControl };
```

---

## CS111 MINI-LESSON: CONTROL STRUCTURES

> **Mini-lesson purpose:** Each section below explains how a CS111 concept appears directly in one of the three game levels.

### Iteration — Loops

Iteration means repeating a block of code. The game uses iteration in two main places:

**`for` loop — cannonball lane selection**

Inside `GameLevelCannonball`, three fixed Y-positions are stored in an array and iterated to pick a random lane each shot:

```javascript
// GameLevelCannonball.js — fireCannonball()
const lanes = [
    Math.round(vh * 0.20),   // top lane
    Math.round(vh * 0.50),   // middle lane
    Math.round(vh * 0.75)    // bottom lane
];
const targetY = lanes[Math.floor(Math.random() * lanes.length)];
```

`Math.floor(Math.random() * lanes.length)` produces an index 0, 1, or 2. Using a `for`-style index into the array is exactly the kind of iteration the rubric calls out: **using loops for game-object arrays**.

**`forEach` — ZoneCatch sample-point scan**

In `GameLevelZonecatch`, when a round ends, the game samples a cross-shaped set of pixels around the player to decide whether they survived. It iterates a `samplePoints` array with `for...of`:

```javascript
// GameLevelZonecatch.js — _checkSurvivalAtRoundEnd()
const samplePoints = [
    [0,  0],
    [-10, 0], [10, 0], [0, -10], [0, 10],
    [-6, -6], [6, -6], [-6, 6],  [6,  6],
];

for (const [dx, dy] of samplePoints) {
    const pixel = this.ctx.getImageData(cx + dx, cy + dy, 1, 1).data;
    if (pixel[3] < 30) continue;   // transparent = outside circles
    // ... compare pixel color to safe / danger circle
}
```

Each iteration reads one pixel under the player's center. The loop as a whole decides win-or-die.

**`while`-style countdown — ZoneCatch**

The countdown before each round uses `setTimeout` recursion that decrements a counter until it reaches zero, which mirrors a `while` loop:

```javascript
// GameLevelZonecatch.js — _runCountdown()
_runCountdown() {
    if (this.countdownValue <= 0) {
        this.countdownPhase = false;
        this._scheduleNextRound(400);
        return;
    }
    this._timer = setTimeout(() => {
        this.countdownValue--;
        this._runCountdown();     // repeat until countdownValue == 0
    }, 1000);
}
```

---

### Conditionals — if / else

Conditionals control which branch of code runs based on a true/false test.

**Cannonball hit-or-dodge:**

```javascript
// GameLevelCannonball.js — _endRound()
if (this.collisionHappened) {
    player.x = 100;                               // reset to start
    this.showMessage('💥 HIT!  Reset to start.', 'error');
} else {
    const advance = player.x >= 700 ? 200 : 300;
    player.x += advance;
    this.showMessage(`✅ DODGED!  +${advance} px!`, 'success');
}
```

The `if/else` separates the two game outcomes. This is the core of the level's feedback loop: one path punishes the player, the other rewards them.

**Escaperoom NPC reaction:**

```javascript
// GameLevelEscaperoom.js — npcData1
reaction: function() {
    if (this.dialogueSystem) {
        this.showReactionDialogue();
    } else {
        console.log(this.greeting);     // fallback for missing dialogue system
    }
}
```

---

### Nested Conditions

Nested conditions are `if` statements inside other `if` statements, used when multiple things must all be true.

**ZoneCatch survival check — three layers deep:**

```javascript
// GameLevelZonecatch.js — _checkSurvivalAtRoundEnd()
for (const [dx, dy] of samplePoints) {
    const pixel = this.ctx.getImageData(cx + dx, cy + dy, 1, 1).data;

    // Outer: only consider non-transparent pixels
    if (pixel[3] < 30) continue;

    hasOpaquePixel = true;
    const sd = Math.sqrt(
        (pixel[0] - safeRGB.r) ** 2 +
        (pixel[1] - safeRGB.g) ** 2 +
        (pixel[2] - safeRGB.b) ** 2
    );
    if (sd < bestSafeDist) bestSafeDist = sd;

    // Inner: only compute danger distance if a danger circle exists
    if (dangerRGB) {
        const dd = Math.sqrt(
            (pixel[0] - dangerRGB.r) ** 2 +
            (pixel[1] - dangerRGB.g) ** 2 +
            (pixel[2] - dangerRGB.b) ** 2
        );
        if (dd < bestDangerDist) bestDangerDist = dd;
    }
}

// Final multi-condition gate
if (!hasOpaquePixel || bestSafeDist > 80 || bestSafeDist >= bestDangerDist) {
    this._triggerDeath();
}
```

The player must satisfy all three conditions simultaneously to survive: there must be a colored pixel under them, it must be close to the safe color, and it must be closer to safe than to danger.

---

## CS111 MINI-LESSON: DATA TYPES

### Numbers

Position, velocity, score, and timing are all numbers.

```javascript
// GameLevelCannonball.js — constructor
this.cannonballX     = -300;      // start off-screen (negative number)
this.cannonballY     = 400;
this.cannonballSpeed = 20;        // pixels per frame
this.cannonballSize  = 64;        // sprite dimensions

// GameLevelZonecatch.js — _spawnCircles()
const baseR = Math.max(50, 95 - this.round * 3);   // radius shrinks each round
```

The cannonball moves because `cannonballX -= cannonballSpeed` runs every frame inside `update()`.

### Strings

Strings hold paths, messages, and color codes.

```javascript
// GameLevelEscaperoom.js — bgData
src: path + "/images/gamebuilder/bg/Slab.png"           // path concatenation

// GameLevelCannonball.js — showMessage()
this.showMessage('💥 HIT!  Reset to start.', 'error');
this.showMessage(`✅ DODGED!  +${advance} px!`, 'success');   // template literal

// GameLevelZonecatch.js — colorPairs
['#e63946', '#457b9d'],    // hex color strings used to fill circles
```

Template literals (the backtick strings) let the game build messages that include live variable values — the dodge distance changes based on how far the player has traveled.

### Booleans

Boolean flags control the game's state machine.

```javascript
// GameLevelCannonball.js — constructor
this.roundRunning      = false;    // is a round currently active?
this.dodgeWindowOpen   = false;    // can the cannonball register a hit?
this.collisionHappened = false;    // did the player get hit this round?

// GameLevelZonecatch.js — _reset()
this.roundActive  = false;
this.breakActive  = false;
this.gameOver     = false;
this.won          = false;
this.introPhase   = true;
```

Every major game-state transition is a boolean flip. For example, when a round ends:

```javascript
this.roundActive = false;
this.breakActive = true;
```

### Arrays

Arrays hold collections of game objects and data.

```javascript
// GameLevelZonecatch.js — colorPairs: array of color-pair arrays
this.colorPairs = [
    ['#e63946', '#457b9d'],
    ['#f4a261', '#2a9d8f'],
    ['#e9c46a', '#6a0572'],
    ['#ff006e', '#38b000'],
    ['#fb5607', '#3a86ff'],
    ['#ffbe0b', '#8338ec'],
];

// circles array holds the two active zone circles each round
this.circles = [
    { x: x0, y: y0, r: baseR, color: shuffled[0], safe: safeIdx === 0 },
    { x: x1, y: y1, r: baseR, color: shuffled[1], safe: safeIdx === 1 },
];

// this.classes is the array the engine reads to build the level
this.classes = [
    { class: GameEnvBackground, data: bgData },
    { class: Player,            data: playerData },
    { class: Barrier,           data: barrier1   },
    // ... more barriers
];
```

### Objects (JSON)

Configuration objects describe every game entity's properties.

```javascript
// GameLevelEscaperoom.js — playerData config object
const playerData = {
    id: 'playerData',
    src: path + "/images/gamebuilder/sprites/slime.png",
    SCALE_FACTOR:   15,
    STEP_FACTOR:    1000,
    ANIMATION_RATE: 50,
    INIT_POSITION:  { x: 60, y: 247 },          // nested object
    pixels:         { height: 225, width: 225 },
    orientation:    { rows: 4, columns: 4 },
    hitbox:         { widthPercentage: 0, heightPercentage: 0 },
    keypress:       { up: 87, left: 65, down: 83, right: 68 }
};
```

Changing `INIT_POSITION.x` moves the player's spawn. Changing `STEP_FACTOR` makes movement faster. The entire level is data-driven through these objects.

---

## CS111 MINI-LESSON: OPERATORS

### Mathematical Operators

Physics and position use `+`, `-`, `*`, `/`, and `Math` functions.

```javascript
// GameLevelCannonball.js — update() — moves the cannonball left every frame
this.cannonballX -= this.cannonballSpeed;

// AABB collision — checks rectangle overlap
const pb = {
    x:  px + sx,
    y:  py + sy,
    x2: px + pw - sx,
    y2: py + ph - sy
};
return !(cb.x2 < pb.x || cb.x > pb.x2 || cb.y2 < pb.y || cb.y > pb.y2);

// GameLevelZonecatch.js — Euclidean distance between two points
_dist(ax, ay, bx, by) {
    return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

// Circle radius shrinks each round using subtraction and Math.max
const baseR = Math.max(50, 95 - this.round * 3);
```

### String Operations

Path concatenation and template literals build file paths and UI messages.

```javascript
// Path concatenation — string + string
src: this.path + "/images/gamebuilder/sprites/Cannonball.png"

// Template literal — embeds a variable directly into a string
this.showMessage(`✅ DODGED!  +${advance} px!`, 'success');

// ZoneCatch — color hex string used as Canvas fill
ctx.fillStyle = safe.color + 'cc';   // append alpha to hex color string
```

### Boolean Expressions (`&&`, `||`, `!`)

**`&&` (AND) — all must be true:**

```javascript
// GameLevelZonecatch.js — player must be near the gate AND gate must be visible
if (this.roundActive && this.gateVisible && this.gateCircle) {
    const p = this._getPlayerCenter();
    if (p && this._dist(p.x, p.y, this.gateCircle.x, this.gateCircle.y)
             < this.gateCircle.r * 1.5) {
        this._triggerWin();
    }
}
```

**`||` (OR) — any one is enough:**

```javascript
// ZoneCatch death condition — any one of three problems kills the player
if (!hasOpaquePixel || bestSafeDist > 80 || bestSafeDist >= bestDangerDist) {
    this._triggerDeath();
}
```

**`!` (NOT) — flips a boolean:**

```javascript
// GameLevelZonecatch.js — spawn circles, one safe and one not safe
{ x: x0, y: y0, r: baseR, color: shuffled[0], safe: safeIdx === 0 },
{ x: x1, y: y1, r: baseR, color: shuffled[1], safe: safeIdx === 1 },

// The danger circle is found by negating .safe
const danger = this.circles.find(c => !c.safe);
```

---

## Level Breakdown

### Level 1 — GameLevelCannonball (Dodge Challenge)

> **Challenge:** Use W and S to move up and down. A cannonball fires from the right — dodge it to advance 300 px toward the gate. Get hit and you reset to the start. Reach the gate and press E, then ESC to advance.

<details>
<summary>📄 View Level 1 Source Code</summary>
<div style="max-height:400px;overflow-y:auto;background:#1e1e1e;border-radius:6px;padding:12px;margin-top:8px;">

```javascript
import GameControl from '/assets/js/GameEnginev1/essentials/GameControl.js';
import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';

class GameLevelCannonball {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.path    = gameEnv.path;

        // ── Game state ──────────────────────────────────────────────────────
        this.roundRunning      = false;
        this.dodgeWindowOpen   = false;
        this.collisionHappened = false;

        // ── Cannonball ───────────────────────────────────────────────────────
        this.cannonballEl    = null;
        this.cannonballX     = -300;
        this.cannonballY     = 400;
        this.cannonballSpeed = 20;
        this.cannonballSize  = 64;

        // ── Gate (plain DOM img, no canvas/Npc class) ────────────────────────
        this.gateEl      = null;
        this._eKeyHandler = null;

        // ── Scene objects ───────────────────────────────────────────────────
        const bgData = {
            name: "custom_bg",
            src:  this.path + "/images/gamebuilder/bg/CannonDesert.png",
            pixels: { height: 772, width: 1134 }
        };

        const playerData = {
            id: 'playerData',
            src: this.path + "/images/gamebuilder/sprites/slime.png",
            SCALE_FACTOR:   5,
            STEP_FACTOR:    1000,
            ANIMATION_RATE: 50,
            INIT_POSITION:  { x: 100, y: 400 },
            pixels:         { height: 225, width: 225 },
            orientation:    { rows: 4, columns: 4 },
            down:      { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate:  Math.PI / 16 },
            downLeft:  { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left:      { row: 2, start: 0, columns: 3 },
            right:     { row: 1, start: 0, columns: 3 },
            up:        { row: 3, start: 0, columns: 3 },
            upLeft:    { row: 2, start: 0, columns: 3, rotate:  Math.PI / 16 },
            upRight:   { row: 3, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox:    { widthPercentage: 0.4, heightPercentage: 0.4 },
            keypress:  { up: 87, left: 65, down: 83, right: 68 }
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player,            data: playerData }
        ];
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    getPlayer() {
        if (!this.gameEnv?.gameObjects) return null;
        return this.gameEnv.gameObjects.find(o => o.constructor.name === 'Player');
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    initialize() {
        this._createCannonballElement();
        this._createGateElement();
        this._registerEKey();

        const player = this.getPlayer();
        if (player) this._lockPlayerToVertical(player);

        setTimeout(() => this.showInstructions(), 500);
    }

    destroy() {
        this.cannonballEl?.remove();
        this.cannonballEl = null;

        this.gateEl?.remove();
        this.gateEl = null;

        if (this._eKeyHandler) {
            document.removeEventListener('keydown', this._eKeyHandler);
            this._eKeyHandler = null;
        }
    }

    // ── Gate DOM element ──────────────────────────────────────────────────────

    _createGateElement() {
        document.getElementById('game-gate')?.remove();

        const img = document.createElement('img');
        img.id  = 'game-gate';
        img.src = this.path + "/images/gamebuilder/sprites/mastergate.png";
        const size = Math.round(window.innerHeight * 0.20);
        Object.assign(img.style, {
            position:      'fixed',
            width:         size + 'px',
            height:        size + 'px',
            objectFit:     'contain',
            left:          Math.round(window.innerWidth * 0.62) + 'px',
            top:           Math.round(window.innerHeight * 0.35) + 'px',
            zIndex:        '500',
            pointerEvents: 'none'
        });
        document.body.appendChild(img);
        this.gateEl = img;
    }

    // ── E key → show dialogue in promptDropDown ───────────────────────────────

    _registerEKey() {
        this._eKeyHandler = (e) => {
            if (e.key !== 'e' && e.key !== 'E') return;

            const player = this.getPlayer();
            if (!player || !this.gateEl) return;

            // Get centres of player and gate
            const pr = player.canvas?.getBoundingClientRect();
            const gr = this.gateEl.getBoundingClientRect();
            if (!pr) return;

            const dist = Math.hypot(
                (pr.left + pr.width  / 2) - (gr.left + gr.width  / 2),
                (pr.top  + pr.height / 2) - (gr.top  + gr.height / 2)
            );

            if (dist < 250) {
                this._showGateDialogue();
            }
        };
        document.addEventListener('keydown', this._eKeyHandler);
    }

    _showGateDialogue() {
        // Use the game's built-in promptDropDown div from the page
        const dropdown = document.getElementById('promptDropDown');
        if (dropdown) {
            dropdown.textContent = 'Press Esc to go to the next level!';
            Object.assign(dropdown.style, {
                display:         'block',
                padding:         '12px 20px',
                backgroundColor: 'rgba(0,0,0,0.85)',
                color:           'white',
                fontSize:        '18px',
                fontFamily:      'Arial, sans-serif',
                borderRadius:    '8px',
                position:        'fixed',
                bottom:          '80px',
                left:            '50%',
                transform:       'translateX(-50%)',
                zIndex:          '9999'
            });
            setTimeout(() => { dropdown.style.display = 'none'; }, 3000);
        }
    }

    // ── Cannonball DOM element ────────────────────────────────────────────────

    _createCannonballElement() {
        document.getElementById('game-cannonball')?.remove();

        const img = document.createElement('img');
        img.id  = 'game-cannonball';
        img.src = this.path + "/images/gamebuilder/sprites/Cannonball.png";
        Object.assign(img.style, {
            position:      'fixed',
            width:         this.cannonballSize + 'px',
            height:        this.cannonballSize + 'px',
            objectFit:     'contain',
            left:          '-300px',
            top:           '400px',
            zIndex:        '600',
            display:       'none',
            pointerEvents: 'none'
        });
        document.body.appendChild(img);
        this.cannonballEl = img;
    }

    _showCannonball(x, y) {
        this.cannonballX = x;
        this.cannonballY = y;
        if (this.cannonballEl) {
            this.cannonballEl.style.left    = x + 'px';
            this.cannonballEl.style.top     = y + 'px';
            this.cannonballEl.style.display = 'block';
        }
    }

    _hideCannonball() {
        if (this.cannonballEl) this.cannonballEl.style.display = 'none';
        this.cannonballX = -300;
    }

    // ── Player movement lock (up / down only) ─────────────────────────────────

    _lockPlayerToVertical(player) {
        player.updateVelocity = function () {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.moved = false;
            if (this.pressedKeys[this.keypress.up]) {
                this.velocity.y -= this.yVelocity;
                this.moved = true;
            } else if (this.pressedKeys[this.keypress.down]) {
                this.velocity.y += this.yVelocity;
                this.moved = true;
            }
        };
    }

    // ── UI overlays ───────────────────────────────────────────────────────────

    showInstructions() {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            zIndex: '10000', color: 'white', fontFamily: 'Arial, sans-serif'
        });

        const title = document.createElement('h1');
        title.textContent = '💣 Cannonball Dodge Challenge';
        title.style.cssText = 'margin-bottom:20px; font-size:34px; text-align:center;';
        overlay.appendChild(title);

        const text = document.createElement('p');
        text.textContent =
            'Cannonballs fire from the right!\n' +
            'Use W / S to dodge up and down.\n\n' +
            '✅ Dodge → advance 300 px forward\n' +
            '💥 Hit   → reset to the very start\n\n' +
            'Reach the gate and press E — then Esc to go to the next level!';
        Object.assign(text.style, {
            maxWidth: '540px', marginBottom: '30px',
            fontSize: '17px', lineHeight: '1.9',
            textAlign: 'center', whiteSpace: 'pre-line'
        });
        overlay.appendChild(text);

        const btn = document.createElement('button');
        btn.textContent = '▶  Start';
        Object.assign(btn.style, {
            padding: '13px 36px', fontSize: '18px', cursor: 'pointer',
            backgroundColor: '#4CAF50', color: 'white',
            border: 'none', borderRadius: '6px'
        });
        btn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            this.startRound();
        });
        overlay.appendChild(btn);
        document.body.appendChild(overlay);
    }

    showCountdown(seconds, callback) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.7)', color: 'white',
            padding: '40px 60px', borderRadius: '10px',
            fontSize: '72px', fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            zIndex: '9999', minWidth: '150px', textAlign: 'center'
        });
        overlay.textContent = seconds;
        document.body.appendChild(overlay);

        let count = seconds;
        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                overlay.textContent = count;
            } else {
                clearInterval(interval);
                overlay.parentNode?.removeChild(overlay);
                callback?.();
            }
        }, 1000);
    }

    showMessage(text, type) {
        const msg = document.createElement('div');
        Object.assign(msg.style, {
            position: 'fixed', top: '60px', left: '50%',
            transform: 'translateX(-50%)',
            padding: '14px 32px', borderRadius: '6px',
            fontSize: '20px', fontWeight: 'bold',
            zIndex: '9998', fontFamily: 'Arial, sans-serif', color: 'white',
            backgroundColor: type === 'success' ? '#4CAF50' : '#e74c3c',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
        });
        msg.textContent = text;
        document.body.appendChild(msg);
        setTimeout(() => msg.parentNode?.removeChild(msg), 2000);
    }

    // ── Round logic ───────────────────────────────────────────────────────────

    startRound() {
        this.roundRunning      = true;
        this.dodgeWindowOpen   = false;
        this.collisionHappened = false;
        this.showCountdown(3, () => this.fireCannonball());
    }

    fireCannonball() {
        const vh    = window.innerHeight;
        const lanes = [
            Math.round(vh * 0.20),
            Math.round(vh * 0.50),
            Math.round(vh * 0.75)
        ];
        const targetY = lanes[Math.floor(Math.random() * lanes.length)];
        this._showCannonball(window.innerWidth + 20, targetY);
        this.dodgeWindowOpen   = true;
        this.collisionHappened = false;
    }

    _endRound() {
        if (!this.dodgeWindowOpen) return;
        this.dodgeWindowOpen = false;
        this._hideCannonball();

        const player = this.getPlayer();
        if (!player) return;

        if (this.collisionHappened) {
            player.x = 100;
            if (player.position) player.position.x = 100;
            this.showMessage('💥 HIT!  Reset to start.', 'error');
        } else {
            const advance = player.x >= 700 ? 200 : 300;
            player.x += advance;
            if (player.position) player.position.x = player.x;
            this.showMessage(`✅ DODGED!  +${advance} px!`, 'success');
        }

        this.roundRunning = false;
        setTimeout(() => this.startRound(), 2000);
    }

    // ── Game loop ─────────────────────────────────────────────────────────────

    update() {
        if (!this.dodgeWindowOpen) return;

        this.cannonballX -= this.cannonballSpeed;
        if (this.cannonballEl) {
            this.cannonballEl.style.left = this.cannonballX + 'px';
        }

        if (this.cannonballX < -(this.cannonballSize + 20)) {
            this._endRound();
            return;
        }

        if (!this.collisionHappened) {
            const player = this.getPlayer();
            if (player && this._collidesWithPlayer(player)) {
                this.collisionHappened = true;
                this._endRound();
            }
        }
    }

    _collidesWithPlayer(player) {
        const cb = {
            x:  this.cannonballX,
            y:  this.cannonballY,
            x2: this.cannonballX + this.cannonballSize,
            y2: this.cannonballY + this.cannonballSize
        };

        let px, py, pw, ph;
        if (player.canvas) {
            const r = player.canvas.getBoundingClientRect();
            px = r.left; py = r.top; pw = r.width; ph = r.height;
        } else {
            px = player.x ?? 0; py = player.y ?? 0; pw = 50; ph = 50;
        }

        const hbW = player.spriteData?.hitbox?.widthPercentage  ?? 0.4;
        const hbH = player.spriteData?.hitbox?.heightPercentage ?? 0.4;
        const sx  = pw * (1 - hbW) / 2;
        const sy  = ph * (1 - hbH) / 2;
        const pb  = { x: px + sx, y: py + sy, x2: px + pw - sx, y2: py + ph - sy };

        return !(cb.x2 < pb.x || cb.x > pb.x2 || cb.y2 < pb.y || cb.y > pb.y2);
    }
}

export const gameLevelClasses = [GameLevelCannonball];
export { GameControl };
```

</div>
</details>

<div style="width:100%;margin:20px 0;">
  <iframe
    src="https://phantom-deploy.github.io/portfolio/gamify/gategamelv1"
    width="100%"
    height="600"
    style="border:2px solid #4CAF50;border-radius:8px;display:block;"
    title="Level 1 — Cannonball Dodge Challenge"
    allowfullscreen
    loading="lazy">
  </iframe>
  <p style="text-align:center;font-size:13px;color:#888;margin-top:6px;">
    🔗 <a href="https://phantom-deploy.github.io/portfolio/gamify/gategamelv1" target="_blank">Open Level 1 in a new tab</a>
  </p>
</div>

**Key CS111 concepts shown:**
- **Iteration**: Lane array looped to pick a random cannonball path
- **Conditionals**: Hit vs dodge branches reward/punish the player
- **Numbers**: `cannonballX -= cannonballSpeed` moves the ball 20 px per frame
- **Booleans**: `dodgeWindowOpen`, `collisionHappened`, `roundRunning` track round state
- **Mathematical operators**: AABB rectangle overlap uses `<`, `>`, subtraction, and `||`

---

### Level 2 — GameLevelEscaperoom (Maze)

{% capture challenge_er %}
Navigate the slime through the maze using WASD. Barriers block your path — find the route to the master gate NPC. Walk up to it to trigger a collision dialogue, then press ESC to proceed.
{% endcapture %}

{% include runners/game.html
   runner_id="game1"
   challenge=challenge1
   code=code1
   height="150px"
%}

**Key CS111 concepts shown:**
- **Objects (JSON)**: Every barrier is a config object with `x`, `y`, `width`, `height`, and `hitbox`
- **Arrays**: `this.classes` holds 20 entries — 1 background, 1 player, 1 NPC, 17 barriers
- **Strings**: Sprite `src` paths built with `path + "/images/..."` concatenation
- **Numbers**: Barrier dimensions (e.g. `width: 1134`, `height: 50`) set collision boundaries
- **Conditionals**: NPC `reaction` checks `if (this.dialogueSystem)` before showing dialogue

---

### Level 3 — GameLevelZonecatch (Zone Capture)

> **Challenge:** Two colored zones appear on screen. The banner at the top tells you which color is SAFE. Move into the safe zone before the timer bar empties. Stand in the wrong zone or outside both — eliminated. From Round 6 a golden GATE appears: reach it and press E to escape early and win!

<details>
<summary>📄 View Level 3 Source Code</summary>
<div style="max-height:400px;overflow-y:auto;background:#1e1e1e;border-radius:6px;padding:12px;margin-top:8px;">

```javascript
import GameControl from '/assets/js/GameEnginev1/essentials/GameControl.js';
import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Barrier from '/assets/js/GameEnginev1/essentials/Barrier.js';

class ZoneCatchOverlay {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.canvas  = null;
        this.ctx     = null;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.margin   = '0';
        document.body.style.padding  = '0';
        this._reset();
        this._initCanvas();
    }

    _reset() {
        this.round = 0; this.totalRounds = 10;
        this.roundActive = false; this.breakActive = false;
        this.gameOver = false; this.won = false;
        this.introPhase = true; this.countdownPhase = false; this.countdownValue = 3;
        this.baseRoundDuration = 7000; this.baseBreakDuration = 2800; this.roundEndTime = 0;
        this.circles = []; this.gateCircle = null; this.gateVisible = false;
        this.wallThickness = 48;
        this.colorPairs = [
            ['#e63946', '#457b9d'], ['#f4a261', '#2a9d8f'], ['#e9c46a', '#6a0572'],
            ['#ff006e', '#38b000'], ['#fb5607', '#3a86ff'], ['#ffbe0b', '#8338ec'],
        ];
        if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    }

    _initCanvas() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'zonecatch-overlay';
            this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
            if (!document.getElementById('zonecatch-font')) {
                const link = document.createElement('link');
                link.id = 'zonecatch-font'; link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Exo+2:wght@700;900&display=swap';
                document.head.appendChild(link);
            }
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            window.addEventListener('resize', () => this._resize());
        }
        this._resize(); this._stonePattern = null;
        this._bindIntroSkip();
        if (!this._animFrame) { setTimeout(() => { this._resize(); this._loop(); }, 150); }
    }

    _resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this._stonePattern = null;
        const gc = document.querySelector('canvas:not(#zonecatch-overlay)');
        if (gc) {
            const r = gc.getBoundingClientRect();
            this._ox = r.left; this._oy = r.top;
            this._gW = r.width  > 0 ? r.width  : window.innerWidth;
            this._gH = r.height > 0 ? r.height : window.innerHeight;
        } else {
            this._ox = 0; this._oy = 0;
            this._gW = window.innerWidth; this._gH = window.innerHeight;
        }
    }

    _arena() {
        const t = this.wallThickness;
        return { x: (this._ox||0)+t, y: (this._oy||0)+t, w: (this._gW||window.innerWidth)-t*2, h: (this._gH||window.innerHeight)-t*2 };
    }

    _bindIntroSkip() {
        const advance = () => {
            if (!this.introPhase) return;
            this.introPhase = false; this.countdownPhase = true; this.countdownValue = 3;
            this._runCountdown();
            window.removeEventListener('keydown', advance);
            window.removeEventListener('pointerdown', advance);
        };
        window.addEventListener('keydown', advance);
        window.addEventListener('pointerdown', advance);
        this._advanceFn = advance;
    }

    _runCountdown() {
        if (this.countdownValue <= 0) {
            this.countdownPhase = false; this.breakActive = true; this._scheduleNextRound(400); return;
        }
        this._timer = setTimeout(() => { this.countdownValue--; this._runCountdown(); }, 1000);
    }

    _roundDuration() { return Math.max(3800, this.baseRoundDuration - (this.round - 1) * 200); }
    _breakDuration()  { return Math.max(1000, this.baseBreakDuration - this.round * 80); }

    _scheduleNextRound(delay) {
        if (this._timer) clearTimeout(this._timer);
        this._timer = setTimeout(() => this._startRound(), delay);
    }

    _startRound() {
        if (this.gameOver) return;
        this.round++; this.roundActive = true; this.breakActive = false;
        this.roundEndTime = performance.now() + this._roundDuration();
        this._spawnCircles();
        if (this.round >= 6) { this._spawnGate(); this._bindGateKey(); }
        this._timer = setTimeout(() => this._endRound(), this._roundDuration());
    }

    _endRound() {
        if (this.gameOver) return;
        this._checkSurvivalAtRoundEnd();
        if (this.gameOver) return;
        this.roundActive = false; this.breakActive = true;
        this.circles = []; this.gateCircle = null; this.gateVisible = false;
        if (this.round >= this.totalRounds) { this._triggerWin(); return; }
        this._scheduleNextRound(this._breakDuration());
    }

    _spawnCircles() {
        const a = this._arena();
        const pair = this.colorPairs[Math.floor(Math.random() * this.colorPairs.length)];
        const shuffled = Math.random() < 0.5 ? pair : [pair[1], pair[0]];
        const safeIdx = Math.floor(Math.random() * 2);
        const baseR = Math.max(50, 95 - this.round * 3);
        const margin = baseR + 16, halfW = a.w / 2;
        const x0 = a.x + margin + Math.random() * Math.max(1, halfW - margin * 2);
        const y0 = a.y + margin + Math.random() * Math.max(1, a.h - margin * 2 - 60);
        const x1 = a.x + halfW + margin + Math.random() * Math.max(1, halfW - margin * 2);
        const y1 = a.y + margin + Math.random() * Math.max(1, a.h - margin * 2 - 60);
        this.circles = [
            { x: x0, y: y0, r: baseR, color: shuffled[0], safe: safeIdx === 0 },
            { x: x1, y: y1, r: baseR, color: shuffled[1], safe: safeIdx === 1 },
        ];
    }

    _spawnGate() {
        const a = this._arena(); const r = 36, margin = r + 20;
        this.gateCircle = {
            x: a.x + margin + Math.random() * (a.w - margin * 2),
            y: a.y + margin + Math.random() * (a.h - margin * 2 - 60),
            r, alpha: 1, fadeRate: 0.0030 + (this.round - 6) * 0.0006,
        };
        this.gateVisible = true;
    }

    _getPlayerElement() {
        try {
            const gameObjects = this.gameEnv?.gameObjects;
            if (gameObjects) {
                const player = gameObjects.find(o => o && (
                    o.id === 'playerData' || o.spriteData?.id === 'playerData' ||
                    o.data?.id === 'playerData' || (o.keypress && o.element)
                ));
                if (player?.element) return player.element;
                if (player?.canvas)  return player.canvas;
            }
            const slime = document.querySelector('img[src*="slime"], canvas[data-id="playerData"]');
            if (slime) return slime;
        } catch (_) {}
        return null;
    }

    _getPlayerCenter() {
        const el = this._getPlayerElement();
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return null;
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    _hexToRgb(hex) {
        const m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : null;
    }

    _dist(ax, ay, bx, by) { return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2); }
    _inCircle(p, c)        { return this._dist(p.x, p.y, c.x, c.y) < c.r; }

    _bindGateKey() {
        if (this._gateKeyBound) return;
        this._gateKeyBound = true;
        this._gateKeyHandler = (e) => {
            if (e.key !== 'e' && e.key !== 'E') return;
            if (!this.roundActive || !this.gateVisible || !this.gateCircle) return;
            const p = this._getPlayerCenter();
            if (!p) return;
            if (this._dist(p.x, p.y, this.gateCircle.x, this.gateCircle.y) < this.gateCircle.r * 1.5) {
                this._triggerWin();
            }
        };
        window.addEventListener('keydown', this._gateKeyHandler);
    }

    _unbindGateKey() {
        if (this._gateKeyHandler) { window.removeEventListener('keydown', this._gateKeyHandler); this._gateKeyHandler = null; }
        this._gateKeyBound = false;
    }

    _checkCollisions() { /* gate key handled by listener */ }

    _checkSurvivalAtRoundEnd() {
        const el = this._getPlayerElement();
        if (!el) { this._triggerDeath(); return; }
        const rect = el.getBoundingClientRect();
        const cx = Math.round(rect.left + rect.width  / 2);
        const cy = Math.round(rect.top  + rect.height / 2);
        const safe   = this.circles.find(c =>  c.safe);
        const danger = this.circles.find(c => !c.safe);
        if (!safe) return;
        const safeRGB   = this._hexToRgb(safe.color);
        const dangerRGB = danger ? this._hexToRgb(danger.color) : null;
        if (!safeRGB) return;
        const samplePoints = [[0,0],[-10,0],[10,0],[0,-10],[0,10],[-6,-6],[6,-6],[-6,6],[6,6]];
        let bestSafeDist = Infinity, bestDangerDist = Infinity, hasOpaquePixel = false;
        for (const [dx, dy] of samplePoints) {
            try {
                const pixel = this.ctx.getImageData(cx + dx, cy + dy, 1, 1).data;
                if (pixel[3] < 30) continue;
                hasOpaquePixel = true;
                const sd = Math.sqrt((pixel[0]-safeRGB.r)**2+(pixel[1]-safeRGB.g)**2+(pixel[2]-safeRGB.b)**2);
                if (sd < bestSafeDist) bestSafeDist = sd;
                if (dangerRGB) {
                    const dd = Math.sqrt((pixel[0]-dangerRGB.r)**2+(pixel[1]-dangerRGB.g)**2+(pixel[2]-dangerRGB.b)**2);
                    if (dd < bestDangerDist) bestDangerDist = dd;
                }
            } catch (_) {}
        }
        if (!hasOpaquePixel || bestSafeDist > 80 || bestSafeDist >= bestDangerDist) this._triggerDeath();
    }

    _triggerDeath() {
        if (this.gameOver) return;
        this.gameOver = true; this.roundActive = false; this._unbindGateKey();
        if (this._timer) { clearTimeout(this._timer); this._timer = null; }
        this.circles = []; this.gateCircle = null; this.gateVisible = false;
    }

    _triggerWin() {
        if (this.gameOver) return;
        this.gameOver = true; this.won = true; this.roundActive = false; this._unbindGateKey();
        if (this._timer) { clearTimeout(this._timer); this._timer = null; }
        this.circles = []; this.gateCircle = null; this.gateVisible = false;
    }

    _softRestart() {
        if (this._timer) clearTimeout(this._timer);
        this._timer = null; this._reset(); this._bindIntroSkip();
    }

    _listenForRestart() {
        if (this._restartListening) return;
        this._restartListening = true;
        const restart = () => {
            this._restartListening = false; this._softRestart();
            window.removeEventListener('keydown', restart);
            window.removeEventListener('pointerdown', restart);
        };
        setTimeout(() => {
            window.addEventListener('keydown', restart);
            window.addEventListener('pointerdown', restart);
        }, 800);
    }

    _loop() {
        this._animFrame = requestAnimationFrame(() => this._loop());
        this._resize(); this._update(); this._draw();
    }

    _update() {
        if (this.gateVisible && this.gateCircle) {
            this.gateCircle.alpha -= this.gateCircle.fadeRate;
            if (this.gateCircle.alpha <= 0) { this.gateCircle.alpha = 0; this.gateVisible = false; }
        }
        if (!this.gameOver && !this.introPhase && !this.countdownPhase) this._checkCollisions();
    }

    _draw() {
        const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
        ctx.clearRect(0, 0, W, H);
        const ox = this._ox||0, oy = this._oy||0, gW = this._gW||W, gH = this._gH||H;
        if (this.introPhase)     { this._drawIntroScreen(ctx, W, H);     return; }
        if (this.countdownPhase) { this._drawCountdownScreen(ctx, W, H); return; }
        if (this.gameOver) { this.won ? this._drawWinScreen(ctx,W,H) : this._drawDeathScreen(ctx,W,H); return; }
        this._drawStoneWalls(ctx, ox, oy, gW, gH);
        if (this.roundActive) {
            this._drawSpotlights(ctx);
            this._drawSafetyBanner(ctx, ox, oy, gW);
            this._drawRoundTimer(ctx, ox, oy, gW);
            if (this.gateVisible && this.gateCircle) this._drawGate(ctx);
            this._drawPlayerDot(ctx);
        } else if (this.breakActive) {
            this._drawBreakBanner(ctx, ox, oy, gW, gH);
        }
        this._drawRoundCounter(ctx, ox, oy, gW);
    }

    _drawIntroScreen(ctx, W, H) {
        ctx.fillStyle = 'rgba(5,5,20,0.78)'; ctx.fillRect(0,0,W,H);
        const bw=560,bh=360,bx=(W-bw)/2,by=(H-bh)/2;
        ctx.save(); ctx.shadowColor='rgba(100,180,255,0.4)'; ctx.shadowBlur=30;
        const g=ctx.createLinearGradient(bx,by,bx+bw,by+bh);
        g.addColorStop(0,'#0d1b2a'); g.addColorStop(1,'#1b2838');
        ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,18); ctx.fill();
        ctx.strokeStyle='rgba(100,180,255,0.55)'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,18); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.font="900 42px 'Exo 2',sans-serif"; ctx.fillStyle='#ffe066';
        ctx.fillText('ZONE CATCH',W/2,by+52);
        ctx.font="bold 15px 'Exo 2',sans-serif"; ctx.fillStyle='rgba(200,230,255,0.7)';
        ctx.fillText('Survive all 10 rounds to escape',W/2,by+88);
        const rules=['🎯  Two coloured zones appear each round','📢  The banner tells you which colour is SAFE','🏃  Move into the safe zone before time runs out','⚠️   Standing outside it when time ends = eliminated','🚪  From Round 6 a golden GATE appears — reach it to win early'];
        ctx.textAlign='left'; ctx.font="bold 14px 'Exo 2',sans-serif";
        rules.forEach((rule,i)=>{ ctx.fillStyle=i%2===0?'#c8e6ff':'#a0d4f5'; ctx.fillText(rule,bx+36,by+134+i*34); });
        ctx.textAlign='center'; ctx.font="bold 13px 'Exo 2',sans-serif"; ctx.fillStyle='rgba(180,200,220,0.6)';
        ctx.fillText('Move with  W A S D',W/2,by+318);
        const pulse=0.6+0.4*Math.sin(Date.now()/500);
        ctx.globalAlpha=pulse; ctx.font="900 16px 'Exo 2',sans-serif"; ctx.fillStyle='#ffe066';
        ctx.fillText('PRESS ANY KEY OR CLICK TO BEGIN',W/2,by+348); ctx.restore();
    }

    _drawCountdownScreen(ctx,W,H) {
        ctx.fillStyle='rgba(5,5,20,0.55)'; ctx.fillRect(0,0,W,H);
        ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';
        const label=this.countdownValue>0?String(this.countdownValue):'GO!';
        const color=this.countdownValue>0?'#ffe066':'#74c69d';
        const size=this.countdownValue>0?140:110;
        ctx.font='900 '+size+"px 'Exo 2',sans-serif";
        ctx.shadowColor=color; ctx.shadowBlur=40; ctx.fillStyle=color;
        ctx.fillText(label,W/2,H/2); ctx.restore();
    }

    _drawStoneWalls(ctx,ox,oy,gW,gH) {
        const t=this.wallThickness;
        if(!this._stonePattern) this._stonePattern=this._makeStonePattern(ctx);
        ctx.save(); ctx.fillStyle=this._stonePattern||'#606060';
        ctx.fillRect(ox,oy,gW,t); ctx.fillRect(ox,oy+gH-t,gW,t);
        ctx.fillRect(ox,oy+t,t,gH-t*2); ctx.fillRect(ox+gW-t,oy+t,t,gH-t*2);
        this._drawBrickLines(ctx,ox,oy,gW,gH,t); ctx.restore();
    }

    _makeStonePattern(ctx) {
        const sz=16,pc=document.createElement('canvas'); pc.width=sz; pc.height=sz;
        const px=pc.getContext('2d');
        const g=px.createLinearGradient(0,0,sz,sz);
        g.addColorStop(0,'#787878'); g.addColorStop(0.4,'#606060'); g.addColorStop(1,'#505050');
        px.fillStyle=g; px.fillRect(0,0,sz,sz);
        for(let i=0;i<20;i++){
            px.beginPath(); px.arc(Math.random()*sz,Math.random()*sz,1+Math.random()*2.5,0,Math.PI*2);
            const v=Math.random()>0.5?200:30; px.fillStyle='rgba('+v+','+v+','+v+','+(0.08+Math.random()*0.13)+')'; px.fill();
        }
        return ctx.createPattern(pc,'repeat');
    }

    _drawBrickLines(ctx,ox,oy,gW,gH,t) {
        const bW=34,bH=22; ctx.strokeStyle='rgba(25,25,25,0.55)'; ctx.lineWidth=1.5;
        const bricks=(rx,ry,rw,rh)=>{
            ctx.save(); ctx.beginPath(); ctx.rect(rx,ry,rw,rh); ctx.clip();
            for(let row=0;row*bH<rh+bH;row++){
                const y=ry+row*bH,off=(row%2===0)?0:bW/2;
                ctx.beginPath(); ctx.moveTo(rx,y); ctx.lineTo(rx+rw,y); ctx.stroke();
                for(let col=-1;col*bW<rw+bW;col++){
                    const x=rx+off+col*bW; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+bH); ctx.stroke();
                }
            }
            ctx.restore();
        };
        bricks(ox,oy,gW,t); bricks(ox,oy+gH-t,gW,t);
        bricks(ox,oy+t,t,gH-t*2); bricks(ox+gW-t,oy+t,t,gH-t*2);
    }

    _drawSpotlights(ctx) {
        for(const c of this.circles){
            const grad=ctx.createRadialGradient(c.x,c.y-c.r*0.15,c.r*0.05,c.x,c.y,c.r);
            grad.addColorStop(0,c.color+'cc'); grad.addColorStop(0.55,c.color+'88'); grad.addColorStop(1,c.color+'18');
            ctx.save(); ctx.beginPath(); ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
            ctx.fillStyle=grad; ctx.fill();
            ctx.beginPath(); ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
            ctx.strokeStyle=c.color+'bb'; ctx.lineWidth=3; ctx.stroke(); ctx.restore();
        }
    }

    _drawSafetyBanner(ctx,ox,oy,gW) {
        const safe=this.circles.find(c=>c.safe); if(!safe) return;
        const t=this.wallThickness,bw=260,bh=46,bx=ox+(gW-bw)/2,by=oy+t+8;
        ctx.save(); ctx.shadowColor='rgba(0,0,0,0.35)'; ctx.shadowBlur=12;
        ctx.fillStyle='rgba(255,255,255,0.93)'; ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,10); ctx.fill(); ctx.restore();
        ctx.save(); ctx.fillStyle=safe.color; ctx.globalAlpha=0.92;
        ctx.beginPath(); ctx.roundRect(bx+12,by+10,26,26,5); ctx.fill(); ctx.restore();
        ctx.save(); ctx.fillStyle='#1a1a2e'; ctx.font="bold 15px 'Exo 2',sans-serif";
        ctx.textAlign='left'; ctx.textBaseline='middle'; ctx.fillText('STAY IN:',bx+48,by+bh/2); ctx.restore();
        ctx.save(); ctx.fillStyle=safe.color; ctx.font="900 15px 'Exo 2',sans-serif";
        ctx.textAlign='left'; ctx.textBaseline='middle'; ctx.fillText(safe.color.toUpperCase(),bx+122,by+bh/2); ctx.restore();
    }

    _drawRoundTimer(ctx,ox,oy,gW) {
        const now=performance.now(),remaining=Math.max(0,this.roundEndTime-now),total=this._roundDuration();
        const frac=remaining/total,secs=Math.ceil(remaining/1000);
        const t=this.wallThickness,bx=ox+t+8,by=oy+t+64,bw=Math.min(240,gW/3),bh=14;
        ctx.save(); ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,7); ctx.fill();
        const r=frac<0.5?Math.round(255*(1-frac*2)):255,g=frac>0.5?Math.round(255*((frac-0.5)*2)):255;
        ctx.fillStyle='rgb('+r+','+g+',0)'; ctx.beginPath(); ctx.roundRect(bx,by,bw*frac,bh,7); ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1; ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,7); ctx.stroke();
        ctx.font="bold 12px 'Exo 2',sans-serif"; ctx.fillStyle='rgba(255,255,255,0.85)';
        ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillText(secs+'s',bx+bw+7,by+1); ctx.restore();
    }

    _drawGate(ctx) {
        const g=this.gateCircle,r=g.r,a=g.alpha;
        ctx.save(); ctx.globalAlpha=a;
        const grad=ctx.createRadialGradient(g.x,g.y-r*0.1,r*0.05,g.x,g.y,r);
        grad.addColorStop(0,'rgba(255,230,80,0.85)'); grad.addColorStop(0.5,'rgba(255,200,30,0.55)'); grad.addColorStop(1,'rgba(255,180,0,0.10)');
        ctx.beginPath(); ctx.arc(g.x,g.y,r,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();
        ctx.beginPath(); ctx.arc(g.x,g.y,r*0.65,Math.PI,0,false);
        ctx.strokeStyle='#ffe066'; ctx.lineWidth=4; ctx.stroke();
        const pW=r*0.12,pH=r*0.6; ctx.fillStyle='#ffe066';
        ctx.fillRect(g.x-r*0.65,g.y,pW,pH); ctx.fillRect(g.x+r*0.65-pW,g.y,pW,pH);
        ctx.beginPath(); ctx.arc(g.x+r*0.65-pW*0.5-r*0.09*1.8,g.y+pH*0.38,r*0.09,0,Math.PI*2);
        ctx.fillStyle='#fff176'; ctx.fill();
        ctx.beginPath(); ctx.arc(g.x,g.y,r,0,Math.PI*2);
        ctx.strokeStyle='rgba(255,220,50,'+(a*0.9)+')'; ctx.lineWidth=3; ctx.stroke();
        ctx.font='bold '+Math.max(9,Math.floor(r*0.24))+"px 'Exo 2',sans-serif";
        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#fff'; ctx.fillText('GATE',g.x,g.y+r*0.88);
        ctx.restore();
        const p=this._getPlayerCenter();
        if(p&&this._dist(p.x,p.y,g.x,g.y)<r*1.5){
            const pulse=0.7+0.3*Math.sin(Date.now()/250);
            ctx.save(); ctx.globalAlpha=a*pulse; ctx.font="900 14px 'Exo 2',sans-serif";
            ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#ffe066';
            ctx.beginPath(); ctx.roundRect(g.x-26,g.y-r-28,52,24,6); ctx.fill();
            ctx.fillStyle='#1a1a2e'; ctx.fillText('Press  E',g.x,g.y-r-16); ctx.restore();
        }
    }

    _drawBreakBanner(ctx,ox,oy,gW,gH) {
        const bw=320,bh=70,bx=ox+(gW-bw)/2,by=oy+(gH-bh)/2-30;
        ctx.save(); ctx.fillStyle='rgba(10,10,30,0.55)';
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,14); ctx.fill();
        ctx.font="900 28px 'Exo 2',sans-serif"; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillStyle='#ffe066'; ctx.fillText('GET READY — ROUND '+(this.round+1),ox+gW/2,by+bh/2); ctx.restore();
    }

    _drawRoundCounter(ctx,ox,oy,gW) {
        const t=this.wallThickness;
        ctx.save(); ctx.font="bold 14px 'Exo 2',sans-serif";
        ctx.textAlign='right'; ctx.textBaseline='top'; ctx.fillStyle='rgba(255,255,255,0.80)';
        ctx.fillText('ROUND '+this.round+' / '+this.totalRounds,ox+gW-t-8,oy+t+4); ctx.restore();
    }

    _drawPlayerDot(ctx) {
        const p=this._getPlayerCenter(); if(!p) return;
        ctx.save(); ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fill();
        ctx.strokeStyle='#ff0'; ctx.lineWidth=2; ctx.stroke(); ctx.restore();
    }

    _drawWinScreen(ctx,W,H) {
        ctx.fillStyle='rgba(5,5,20,0.88)'; ctx.fillRect(0,0,W,H);
        const ts=Date.now()/1000,pulse=0.85+0.15*Math.sin(ts*2.5);
        const bw=520,bh=220,bx=(W-bw)/2,by=(H-bh)/2;
        ctx.save(); ctx.shadowColor='rgba(80,220,120,'+pulse+')'; ctx.shadowBlur=40*pulse;
        const g=ctx.createLinearGradient(bx,by,bx+bw,by+bh);
        g.addColorStop(0,'#1a472a'); g.addColorStop(0.5,'#2d6a4f'); g.addColorStop(1,'#1b4332');
        ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,20); ctx.fill();
        ctx.strokeStyle='rgba(80,220,120,'+(pulse*0.9)+')'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,20); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.font="900 54px 'Exo 2',sans-serif"; ctx.fillStyle='#74c69d'; ctx.fillText('YOU ESCAPED!',W/2,by+62);
        ctx.font="bold 22px 'Exo 2',sans-serif"; ctx.fillStyle='#b7e4c7'; ctx.fillText('You made it to the city!',W/2,by+106);
        ctx.font="bold 16px 'Exo 2',sans-serif"; ctx.fillStyle='rgba(183,228,199,0.7)';
        ctx.fillText('Escaped through the gate on Round '+this.round,W/2,by+138);
        ctx.globalAlpha=0.6+0.4*Math.sin(Date.now()/500); ctx.font="bold 16px 'Exo 2',sans-serif";
        ctx.fillStyle='#ffe066'; ctx.fillText('Press any key or click to play again',W/2,by+178); ctx.restore();
        this._listenForRestart();
    }

    _drawDeathScreen(ctx,W,H) {
        ctx.fillStyle='rgba(20,0,0,0.88)'; ctx.fillRect(0,0,W,H);
        const ts=Date.now()/1000,pulse=0.8+0.2*Math.sin(ts*3);
        const bw=520,bh=220,bx=(W-bw)/2,by=(H-bh)/2;
        ctx.save(); ctx.shadowColor='rgba(220,30,30,'+pulse+')'; ctx.shadowBlur=36*pulse;
        const g=ctx.createLinearGradient(bx,by,bx+bw,by+bh);
        g.addColorStop(0,'#3d0000'); g.addColorStop(0.5,'#6b1010'); g.addColorStop(1,'#3d0000');
        ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,20); ctx.fill();
        ctx.strokeStyle='rgba(220,30,30,'+(pulse*0.9)+')'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,20); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.font="900 54px 'Exo 2',sans-serif"; ctx.fillStyle='#e63946'; ctx.fillText('ELIMINATED',W/2,by+72);
        ctx.font="bold 20px 'Exo 2',sans-serif"; ctx.fillStyle='#f4a0a0';
        ctx.fillText('Outside the safe zone — Round '+this.round,W/2,by+122);
        ctx.globalAlpha=0.6+0.4*Math.sin(Date.now()/500); ctx.font="bold 16px 'Exo 2',sans-serif";
        ctx.fillStyle='#ffe066'; ctx.fillText('Press any key or click to try again',W/2,by+178); ctx.restore();
        this._listenForRestart();
    }

    destroy() {
        if(this._timer) clearTimeout(this._timer);
        if(this._animFrame) cancelAnimationFrame(this._animFrame);
        this._animFrame = null; this._unbindGateKey();
        if(this.canvas&&this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
        document.documentElement.style.overflow='';
        document.body.style.overflow=''; document.body.style.margin=''; document.body.style.padding='';
    }
}

class GameLevelZonecatch {
    constructor(gameEnv) {
        const path = gameEnv.path, width = gameEnv.innerWidth, height = gameEnv.innerHeight;

        const bgData = {
            name: "custom_bg",
            src:  path + "/images/gamebuilder/bg/SciFiConsole.png",
            pixels: { height: 772, width: 1134 }
        };

        const playerData = {
            id: 'playerData',
            src: path + "/images/gamebuilder/sprites/slime.png",
            SCALE_FACTOR: 8, STEP_FACTOR: 1200, ANIMATION_RATE: 50,
            INIT_POSITION: { x: 80, y: 247 },
            pixels: { height: 225, width: 225 },
            orientation: { rows: 4, columns: 4 },
            down:      { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate:  Math.PI/16 },
            downLeft:  { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left:      { row: 2, start: 0, columns: 3 },
            right:     { row: 1, start: 0, columns: 3 },
            up:        { row: 3, start: 0, columns: 3 },
            upLeft:    { row: 2, start: 0, columns: 3, rotate:  Math.PI/16 },
            upRight:   { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        const t = 48;
        const makeWall = (name, x, y, w, h) => ({
            name, src: path + "/images/gamebuilder/bg/SciFiConsole.png",
            SCALE_FACTOR: 1, pixels: { height: 1, width: 1 },
            INIT_POSITION: { x, y }, width: w, height: h, isBarrier: true
        });

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player,            data: playerData },
            { class: Barrier, data: makeWall('wallTop',    0,       0,        width,  t) },
            { class: Barrier, data: makeWall('wallBottom', 0,       height-t, width,  t) },
            { class: Barrier, data: makeWall('wallLeft',   0,       t,        t,      height-t*2) },
            { class: Barrier, data: makeWall('wallRight',  width-t, t,        t,      height-t*2) },
        ];

        setTimeout(() => {
            if (gameEnv._zoneCatchOverlay) gameEnv._zoneCatchOverlay.destroy();
            gameEnv._zoneCatchOverlay = new ZoneCatchOverlay(gameEnv);
        }, 300);
    }
}

export const gameLevelClasses = [GameLevelZonecatch];
export { GameControl };
```

{% include runners/game.html
   runner_id="game2"
   challenge=challenge2
   code=code2
%}

## Best Practices

### Import Structure

Always import necessary GameEngine modules:

```javascript
import GameControl from '/assets/js/GameEnginev1/essentials/GameControl.js';
import GameLevelCannonball from '/assets/js/GameEnginev1/GameLevelCannonball.js';
```

### Export Requirements

Your code must export:

```javascript
export { GameControl };
export const gameLevelClasses = [GameLevelCannonball, GameLevelEscaperoom, GameLevelZonecatch];
```

### Level Class Structure

Each level class needs a constructor that defines:

- Background data
- Player/character data
- NPC data
- Barrier/wall data
- The `this.classes` array with all game objects

### Game Controls

- **WASD**: Move the player
- **W / S only**: Dodge in the cannonball level (left/right locked)
- **E**: Interact with gate NPCs
- **Esc**: Advance to the next level

### Debugging

Use the game controls to debug:

- **Pause**: Stop to examine game state
- **Stop**: Clear and restart fresh
- **Reset**: Restore original code
- **Console**: Check browser console (F12) for errors
- **Elements tab**: Inspect canvas position and ZoneCatch overlay alignment

---

## Teaching Tips

### Progressive Learning Path

1. **Run Level 1 (Cannonball)**: Observe boolean state flags controlling round flow
2. **Inspect Level 2 (Escaperoom)**: Read the `this.classes` array and count objects
3. **Modify Level 2**: Change a barrier's `x`/`y` to reshape the maze
4. **Run Level 3 (ZoneCatch)**: Watch the color check logic in the console
5. **Add a Level**: Create a new level class and append it to `gameLevelClasses`

### Common Modifications

**Change player start position:**
```javascript
INIT_POSITION: { x: 200, y: 300 }
```

**Adjust cannonball speed:**
```javascript
this.cannonballSpeed = 30;   // faster = harder
```

**Change ZoneCatch round count:**
```javascript
this.totalRounds = 5;        // fewer rounds = shorter game
```

### Game Development Concepts

This game teaches:

- **Object-Oriented Programming**: Level classes, config objects, composition
- **Game Loop**: `update()` called every frame, `initialize()` / `destroy()` lifecycle
- **Sprite Animation**: Row/column frame-based sprite sheets
- **Collision Detection**: AABB rectangles (cannonball), pixel-color sampling (ZoneCatch), hitbox percentages (escaperoom)
- **Event Handling**: `keydown` listeners registered and cleaned up per level
- **State Management**: Boolean flags, round counters, game-over conditions

### Troubleshooting

**Game won't start:**
- Check console for import errors
- Verify all import paths start with `/assets/`
- Ensure exports are correct

**Cannonball not appearing:**
- Check that `initialize()` is being called by the engine
- Verify the image path for `Cannonball.png` exists in your repo

**ZoneCatch overlay not showing:**
- Confirm `ZoneCatchOverlay` is constructed inside the `GameLevelZonecatch` constructor
- Check that `setTimeout(..., 300)` has enough delay for the engine canvas to mount

**Player not moving in escaperoom:**
- Verify `keypress` config matches WASD key codes (`87, 65, 83, 68`)
- Check that no barrier is blocking the spawn position