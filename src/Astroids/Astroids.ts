/// <reference path="../../typings/globals/easeljs/index.d.ts" />
/// <reference path="../../typings/globals/preloadjs/index.d.ts" />
/// <reference path="../../typings/globals/soundjs/index.d.ts" />

import {Manifest} from "../models/manifest";
import Ship from "./components/Ship";
import KeyMappings from "./keymappings";
import {lib} from "./PlanetaryGary_art_Canvas";

export default class AsteroidsGame extends KeyMappings {
    static TURN_FACTOR = 7;		//how far the ship turns per frame

    private messageField: createjs.Text;
    private scoreField: createjs.Text;
    private loader: createjs.LoadQueue;
    private stage: createjs.Stage;
    private ship: Ship;
    //rockBelt: rocks[];
    //bulletStream: bullet[];

    constructor(id: string) {
        super();
        console.log(lib);

        let canvas = document.getElementById(id);
        this.stage = new createjs.Stage(canvas);

        this.messageField = new createjs.Text("Loading", "bold 24px Helvetica", "#eee");

        this.loader = new createjs.LoadQueue(true, './public/_assets/sounds/');
        this.loader.on("complete", ()=> {
            this.doneLoading();
        });
        this.loader.on("progress", ()=> {
            this.updateLoading()
        });
    }

    init() {
        this.stage.canvas.style.display = "block";

        this.messageField.maxWidth = 1000;
        this.messageField.textAlign = "center";
        this.messageField.textBaseline = "middle";
        this.messageField.x = this.stage.canvas.width / 2;
        this.messageField.y = this.stage.canvas.height / 2;
        this.stage.addChild(this.messageField);
        this.stage.update();

        createjs.Sound.alternateExtensions = ["mp3"];
        this.loader.installPlugin(createjs.Sound);
        let manifest: Manifest[] = [
            {id: "begin", src: "spawn.ogg"},
            {id: "break", src: "break.ogg", data: 6},
            {id: "death", src: "death.ogg"},
            {id: "laser", src: "shot.ogg", data: 6},
            {id: "music", src: "music.ogg"}
        ];
        this.loader.loadManifest(manifest);

        document.onkeydown = event=> {
            this.handleKeyDown(event)
        };
        document.onkeyup = event=> {
            this.handleKeyUp(event)
        };
    }

    updateLoading() {
        this.messageField.text = "loading " + (this.loader.progress * 100 | 0) + "%";
        this.stage.update();
    }

    doneLoading() {
        this.scoreField = new createjs.Text("0", "bold 18px Arial", "#FFFFFF");
        this.scoreField.textAlign = "right";
        this.scoreField.x = this.stage.canvas.width - 20;
        this.scoreField.y = 20;
        this.scoreField.maxWidth = 1000;
        this.messageField.text = "Welcome: Click to play";
        this.stage.update();

        //createjs.Sound.play("music", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.1});
        this.watchRestart();
    }

    watchRestart() {
        this.stage.canvas.onclick = ()=> {
            this.handleClick();
        };
    }

    handleClick() {
        this.stage.canvas.onclick = null;
        this.stage.removeChild(this.messageField);

        createjs.Sound.play("begin");
        this.stage.update();

        this.restart();
    }

    restart() {
        this.stage.removeAllChildren();
        this.scoreField.text = (0).toString();
        this.stage.addChild(this.scoreField);

        this.ship = new Ship();
        this.ship.x = this.stage.canvas.width / 2;
        this.ship.y = this.stage.canvas.height / 2;
        this.stage.addChild(this.ship);
        this.stage.update();

        if (!createjs.Ticker.hasEventListener("tick")) {
            createjs.Ticker.addEventListener("tick", event => {
                this.tick(event);
            });
        }
    }

    tick(event) {
        if (this.lfHeld) {
            this.ship.rotation -= AsteroidsGame.TURN_FACTOR;
        } else if (this.rtHeld) {
            this.ship.rotation += AsteroidsGame.TURN_FACTOR;
        }

        if (this.fwdHeld) {
            this.ship.accelerate();
        }

        //call sub ticks
        this.ship.tick(event);
        this.stage.update(event);
    }
}