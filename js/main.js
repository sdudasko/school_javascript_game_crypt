let canvas, ctx;

let brick = new Brick();
let level = new Level();


let enableSound = true;
let audioStarted = false;
let audio;
let gameLaunched = false;

let globalCounter = 0;

let inventory = [];
let cycle = 0;

let hero;

let imagesByCell = [];
let enemyAttackInterval, updateInterval;

let canJump = true;
let hero_health = document.getElementById("hero_health");
let enemy_health = document.getElementById("enemy_health");

let minutesLabel, secondsLabel, totalSeconds;
let currentLevel = 1;

let enemies = [];

let menuScreensIds = [
    'defeat-screen',
    'screen-settings',
    'menu-screen',
];
let menuScreens = [];

window.onload = function () {

    menuScreensIds.forEach(function (element, index) {
        menuScreens.push(document.getElementById(element));
    });

    launchGame();
};

function toggleSound() {
    if (!audioStarted) {
        audio = new Audio('vitazstvo.ogg');
        audio.play();
        audioStarted = true;
    }

    if (enableSound === true) {
        audio.volume = 0.6;
    } else {
        audio.volume = 0.0;
    }
    enableSound = !enableSound;
}

function openMenuScreen(open = '') {
    menuScreens.filter(function (element, index) {
        return element !== null;
    }).forEach(function (element, index) {
        element.classList.remove('visible');
    });
    document.getElementById(open).classList.add('visible');
}

function closeAllMenuScreens() {
    menuScreens.filter(function (element, index) {
        return element !== null;
    }).forEach(function (element, index) {
        element.classList.remove('visible');
    });
}

function setUpTimer() {
    // minutesLabel = document.getElementById("minutes");
    // secondsLabel = document.getElementById("seconds");
    totalSeconds = 0;
    setInterval(setTime, 1000);

    function setTime() {
        ++totalSeconds;
        // secondsLabel.innerHTML = pad(totalSeconds % 60);
        // minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }
}

function launchGame() {
    resetAllVariables();
    setUpTimer();

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


function openMenu() {
    openMenuScreen('menu-screen');
}

function rowColToArrayIndex(col, row) {
    return brick.cols * row + col;
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

function openDefeatMenu() {
    openMenuScreen('defeat-screen');
}

function openScore() {

}

function updateAll() {

    drawAll();
    let self = this;

    if (totalSeconds <= 1)
        drawText('|');

    if (hero !== undefined) {
        hero.drawCharacter();
        hero.move();
    }
    if (enemies.length > 0) {
        if (level.currentLevel === level.levels[1]) {
            enemies.forEach(function (element, index) {
                element.drawCharacter();
                element.move();
            });
        }
    }

    globalCounter++;
}