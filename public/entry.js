requirejs.config({
    paths: {
        "easeljs": "../node_modules/createjs-easeljs/lib/easeljs-0.8.2.min",
        "preloadjs": "../node_modules/createjs-preloadjs/lib/preloadjs-0.6.2.min"
    },
    shim: {
        'app': [
            'preloadjs',
            'easeljs'
        ]
    }
});
require([
    "app"
]);
