---
layout: opencs
title: All chet's games
permalink: /gamify/chetall
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <!-- GameEnv will create canvas dynamically -->
</div>

<script type="module">
    // Adnventure Game Assets locations
    import Core from "{{site.baseurl}}/assets/js/GameEnginev1/essentials/Game.js";
    import GameControl from "{{site.baseurl}}/assets/js/GameEnginev1/essentials/GameControl.js";
    import GameLevelChetslime from "{{site.baseurl}}/assets/js/GameEnginev1/GameLevelChetslime.js";
    import GameLevelChetinteractive from "{{site.baseurl}}/assets/js/GameEnginev1/GameLevelChetinteractive.js";
    import GameLevelChetcustom from "{{site.baseurl}}/assets/js/GameEnginev1/GameLevelChetcustom.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelChetslime, GameLevelChetinteractive, GameLevelChetcustom];

    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameLevelClasses: gameLevelClasses

    }
    // Launch Adventure Game using the central core and adventure GameControl
    Core.main(environment, GameControl);
</script>
