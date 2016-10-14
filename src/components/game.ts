/// <reference path="../../typings/globals/easeljs/index.d.ts" />
/// <reference path="../../typings/globals/preloadjs/index.d.ts" />

import {Manifest} from "../models/manifest";
import Sky from "./Sky";
import Ground from "./Ground";
import Grant from "./Grant";
import Hill from "./Hill";

export default class GameRoot {
    loader:createjs.LoadQueue;
    stage:createjs.Stage;
    w:number;
    h:number;

    sky:Sky;
    ground:Ground;
    grant:Grant;
    hills:Hill[];

    constructor(id:string, manifest:Manifest[]) {
        this.stage = new createjs.Stage(id);
        this.w = this.stage.canvas.width;
        this.h = this.stage.canvas.height;
        this.hills = [];

        this.loader = new createjs.LoadQueue(false);

        this.loader.addEventListener("complete", ()=> {
            this.handleComplete();
        });

        this.loader.loadManifest(manifest, true, "./public/_assets/art/");
    }


    handleComplete() {
        this.sky = new Sky(this.loader, this.w, this.h);
        this.ground = new Ground(this.loader, this.w, this.h);
        this.grant = new Grant(this.loader);
        this.hills.push(new Hill(this.loader, this.w, this.h, this.ground.tileW));
        this.hills.push(new Hill(this.loader, this.w, this.h, this.ground.tileW));


        this.stage.addChild(this.sky, this.hills[0], this.hills[1], this.ground, this.grant);
        //this.stage.addEventListener("stagemousedown", handleJumpStart);

        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", event => {
            this.tick(event)
        });
    }

    tick(event) {
        let grant = this.grant;
        let ground = this.ground;
        let hill = this.hills[0];
        let hill2 = this.hills[1];
        let w = this.w;
        let h = this.h;

        let deltaS = event.delta / 1000;
        let position = grant.x + 50 * deltaS;
        let positionh = grant.y + 150 * deltaS;

        var grantW = grant.getBounds().width * grant.scaleX;
        var grantH = grant.getBounds().height * grant.scaleY;
        grant.x = (position >= w + grantW) ? -grantW : position;
        grant.y = (position >= h + grantH) ? -grantH : positionh;

        ground.x = (ground.x - deltaS * 150) % ground.tileW;
        hill.x = (hill.x - deltaS * 30);
        if (hill.x + hill.image.width * hill.scaleX <= 0) {
            hill.x = w;
        }
        hill2.x = (hill2.x - deltaS * 45);
        if (hill2.x + hill2.image.width * hill2.scaleX <= 0) {
            hill2.x = w;
        }

        this.stage.update(event);
    }

}