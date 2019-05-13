let canvas, ctx;

let brick = new Brick();
let level = new Level();

let hero = new Hero(200, 200);
let enemy = new Enemy(700, 200, true, true, 'left', 2, 'enemy_anim_spread2.png', 2);

let enableSound = true;
let audioStarted = false;
let audio;
let gameLaunched = false;

let globalCounter = 0;

let inventory = [];
let cycle = 0;

let imagesByCell = [];

let canJump = true;
let hero_health = document.getElementById("hero_health");
let enemy_health = document.getElementById("enemy_health");

window.onload = function() {
    launchGame();

    setInterval(function() {
        enemy.attack();
    }, 1000);
};

function toggleSound()
{
    if (!audioStarted) {
        audio = new Audio ('vitazstvo.ogg');
        audio.play();
        audioStarted = true;
    }

    if (enableSound === true) {
        audio.volume = 0.6;
    } else {
        audio.volume = 0.0;
    }
    enableSound= !enableSound;
}

function launchGame() {
    document.getElementById('screen-settings').classList.add('screen-settings--hidden');

    if (!gameLaunched) {
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        loadImages();

        let fps = 60;
        setInterval(updateAll, 1000 / fps);

        x = canvas.width / 2;
        y = canvas.height / 2;

        document.addEventListener('keydown', keyPressed);
        document.addEventListener('keyup', keyPressReset);
    }

    gameLaunched = true;
}

function openSettings() {
    document.getElementById('settings-screen').classList.add('settings-screen--visible');


}

function openMenu() {
    document.getElementById('screen-settings').classList.remove('screen-settings--hidden');
}

function rowColToArrayIndex(col, row) {
    return brick.cols * row + col;
}

function updateAll() {

    drawAll();

    hero.drawCharacter();
    hero.move();

    if (level.currentLevel === level.levels[1]) {
        enemy.drawCharacter();
        enemy.move();
    }

    globalCounter++;
}