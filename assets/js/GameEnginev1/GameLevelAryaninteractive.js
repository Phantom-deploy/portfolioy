import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';

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

export default GameLevelAryaninteractive;