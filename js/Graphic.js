let torchCycle = 0;
let startingY = 0;
let loadedHero = 0;

function drawAll() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBricks();
}

function loadImages() {

    let images = [
        {notation: level.notation['BRICK'], src: 'brick.png'},
        {notation: level.notation['HERO'], src: 'hero_anim_spread2.png'},
        {notation: level.notation['SWORD'], src: 'sword_2.png'},
        {notation: level.notation['POTION'], src: 'potion.png'},
        {notation: level.notation['TORCH'], src: 'torches-sprite4.png'},
        {notation: level.notation['GEM'], src: 'gem.png'},
        {notation: 15, src: 'enemy_anim_spread2.png'},
    ];

    images.forEach((val) => {
        loadImage(val);
    });

}

function loadImage(image) {
    let img = document.createElement('img');
    img.src = "img/" + image.src;

    imagesByCell.push({notation: image.notation, useImg: img});
}

let swordX;
let swordY;
let inventoryItemsMargin = 0;
let inventoryItemsCount;

function drawBricks() {

    let brick_y = 0;
    let brick_x = 0;

    inventoryItemsCount = inventory.length;

    for (let rows = 0; rows < brick.rows; rows++) {
        for (let cols = 0; cols < brick.cols; cols++) {

            let arrayIndex = rowColToArrayIndex(cols, rows);
            let imageToDraw = imagesByCell.find(function (el) {
                return el.notation === level.currentLevel[arrayIndex];
            });

            if (imageToDraw && (level.currentLevel[arrayIndex] !== level.notation['HERO'])) {

                if (level.currentLevel[arrayIndex] === level.notation['TORCH']) {
                    let i = imageToDraw.useImg;
                    let spriteTorchW = 23, spriteH = 56;
                    ctx.save();
                    ctx.drawImage(i, torchCycle * spriteTorchW, 1, spriteTorchW, spriteH, brick_x, brick_y, spriteTorchW, spriteH);
                    ctx.restore();
                    if (globalCounter % 10 === 0) {
                        torchCycle = (torchCycle + 1) % 8;
                    }
                } else {
                    ctx.drawImage(imageToDraw.useImg, brick_x, brick_y);
                }
            } else if ((level.currentLevel[arrayIndex] === level.notation['HERO'])) {
                if (!loadedHero) {
                    loadedHero = 1;
                    x = brick_x;
                    y = brick_y;
                }
            } else if (level.currentLevel[arrayIndex] === level.notation['INVENTORY']) {
                // Show  items in inventory
                let inventoryImages = inventory.map(function (el) {
                    return imagesByCell.find(e => {
                        return e.notation === el;
                    });
                });

                if (inventoryImages && inventoryItemsCount > 0) {
                    inventoryItemsMargin = 285;
                    inventoryImages.forEach((el) => {

                        // Veritically center inventory images - slightly to bottom :)
                        ctx.drawImage(el.useImg, inventoryItemsMargin + brick_x, brick_y + brick.height / 2 - el.useImg.height / 2 + (5));
                        inventoryItemsMargin += 50;
                        inventoryItemsCount--;
                    });
                    inventoryItemsMargin = 0;
                }
            }

            brick_x += brick.width;
        }
        brick_y += brick.height;
        brick_x = 0;
    }
}