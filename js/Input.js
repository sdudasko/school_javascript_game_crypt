const CONTROLS = {UP: "ArrowUp", RIGHT: "ArrowRight", DOWN: "ArrowDown", LEFT: "ArrowLeft"};

let heldKeyUp = false;
let heldKeyRight = false;
let heldKeyLeft = false;
let heldKeyDown = false;

function keyPressed(e) {

    if (e.code === CONTROLS['LEFT']) {
        heldKeyLeft = true;
        // hero.turn = 'left';
    } else if (e.code === CONTROLS['RIGHT']) {
        heldKeyRight = true;
        // hero.turn = 'right';
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