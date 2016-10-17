/**
 * Created by timfahrenreich on 10/17/16.
 */
export default class Ship extends createjs.Container {
    static TOGGLE = 60;
    static MAX_THRUST = 2;
    static MAX_VELOCITY = 5;

    public timeout: number;
    public thrust: number;
    public vY: number;
    public vX: number;
    public bounds: any;
    public hit: any;

    shipFlame: createjs.Shape;
    shipBody: createjs.Shape;

    constructor() {
        super();


        this.shipFlame = new createjs.Shape();
        this.shipBody = new createjs.Shape();

        this.addChild(this.shipFlame);
        this.addChild(this.shipBody);

        this.timeout = 0;
        this.thrust = 0;
        this.vX = 0;
        this.vY = 0;
        this.makeShape();
    }

    makeShape() {
        let graphics = this.shipBody.graphics;
        graphics.clear();

        graphics.beginStroke("#FFFFFF");
        graphics.moveTo(0, 10);
        graphics.lineTo(5, -6);
        graphics.lineTo(0, -2);
        graphics.lineTo(-5, -6);
        graphics.closePath();

        let o = this.shipFlame;
        o.scaleX = 0.5;
        o.scaleY = 0.5;
        o.y = -5;

        graphics = o.graphics;
        graphics.clear();
        graphics.beginStroke("#FFFFFF");

        graphics.moveTo(2, 0);
        graphics.lineTo(4, -3);
        graphics.lineTo(2, -2);
        graphics.lineTo(0, -5);
        graphics.lineTo(-2, -2);
        graphics.lineTo(-4, -3);
        graphics.lineTo(-2, -0);
        
        //furthest visual element
        this.bounds = 10;
        this.hit = this.bounds;
    }

    tick(e){
        this.x += this.vX;
        this.y += this.vY;

        //with thrust flicker a flame every Ship.TOGGLE frames, attenuate thrust
        if (this.thrust > 0) {
            this.timeout++;
            this.shipFlame.alpha = 1;

            if (this.timeout > Ship.TOGGLE) {
                this.timeout = 0;
                if (this.shipFlame.scaleX == 1) {
                    this.shipFlame.scaleX = 0.5;
                    this.shipFlame.scaleY = 0.5;
                } else {
                    this.shipFlame.scaleX = 1;
                    this.shipFlame.scaleY = 1;
                }
            }
            this.thrust -= 0.5;
        } else {
            this.shipFlame.alpha = 0;
            this.thrust = 0;
        }
    }

    accelerate(){
        //increase push ammount for acceleration
        this.thrust += this.thrust + 0.6;
        if (this.thrust >= Ship.MAX_THRUST) {
            this.thrust = Ship.MAX_THRUST;
        }

        //accelerate
        this.vX += Math.sin(this.rotation * (Math.PI / -180)) * this.thrust;
        this.vY += Math.cos(this.rotation * (Math.PI / -180)) * this.thrust;

        //cap max speeds
        this.vX = Math.min(Ship.MAX_VELOCITY, Math.max(-Ship.MAX_VELOCITY, this.vX));
        this.vY = Math.min(Ship.MAX_VELOCITY, Math.max(-Ship.MAX_VELOCITY, this.vY));
    }
}
