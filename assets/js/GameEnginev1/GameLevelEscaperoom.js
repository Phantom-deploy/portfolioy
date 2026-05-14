// Adventure Game Custom Level
// Exported from GameBuilder on 2026-03-17T15:05:33.106Z
// How to use this file:
// 1) Save as assets/js/adventureGame/GameLevelEscaperoom.js in your repo.
// 2) Reference it in your runner or level selector. Examples:
//    import GameLevelPlanets from '/assets/js/GameEnginev1/GameLevelPlanets.js';
//    import GameLevelEscaperoom from '/assets/js/adventureGame/GameLevelEscaperoom.js';
//    export const gameLevelClasses = [GameLevelPlanets, GameLevelEscaperoom];
//    // or pass it directly to your GameControl as the only level.
// 3) Ensure images exist and paths resolve via 'path' provided by the engine.
// 4) You can add more objects to this.classes inside the constructor.


import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';


class GameLevelEscaperoom {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;


        const bgData = {
            name: "custom_bg",
            src: path + "/images/gamebuilder/bg/Slab.png",
            pixels: { height: 772, width: 1134 }
        };


        const playerData = {
            id: 'playerData',
            src: path + "/images/gamebuilder/sprites/slime.png",
            SCALE_FACTOR: 15,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 60, y: 247 },
            pixels: { height: 225, width: 225 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
            };


        const npcData1 = {
            id: 'Cannonball',
            greeting: 'Collision',
            src: path + "/images/gamebuilder/sprites/mastergate.png",
            SCALE_FACTOR: 11,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 920, y: 600 },
            pixels: { height: 512, width: 512 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            right: { row: 0, start: 0, columns: 1 },
            left: { row: 0, start: 0, columns: 1 },
            up: { row: 0, start: 0, columns: 1 },
            upRight: { row: 0, start: 0, columns: 1 },
            downRight: { row: 0, start: 0, columns: 1 },
            upLeft: { row: 0, start: 0, columns: 1 },
            downLeft: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['Collision'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };


        const barrier1 = {
            id: 'wall_left', x: 0, y: 0, width: 50, height: 772, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier2 = {
            id: 'wall_right', x: 1084, y: 0, width: 50, height: 772, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier3 = {
            id: 'wall_top', x: 0, y: 0, width: 1134, height: 50, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier4 = {
            id: 'wall_bottom', x: 0, y: 722, width: 1134, height: 50, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier5 = {
            id: 'internal_v', x: 450, y: 150, width: 50, height: 400, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier6 = {
            id: 'internal_h', x: 500, y: 400, width: 500, height: 50, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier7 = {
            id: 'barrier7', x: 250, y: 0, width: 50, height: 550, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier8 = {
            id: 'barrier8', x: 750, y: 250, width: 50, height: 350, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier9 = {
            id: 'barrier9', x: 500, y: 500, width: 200, height: 50, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier10 = {
            id: 'barrier10', x: 850, y: 150, width: 50, height: 150, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier11 = {
            id: 'barrier11', x: 550, y: 250, width: 50, height: 200, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier12 = {
            id: 'barrier12', x: 650, y: 450, width: 200, height: 50, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier13 = {
            id: 'barrier13', x: 150, y: 350, width: 50, height: 150, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier14 = {
            id: 'barrier14', x: 900, y: 300, width: 50, height: 250, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier15 = {
            id: 'barrier15', x: 100, y: 100, width: 50, height: 150, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier16 = {
            id: 'barrier16', x: 950, y: 100, width: 50, height: 150, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const barrier17 = {
            id: 'barrier17', x: 400, y: 300, width: 50, height: 100, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


this.classes = [      { class: GameEnvBackground, data: bgData },
      { class: Player, data: playerData },
      { class: Npc, data: npcData1 },
      { class: Barrier, data: barrier1 },
      { class: Barrier, data: barrier2 },
      { class: Barrier, data: barrier3 },
      { class: Barrier, data: barrier4 },
      { class: Barrier, data: barrier5 },
      { class: Barrier, data: barrier6 },
      { class: Barrier, data: barrier7 },
      { class: Barrier, data: barrier8 },
      { class: Barrier, data: barrier9 },
      { class: Barrier, data: barrier10 },
      { class: Barrier, data: barrier11 },
      { class: Barrier, data: barrier12 },
      { class: Barrier, data: barrier13 },
      { class: Barrier, data: barrier14 },
      { class: Barrier, data: barrier15 },
      { class: Barrier, data: barrier16 },
      { class: Barrier, data: barrier17 }
];


       
    }
}


export default GameLevelEscaperoom;

