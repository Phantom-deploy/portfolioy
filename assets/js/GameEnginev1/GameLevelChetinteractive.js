// Adventure Game Custom Level
// Exported from GameBuilder on 2026-03-10

import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';

class GameLevelChetinteractive {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        // ---------------- AURA SCORE SYSTEM ----------------

        if (!window.auraScore) {
            window.auraScore = 0;

            const auraDisplay = document.createElement("div");
            auraDisplay.id = "auraScore";
            auraDisplay.innerText = "Aura: 0";

            auraDisplay.style.position = "fixed";
            auraDisplay.style.bottom = "20px";
            auraDisplay.style.left = "50%";
            auraDisplay.style.transform = "translateX(-50%)";
            auraDisplay.style.background = "rgba(0,0,0,0.75)";
            auraDisplay.style.color = "white";
            auraDisplay.style.padding = "12px 25px";
            auraDisplay.style.fontSize = "26px";
            auraDisplay.style.fontFamily = "monospace";
            auraDisplay.style.borderRadius = "10px";
            auraDisplay.style.zIndex = "9999";
            auraDisplay.style.pointerEvents = "none";

            document.body.appendChild(auraDisplay);
        }

        function updateAura() {
            window.auraScore += 5;
            const auraDisplay = document.getElementById("auraScore");
            if (auraDisplay) {
                auraDisplay.innerText = "Aura: " + window.auraScore;
            }
        }

        // ---------------------------------------------------

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
            INIT_POSITION: { x: 25, y: 600 },
            pixels: { height: 225, width: 225 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 2, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        const npcData1 = {
            id: 'chill guy',
            greeting: 'Aura Updated',
            src: path + "/images/gamify/chillguy.png",
            SCALE_FACTOR: 4,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 232, y: 215 },
            pixels: { height: 512, width: 384 },
            orientation: { rows: 4, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            downRight: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            upLeft: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },

            dialogues: ['Aura Updated'],

            reaction: function() {
                if (this.dialogueSystem) {
                    this.showReactionDialogue();
                } else {
                    console.log(this.greeting);
                }
            },

            interact: function() {
                if (this.dialogueSystem) {
                    this.showRandomDialogue();
                }
                updateAura(); // +5 aura every interaction
            }
        };

        const dbarrier_1 = {
            id: 'dbarrier_1',
            x: 170,
            y: 83,
            width: 250,
            height: 46,
            visible: true,
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

export default GameLevelChetinteractive;