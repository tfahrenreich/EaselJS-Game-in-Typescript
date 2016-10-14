import GameRoot from "./components/game";

let manifest = [
    {src: "spritesheet_grant.png", id: "grant"},
    {src: "sky.png", id: "sky"},
    {src: "ground.png", id: "ground"},
    {src: "hill1.png", id: "hill"}
];

new GameRoot("testCanvas", manifest);
