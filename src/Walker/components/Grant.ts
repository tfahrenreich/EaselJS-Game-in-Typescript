/// <reference path="../../../typings/globals/easeljs/index.d.ts" />
/// <reference path="../../../typings/globals/preloadjs/index.d.ts" />
export default class Grant extends createjs.Sprite {
    constructor(loader:createjs.LoadQueue) {
        let spriteSheet = new createjs.SpriteSheet({
            framerate: 30,
            "images": [loader.getResult("grant")],
            "frames": {"regX": 82, "height": 292, "count": 64, "regY": 0, "width": 165},
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
            "animations": {
                "run": [0, 25, "run", 1.5],
                "jump": [26, 63, "run"]
            }
        });
        super(spriteSheet, "run");
        this.y = 35;
    }
}



