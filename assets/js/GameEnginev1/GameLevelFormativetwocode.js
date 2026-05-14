import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';

class GameLevelKashcustom {
    constructor(gameEnv) {
        const path = gameEnv.path;
        
        // --- UI Setup ---
        // Create the HTML element for Nonchalance
        this.nonchalance = 0;
        this.uiElement = document.createElement('div');
        this.uiElement.id = 'nonchalance-ui';
        // Styling the element to sit at the bottom
        Object.assign(this.uiElement.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            borderRadius: '10px',
            fontSize: '24px',
            zIndex: '1000',
            border: '2px solid #666'
        });
        this.uiElement.innerHTML = `Nonchalance: <span id="nonchalance-value">0</span>`;
        document.body.appendChild(this.uiElement);

        // Helper function to update the UI
        const updateNonchalance = () => {
            this.nonchalance += 10;
            const valueSpan = document.getElementById('nonchalance-value');
            if (valueSpan) valueSpan.innerText = this.nonchalance;
        };

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
            INIT_POSITION: { x: 100, y: 300 },
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
            id: 'chillguy2',
            greeting: 'Nonchalantness updated',
            src: path + "/images/gamify/chillguy.png",
            SCALE_FACTOR: 1,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 276, y: 140 },
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
            dialogues: ['Nonchalantness updated'],
            // Updated interact function to trigger the counter
            interact: function() { 
                updateNonchalance(); // Increment by 10
                if (this.dialogueSystem) { 
                    this.showRandomDialogue(); 
                } 
            }
        };

        const dbarrier_1 = {
            id: 'dbarrier_1', x: 91, y: 44, width: 245, height: 35, visible: false,
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

export default GameLevelKashcustom;