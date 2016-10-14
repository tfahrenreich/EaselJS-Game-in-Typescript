/// <reference path="../../typings/globals/easeljs/index.d.ts" />
/// <reference path="../../typings/globals/preloadjs/index.d.ts" />

export default class Hill extends createjs.Bitmap {
    constructor(loader:createjs.LoadQueue, w:number, h:number, n:number) {
        super(loader.getResult("hill"));
        this.setTransform(Math.random() * w, h - this.image.height * 4 - n, 4, 4);
        this.alpha = 0.5
    }
}
