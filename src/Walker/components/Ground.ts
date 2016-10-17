/// <reference path="../../../typings/globals/easeljs/index.d.ts" />
/// <reference path="../../../typings/globals/preloadjs/index.d.ts" />
import Graphics = createjs.Graphics;
export default class Ground extends createjs.Shape {
    tileW: number;

    constructor(loader:createjs.LoadQueue, w:number, h:number) {
        super();
        var groundImg = loader.getResult("ground");
        this.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w + groundImg.width, groundImg.height);
        this.tileW = groundImg.width;
        this.y = h - groundImg.height;
    }
}