const CONTROLS = {UP: "ArrowUp", RIGHT: "ArrowRight", DOWN: "ArrowDown", LEFT: "ArrowLeft"};

let heldKeyUp = false;
let heldKeyRight = false;
let heldKeyLeft = false;
let heldKeyDown = false;

let walk_sound = new Audio('sound/movement_sound.m4a');

function keyPressed(e) {

    if (typeof hero !== 'undefined' && hero !== undefined) {
        if (e.code === CONTROLS['LEFT']) {
            heldKeyLeft = true;
            hero.turn = 'left';
            walk_sound.volume = audio_volume;
            walk_sound.play();
        } else if (e.code === CONTROLS['RIGHT']) {
            heldKeyRight = true;
            hero.turn = 'right';
            walk_sound.volume = audio_volume;
            walk_sound.play();
        } else if (e.code === CONTROLS['UP']) {
            heldKeyUp = true;
        } else if (e.code === CONTROLS['DOWN']) {
            heldKeyDown = true;
            if (hero.hasSword()) {
                hero.chaseSword(false);
            } else {
                hero.takeSword();
            }
        } else if (e.code === 'KeyO') {
            hero.takeSword();
        } else if (e.code === 'Space') {
            hero.attack();
        }
    }
}

function keyPressReset(e) {
    if (e.code === CONTROLS['LEFT']) {
        heldKeyLeft = false;
    } else if (e.code === CONTROLS['RIGHT']) {
        heldKeyRight = false;
    } else if (e.code === CONTROLS['UP']) {
        heldKeyUp = false;
    } else if (e.code === CONTROLS['DOWN']) {
        heldKeyDown = false;
    }
}

[...document.getElementsByClassName('difficulty-level')]
    .forEach(function (element) {

        element.addEventListener('click', function (e) {

            for (var i = 0; i < [...document.getElementsByClassName('difficulty-level')].length; i++) {
                [...document.getElementsByClassName('difficulty-level')][i].classList.remove('difficulty--active')
            }

            document.getElementById(e.target.getAttribute('id'))
                .classList.add('difficulty--active');

            switch (e.target.getAttribute(('id'))) {
                case 'difficulty-easy' :
                    difficulty = 1;
                    break;

                case 'difficulty-normal' :
                    difficulty = 2;
                    break;

                case 'difficulty-hard' :
                    difficulty = 3;
                    break;
            }

        });
    });