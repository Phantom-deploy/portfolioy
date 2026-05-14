---
layout: opencs
title: RPG Water Example 
permalink: /gamify/gategamev2
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    import Game from "{{site.baseurl}}/assets/js/GameEnginev1.1/essentials/Game.js";
    import GameLevelCannonball from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelCannonball.js";
    import GameLevelEscaperoom from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelEscaperoom.js";
    import GameLevelZonecatch from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelZonecatch.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelCannonball, GameLevelEscaperoom, GameLevelZonecatch];

    const environment = {
        path: "{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: gameLevelClasses
    }

    Game.main(environment);
</script>