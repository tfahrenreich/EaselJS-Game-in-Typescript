/// <reference path="../../typings/globals/easeljs/index.d.ts" />
/// <reference path="../../typings/globals/preloadjs/index.d.ts" />
import Graphics = createjs.Graphics;
export default class Sky extends createjs.Shape {
    loader:createjs.LoadQueue;
    graphics:Graphics;

    constructor(loader:createjs.LoadQueue, w:number, h:number) {
        super();
        this.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, w, h);
    }
}