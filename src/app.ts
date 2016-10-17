import WalkerGameRoot from "./Walker/Walker";
import AsteroidsGame from "./Astroids/Astroids";

let walker = new WalkerGameRoot("testCanvas");
window.walker = walker;

let asteroids = new AsteroidsGame("gameCanvas");
window.asteroids = asteroids;
