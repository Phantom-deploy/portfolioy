---
layout: post
codemirror: true
title: My Game Levels
permalink: /game-engine/gameblog
---


## CANNONBALL

<div style="background: rgba(255,255,255,0.05); border-left: 4px solid #4CAF50;
     border-radius: 6px; padding: 14px 18px; margin-bottom: 12px;
     color: #e0e0e0; font-size: 15px; line-height: 1.7;">
  <strong>💣 CANNONBALL</strong> — You're a slime that can only move <strong>up and down</strong>.
  Cannonballs fire from the right across three lanes — dodge them using <strong>W / S</strong>.
  Dodge successfully and you advance forward; get hit and you reset to the start.
  Reach the gate and press <strong>E</strong>, then <strong>Esc</strong> to go to the next level.
</div>

{% capture code1 %}
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
{% endcapture %}




---


## Level 2

<div style="background: rgba(255,255,255,0.05); border-left: 4px solid #3b9ddd;
     border-radius: 6px; padding: 14px 18px; margin-bottom: 12px;
     color: #e0e0e0; font-size: 15px; line-height: 1.7;">
  <strong>☁️ Score Attack in the Clouds!</strong> — This level takes place high in the sky against a cloudy backdrop.
  Move your slime with <strong>W / A / S / D</strong>. A <strong>live score counter</strong> is shown at the bottom of the screen —
  every time you interact with R2-D2, your score goes up by 1. Two barriers shape the environment.
  See how high you can get your score before moving on!
</div>

{% capture code2 %}
import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';
import Barrier from '/assets/js/GameEnginev1/essentials/Barrier.js';

class GameLevelAryaninteractive {
    constructor(gameEnv) {
        const path = gameEnv.path;

        // SCORE
        this.score = 0;

        // Create score display (bottom middle)
        this.scoreElement = document.createElement("div");
        this.scoreElement.innerText = "Score: 0";

        this.scoreElement.style.position = "absolute";
        this.scoreElement.style.bottom = "15px";
        this.scoreElement.style.left = "50%";
        this.scoreElement.style.transform = "translateX(-50%)";
        this.scoreElement.style.background = "rgba(0,0,0,0.7)";
        this.scoreElement.style.color = "white";
        this.scoreElement.style.padding = "10px 20px";
        this.scoreElement.style.fontSize = "20px";
        this.scoreElement.style.fontWeight = "bold";
        this.scoreElement.style.borderRadius = "10px";
        this.scoreElement.style.zIndex = "999";

        document.body.appendChild(this.scoreElement);

        const bgData = {
            name: "custom_bg",
            src: path + "/images/gamebuilder/bg/clouds.jpg",
            pixels: { height: 720, width: 1280 }
        };

        const playerData = {
            id: 'playerData',
            src: path + "/images/gamebuilder/sprites/slime.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 24, y: 550 },
            pixels: { height: 225, width: 225 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 2, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        const npcData1 = {
            id: 'r2d2',
            greeting: 'Score Updated',
            src: path + "/images/gamify/r2_idle.png",
            SCALE_FACTOR: 4,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 392, y: 122 },
            pixels: { height: 223, width: 505 },
            orientation: { rows: 1, columns: 3 },

            down: { row: 0, start: 0, columns: 3 },
            right: { row: 0, start: 0, columns: 3 },
            left: { row: 0, start: 0, columns: 3 },
            up: { row: 0, start: 0, columns: 3 },

            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },

            dialogues: ['Score Updated'],

            reaction: function() {
                if (this.dialogueSystem) {
                    this.showReactionDialogue();
                }
            },

            interact: () => {

                // Increase score
                this.score += 1;

                // Update score display
                this.scoreElement.innerText = "Score: " + this.score;
            }
        };

        const dbarrier_1 = {
            id: 'dbarrier_1',
            x: 389,
            y: 72,
            width: 7,
            height: 275,
            visible: false,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_2 = {
            id: 'dbarrier_2',
            x: 5,
            y: 210,
            width: 249,
            height: 5,
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
            { class: Npc, data: npcData1 },
            { class: Barrier, data: dbarrier_1 },
            { class: Barrier, data: dbarrier_2 }
        ];
    }
}

export const gameLevelClasses = [GameLevelAryaninteractive];
{% endcapture %}




---


## Level 3

<div style="background: rgba(255,255,255,0.05); border-left: 4px solid #e67e22;
     border-radius: 6px; padding: 14px 18px; margin-bottom: 12px;
     color: #e0e0e0; font-size: 15px; line-height: 1.7;">
  <strong>👽 Back on the Alien Planet — with a surprise guest!</strong> — The slime returns to the alien planet,
  but R2-D2 is gone. In his place is <strong>Elon Musk</strong>, who has something to say for himself.
  Navigate around the barrier with <strong>W / A / S / D</strong> and walk up to Elon to hear his dialogue.
  A fitting finale for the adventure!
</div>

{% capture code3 %}
import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';
import Barrier from '/assets/js/GameEnginev1/essentials/Barrier.js';

class GameLevelAryancustom {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        const bgData = {
            name: "custom_bg",
            src: path + "/images/gamebuilder/bg/alien_planet.jpg",
            pixels: { height: 772, width: 1134 }
        };

        const playerData = {
            id: 'playerData',
            src: path + "/images/gamebuilder/sprites/slime.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 64, y: 600 },
            pixels: { height: 225, width: 225 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 2, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
            };

        const npcData1 = {
            id: 'elon',
            greeting: 'I have so much money ha ha ha',
            src: path + "/images/gamify/elon.jpg",
            SCALE_FACTOR: 3,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 314, y: 168 },
            pixels: { height: 223, width: 505 },
            orientation: { rows: 1, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: Math.min(1, 1 - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, 1 - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, 1 - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(3, 1 - 1), start: 0, columns: 3 },
            downRight: { row: Math.min(1, 1 - 1), start: 0, columns: 3 },
            upLeft: { row: Math.min(2, 1 - 1), start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['I have so much money ha ha ha'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };
        const dbarrier_1 = {
            id: 'dbarrier_1', x: 202, y: 87, width: 12, height: 105, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };
        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
            { class: Npc, data: npcData1 },
            { class: Barrier, data: dbarrier_1 }
        ];
    }
}

export const gameLevelClasses = [GameLevelAryancustom];
{% endcapture %}


