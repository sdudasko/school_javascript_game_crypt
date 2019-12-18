let canvas, ctx;

let brick = new Brick();
let level = new Level();
let audio_volume = 0;
let enableSound = true;
let audioStarted = false;

let globalCounter = 0;

let inventory = [];
let cycle = 0;
let swordTaken = false;
let hero;

let imagesByCell = [];
let enemyAttackInterval, updateInterval;

let canJump = true;
let hero_health = document.getElementById("hero_health");
let enemy_health = document.getElementById("enemy_health");
let difficulty = 2;

let totalSeconds;
let currentLevel = 1;

let enemies = [];

let menuScreensIds = [
    'defeat-screen',
    'screen-settings',
    'menu-screen',
    'score-screen',
    'settings-screen',
    'instructions-screen',
];

let menuScreens = [];
let writeWaveNum = false;

let prolog_audio = new Audio('sound/prolog.ogg');

window.onload = function () {
    menuScreensIds.forEach(function (element, index) {
        menuScreens.push(document.getElementById(element));
    });

    loadImages();
    setTimeout(function () {
        openMenuScreen('menu-screen');
    }, 200);

    prolog_audio = new Audio('sound/prolog.ogg');
    prolog_audio.volume = audio_volume;
    prolog_audio.play();
};

function launchGame() {
    resetAllVariables();
    setUpTimer();
    prolog_audio.pause();

    hero = new Hero(200, 200);

    enemies.push(
        new Enemy(350, 200, true, true, 'left', 2, 'enemy_anim_spread2.png', 2),
    );

    closeAllMenuScreens();

    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    loadImages();

    enemyAttackInterval = setInterval(function () {
        if (enemies.length > 0)
            enemies
                .forEach(function (e, i) {
                    e.attack();
                })
    }, 1000);

    let fps = 60;

    updateInterval = setInterval(updateAll, 1000 / fps);

    x = canvas.width / 2;
    y = canvas.height / 2;

    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyPressReset);

}

function resetAllVariables() {
    hero = undefined;
    enemies = [];
    clearInterval(enemyAttackInterval);
    clearInterval(updateInterval);

    [...document.getElementsByTagName('progress')
    ].forEach(function (element, index) {
        element.setAttribute('value', 100);

    });
    level.currentLevel = level.levels[0];
    currentLevel = 1;

}

function updateAll() {
    drawAll();
    let self = this;

    if (totalSeconds <= 1)
        drawText('|');

    if (writeWaveNum) {
        drawText(romanize(currentLevel));
        setTimeout(function () {
            writeWaveNum = false;
        }, 2500);
    }


    if (hero !== undefined) {
        hero.drawCharacter();
        hero.move();
    }
    if (enemies.length > 0) {
        // if (level.currentLevel === level.levels[1]) {
            enemies.forEach(function (element, index) {
                element.drawCharacter();
                element.move();
            });
        // }
    }

    globalCounter++;
}