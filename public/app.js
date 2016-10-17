var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Tim on 10/13/2016.
 */
define("models/manifest", ["require", "exports"], function (require, exports) {
    "use strict";
    var Manifest = (function () {
        function Manifest() {
        }
        return Manifest;
    }());
    exports.Manifest = Manifest;
});
define("Walker/components/Sky", ["require", "exports"], function (require, exports) {
    "use strict";
    var Sky = (function (_super) {
        __extends(Sky, _super);
        function Sky(loader, w, h) {
            _super.call(this);
            this.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, w, h);
        }
        return Sky;
    }(createjs.Shape));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Sky;
});
define("Walker/components/Ground", ["require", "exports"], function (require, exports) {
    "use strict";
    var Ground = (function (_super) {
        __extends(Ground, _super);
        function Ground(loader, w, h) {
            _super.call(this);
            var groundImg = loader.getResult("ground");
            this.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w + groundImg.width, groundImg.height);
            this.tileW = groundImg.width;
            this.y = h - groundImg.height;
        }
        return Ground;
    }(createjs.Shape));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ground;
});
define("Walker/components/Grant", ["require", "exports"], function (require, exports) {
    "use strict";
    /// <reference path="../../../typings/globals/easeljs/index.d.ts" />
    /// <reference path="../../../typings/globals/preloadjs/index.d.ts" />
    var Grant = (function (_super) {
        __extends(Grant, _super);
        function Grant(loader) {
            var spriteSheet = new createjs.SpriteSheet({
                framerate: 30,
                "images": [loader.getResult("grant")],
                "frames": { "regX": 82, "height": 292, "count": 64, "regY": 0, "width": 165 },
                // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                "animations": {
                    "run": [0, 25, "run", 1.5],
                    "jump": [26, 63, "run"]
                }
            });
            _super.call(this, spriteSheet, "run");
            this.y = 35;
        }
        return Grant;
    }(createjs.Sprite));
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <reference path="../../../typings/globals/easeljs/index.d.ts" />
    /// <reference path="../../../typings/globals/preloadjs/index.d.ts" />
    exports.default = Grant;
});
/// <reference path="../../../typings/globals/easeljs/index.d.ts" />
/// <reference path="../../../typings/globals/preloadjs/index.d.ts" />
define("Walker/components/Hill", ["require", "exports"], function (require, exports) {
    "use strict";
    var Hill = (function (_super) {
        __extends(Hill, _super);
        function Hill(loader, w, h, n) {
            _super.call(this, loader.getResult("hill"));
            this.setTransform(Math.random() * w, h - this.image.height * 4 - n, 4, 4);
            this.alpha = 0.5;
        }
        return Hill;
    }(createjs.Bitmap));
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <reference path="../../../typings/globals/easeljs/index.d.ts" />
    /// <reference path="../../../typings/globals/preloadjs/index.d.ts" />
    exports.default = Hill;
});
/// <reference path="../../typings/globals/easeljs/index.d.ts" />
/// <reference path="../../typings/globals/preloadjs/index.d.ts" />
define("Walker/Walker", ["require", "exports", "Walker/components/Sky", "Walker/components/Ground", "Walker/components/Grant", "Walker/components/Hill"], function (require, exports, Sky_1, Ground_1, Grant_1, Hill_1) {
    "use strict";
    var WalkerGameRoot = (function () {
        function WalkerGameRoot(id) {
            var _this = this;
            this.stage = new createjs.Stage(id);
            this.w = this.stage.canvas.width;
            this.h = this.stage.canvas.height;
            this.hills = [];
            this.loader = new createjs.LoadQueue(false);
            this.loader.on("complete", function () {
                _this.handleComplete();
            });
        }
        WalkerGameRoot.prototype.init = function () {
            this.stage.canvas.style.display = "block";
            var manifest = [
                { src: "spritesheet_grant.png", id: "grant" },
                { src: "sky.png", id: "sky" },
                { src: "ground.png", id: "ground" },
                { src: "hill1.png", id: "hill" }
            ];
            this.loader.loadManifest(manifest, true, "./public/_assets/art/");
        };
        WalkerGameRoot.prototype.handleComplete = function () {
            var _this = this;
            this.sky = new Sky_1.default(this.loader, this.w, this.h);
            this.ground = new Ground_1.default(this.loader, this.w, this.h);
            this.grant = new Grant_1.default(this.loader);
            this.hills.push(new Hill_1.default(this.loader, this.w, this.h, this.ground.tileW));
            this.hills.push(new Hill_1.default(this.loader, this.w, this.h, this.ground.tileW));
            this.stage.addChild(this.sky, this.hills[0], this.hills[1], this.ground, this.grant);
            //this.stage.addEventListener("stagemousedown", handleJumpStart);
            //createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.on("tick", function (event) {
                _this.tick(event);
            });
        };
        WalkerGameRoot.prototype.tick = function (event) {
            var grant = this.grant;
            var ground = this.ground;
            var hill = this.hills[0];
            var hill2 = this.hills[1];
            var w = this.w;
            var h = this.h;
            var deltaS = event.delta / 1000;
            var position = grant.x + 150 * deltaS;
            var positionh = grant.y + 60 * deltaS;
            var grantW = grant.getBounds().width * grant.scaleX;
            var grantH = grant.getBounds().height * grant.scaleY;
            grant.x = (position >= w + grantW) ? -grantW : position;
            //grant.y = (position >= h + grantH) ? -grantH : positionh;
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
        };
        return WalkerGameRoot;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WalkerGameRoot;
});
define("Astroids/components/Ship", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Created by timfahrenreich on 10/17/16.
     */
    var Ship = (function (_super) {
        __extends(Ship, _super);
        function Ship() {
            _super.call(this);
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
        Ship.prototype.makeShape = function () {
            var graphics = this.shipBody.graphics;
            graphics.clear();
            graphics.beginStroke("#FFFFFF");
            graphics.moveTo(0, 10);
            graphics.lineTo(5, -6);
            graphics.lineTo(0, -2);
            graphics.lineTo(-5, -6);
            graphics.closePath();
            var o = this.shipFlame;
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
        };
        Ship.prototype.tick = function (e) {
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
                    }
                    else {
                        this.shipFlame.scaleX = 1;
                        this.shipFlame.scaleY = 1;
                    }
                }
                this.thrust -= 0.5;
            }
            else {
                this.shipFlame.alpha = 0;
                this.thrust = 0;
            }
        };
        Ship.prototype.accelerate = function () {
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
        };
        return Ship;
    }(createjs.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by timfahrenreich on 10/17/16.
     */
    exports.default = Ship;
    Ship.TOGGLE = 60;
    Ship.MAX_THRUST = 2;
    Ship.MAX_VELOCITY = 5;
});
define("Astroids/keymappings", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Created by timfahrenreich on 10/17/16.
     */
    var KeyMappings = (function () {
        function KeyMappings() {
        }
        KeyMappings.prototype.handleKeyDown = function (e) {
            switch (e.keyCode) {
                case KeyMappings.KEYCODE_SPACE:
                    this.shootHeld = true;
                    return false;
                case KeyMappings.KEYCODE_A:
                case KeyMappings.KEYCODE_LEFT:
                    this.lfHeld = true;
                    return false;
                case KeyMappings.KEYCODE_D:
                case KeyMappings.KEYCODE_RIGHT:
                    this.rtHeld = true;
                    return false;
                case KeyMappings.KEYCODE_W:
                case KeyMappings.KEYCODE_UP:
                    this.fwdHeld = true;
                    return false;
            }
        };
        KeyMappings.prototype.handleKeyUp = function (e) {
            switch (e.keyCode) {
                case KeyMappings.KEYCODE_SPACE:
                    this.shootHeld = false;
                    break;
                case KeyMappings.KEYCODE_A:
                case KeyMappings.KEYCODE_LEFT:
                    this.lfHeld = false;
                    break;
                case KeyMappings.KEYCODE_D:
                case KeyMappings.KEYCODE_RIGHT:
                    this.rtHeld = false;
                    break;
                case KeyMappings.KEYCODE_W:
                case KeyMappings.KEYCODE_UP:
                    this.fwdHeld = false;
                    break;
            }
        };
        return KeyMappings;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by timfahrenreich on 10/17/16.
     */
    exports.default = KeyMappings;
    KeyMappings.KEYCODE_ENTER = 13; //useful keycode
    KeyMappings.KEYCODE_SPACE = 32; //useful keycode
    KeyMappings.KEYCODE_UP = 38; //useful keycode
    KeyMappings.KEYCODE_LEFT = 37; //useful keycode
    KeyMappings.KEYCODE_RIGHT = 39; //useful keycode
    KeyMappings.KEYCODE_W = 87; //useful keycode
    KeyMappings.KEYCODE_A = 65; //useful keycode
    KeyMappings.KEYCODE_D = 68; //useful keycode
});
/// <reference path="../../typings/globals/easeljs/index.d.ts" />
/// <reference path="../../typings/globals/preloadjs/index.d.ts" />
/// <reference path="../../typings/globals/soundjs/index.d.ts" />
define("Astroids/Astroids", ["require", "exports", "Astroids/components/Ship", "Astroids/keymappings"], function (require, exports, Ship_1, keymappings_1) {
    "use strict";
    var AsteroidsGame = (function (_super) {
        __extends(AsteroidsGame, _super);
        //rockBelt: rocks[];
        //bulletStream: bullet[];
        function AsteroidsGame(id) {
            var _this = this;
            _super.call(this);
            var canvas = document.getElementById(id);
            this.stage = new createjs.Stage(canvas);
            this.messageField = new createjs.Text("Loading", "bold 24px Helvetica", "#eee");
            this.loader = new createjs.LoadQueue(true, './public/_assets/sounds/');
            this.loader.on("complete", function () {
                _this.doneLoading();
            });
            this.loader.on("progress", function () {
                _this.updateLoading();
            });
        }
        AsteroidsGame.prototype.init = function () {
            var _this = this;
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
            var manifest = [
                { id: "begin", src: "spawn.ogg" },
                { id: "break", src: "break.ogg", data: 6 },
                { id: "death", src: "death.ogg" },
                { id: "laser", src: "shot.ogg", data: 6 },
                { id: "music", src: "music.ogg" }
            ];
            this.loader.loadManifest(manifest);
            document.onkeydown = function (event) {
                _this.handleKeyDown(event);
            };
            document.onkeyup = function (event) {
                _this.handleKeyUp(event);
            };
        };
        AsteroidsGame.prototype.updateLoading = function () {
            this.messageField.text = "loading " + (this.loader.progress * 100 | 0) + "%";
            this.stage.update();
        };
        AsteroidsGame.prototype.doneLoading = function () {
            this.scoreField = new createjs.Text("0", "bold 18px Arial", "#FFFFFF");
            this.scoreField.textAlign = "right";
            this.scoreField.x = this.stage.canvas.width - 20;
            this.scoreField.y = 20;
            this.scoreField.maxWidth = 1000;
            this.messageField.text = "Welcome: Click to play";
            this.stage.update();
            //createjs.Sound.play("music", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.1});
            this.watchRestart();
        };
        AsteroidsGame.prototype.watchRestart = function () {
            var _this = this;
            this.stage.canvas.onclick = function () {
                _this.handleClick();
            };
        };
        AsteroidsGame.prototype.handleClick = function () {
            this.stage.canvas.onclick = null;
            this.stage.removeChild(this.messageField);
            createjs.Sound.play("begin");
            this.stage.update();
            this.restart();
        };
        AsteroidsGame.prototype.restart = function () {
            var _this = this;
            this.stage.removeAllChildren();
            this.scoreField.text = (0).toString();
            this.stage.addChild(this.scoreField);
            this.ship = new Ship_1.default();
            this.ship.x = this.stage.canvas.width / 2;
            this.ship.y = this.stage.canvas.height / 2;
            this.stage.addChild(this.ship);
            this.stage.update();
            if (!createjs.Ticker.hasEventListener("tick")) {
                createjs.Ticker.addEventListener("tick", function (event) {
                    _this.tick(event);
                });
            }
        };
        AsteroidsGame.prototype.tick = function (event) {
            if (this.lfHeld) {
                this.ship.rotation -= AsteroidsGame.TURN_FACTOR;
            }
            else if (this.rtHeld) {
                this.ship.rotation += AsteroidsGame.TURN_FACTOR;
            }
            if (this.fwdHeld) {
                this.ship.accelerate();
            }
            //call sub ticks
            this.ship.tick(event);
            this.stage.update(event);
        };
        return AsteroidsGame;
    }(keymappings_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AsteroidsGame;
    AsteroidsGame.TURN_FACTOR = 7; //how far the ship turns per frame
});
define("app", ["require", "exports", "Walker/Walker", "Astroids/Astroids"], function (require, exports, Walker_1, Astroids_1) {
    "use strict";
    var walker = new Walker_1.default("testCanvas");
    window.walker = walker;
    var asteroids = new Astroids_1.default("gameCanvas");
    window.asteroids = asteroids;
});
//# sourceMappingURL=/Users/timfahrenreich/Development/EaselJS-Game-in-Typescript/src/app.js.map