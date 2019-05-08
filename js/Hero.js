class Hero extends BaseClass {

    constructor() {
        super();
        this.height = 80;
        this.width = 40;
        this.speedX = 0;
        this.speedY = 0;
        this.walkSpeed = 3;
        this.walkBackSpeed = -3;
        this.swordAngle = - Math.PI/2;

        this.swordAngleRotation = 0;
        this.turn = 'right';
        this.swordChased = false;

        this.x = 200;
        this.y = 200;

        this.jumping = false;
        this.attacking = false;
    }

    jump() {
        if (!this.jumping) {
            this.speedY = -16;
            this.jumping = true;
        }
    }

    onGround() {

        let characterBrickCol = Math.floor(((this.x + this.width) / brick.width));
        let characterBrickRow = Math.floor(((this.y - (this.height / 2)) / brick.height)) + 2;

        let curBrick = rowColToArrayIndex(characterBrickCol, characterBrickRow);

        return level.currentLevel[curBrick] === 1;

    }

    hasSword() {
        return inventory.indexOf(level.notation['SWORD']) !== -1;
    }

    chaseSword(chase = true) {
        if (chase) {
            this.swordChased = true;
        } else {
            this.swordChased = false;
        }
        // inventory.splice(inventory.indexOf(level.notation['SWORD']), 1);
    }

    canGo(posX, posY) {
        let curBrick = 0;

        let characterBrickCol = Math.floor((posX) / brick.width);
        let characterBrickRow = Math.floor((posY) / brick.height);

        if (curBrick >= 0 && curBrick < brick.cols * brick.rows) {
            curBrick = rowColToArrayIndex(characterBrickCol, characterBrickRow);
        } else {
            return false;
        }

        if (level.currentLevel[curBrick] === 1) {
            return false;
        }
        return true;
    }

    move() {
        this.speedX = 0;

        if (heldKeyLeft) {
            this.speedX = this.walkBackSpeed;

        }
        if (heldKeyRight) {
            this.speedX = this.walkSpeed;
        }
        if (heldKeyUp) {
            this.jump();
        }

        if (this.jumping || !this.onGround()) {
            this.speedY++;
        }

        // Hero cannot jump up to the ceiling
        if (this.speedY < 0 && !this.canGo(this.x, this.y)) {
            this.speedY = 0;
        }

        // Hero cannot fall throughout in half of the brick
        if (
            this.speedY > 0 &&
            // + 7 - somehow it works better with that - GlItCH
            !this.canGo(this.x + this.width / 2 + 7, this.y + this.height + this.speedY)
        ) {
            this.y = (1 + Math.floor(this.y / brick.height)) * brick.height - this.width / 2;
            this.speedY = 0;
            this.jumping = false;
        }

        // We are going right and we detect that we stand on the side of brick so we disable jump
        if (this.speedX >= 0 && this.onGround() && ((this.y + this.height - brick.height) % brick.height) !== 0) {
            canJump = false;
            this.x = (1 + Math.floor(this.x / brick.width)) * brick.width - (this.width);
            this.y += 5;
            this.x -= 5;
        } else {
            canJump = true;
        }

        if (this.speedX < 0 && this.onGround() && ((this.y + this.height - brick.height) % brick.height) !== 0) {
            canJump = false;
            this.x = (1 + Math.floor(this.x / brick.width)) * brick.width + (this.width);
            this.y += 5;
            this.x -= 5;
            heldKeyLeft = false;
        } else {
            canJump = true;
        }

        // Check if the hero can move to the right
        if (this.speedX > 0 && !this.canGo(this.x + 5 + this.width, this.y + (this.width / 2))) {
            this.x = (1 + Math.floor(this.x / brick.width)) * brick.width - (this.width);
        }
        // Check if the hero can move to the left
        // - 5 because the we have to catch the condition before hero gets to the brick
        if (this.speedX < 0 && !this.canGo(this.x - 5, this.y + (this.width / 2))) {
            this.x = (Math.floor(this.x / brick.width)) * (brick.width) + 7;
        }
        if (this.attacking) {
            if (this.turn === 'right') {
                this.swordAngleRotation -= Math.PI/30;

                if (this.swordAngleRotation <= -Math.PI/6) {

                    this.swordAngleRotation = 0;
                    this.swordAngle = - Math.PI/2;
                    this.attacking = false;
                }

            } else {
                this.swordAngleRotation += Math.PI/30;

                if (this.swordAngleRotation >= +Math.PI/6) {

                    this.swordAngleRotation = 0;
                    this.swordAngle = - Math.PI/2;
                    this.attacking = false;
                }
            }
        }

        this.swordAngle += this.swordAngleRotation;

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x === (canvas.width - hero.width + 3) && hero.turn === 'right') {
            level.set('currentLevel', level.level2);
            this.x = 0;
        }

        // We are on the left side of 2nd level
        if ((this.x <= 0) && (level.currentLevel === level.level2) && (hero.turn === 'left')) {
            level.set('currentLevel', level.level1);
            this.x = canvas.width - hero.width;
        }

    }

    takeSword() {

        let characterBrickCol = Math.floor((this.x) / brick.width);
        let characterBrickRow = Math.floor((this.y) / brick.height);
        let curBrick = rowColToArrayIndex(characterBrickCol, characterBrickRow);

        if (
            level.currentLevel.indexOf(3) > (curBrick + brick.cols - 1) &&
            level.currentLevel.indexOf(3) < (curBrick + brick.cols + 1)
        ) {
            level.currentLevel[level.currentLevel.indexOf(3)] = 0;
            // level.currentLevel[level.currentLevel.indexOf(5)] = 4;

            inventory.push(level.notation['SWORD']);
        }

    }
    attack() {

        if ((inventory.indexOf(level.notation['SWORD']) !== -1) && hero.swordChased === false) {
            hero.chaseSword();
            return;
        }

        if (!this.attacking) {
            if (this.turn === 'right') {
                this.swordAngleRotation = Math.PI / 4.5;
            } else {
                this.swordAngleRotation = -Math.PI / 4.5;
            }
        }
        this.attacking = true;
    }

    drawCharacter() {

        let imageToDraw = imagesByCell.find(function (el) {
            return el.notation === level.notation['HERO'];
        });

        let i = imageToDraw.useImg;
        let spriteW = 37, spriteH = 80;

        if (heldKeyLeft && !heldKeyRight) {
            startingY = 80;
        } else {
            if (!heldKeyLeft && heldKeyRight) {
                startingY = 0;
            }
        }

        ctx.save();
        ctx.drawImage(i, cycle * spriteW, startingY, spriteW, spriteH, this.x, this.y, spriteW, spriteH);
        ctx.restore();

        if ((heldKeyRight || heldKeyLeft) && (globalCounter % 2.5 === 0) && hero.onGround()) {
            cycle = (cycle + 1) % 8;
        }

        swordX = this.getSwordCoords(imageToDraw)['x'];
        swordY = this.getSwordCoords(imageToDraw)['y'];

        let swordToDraw = imagesByCell.find(function (el) {
            return el.notation === level.notation['SWORD'];
        });

        if (hero.hasSword()) {
            ctx.save();
            ctx.translate(swordX, swordY);
            ctx.rotate(hero.swordAngle);
            if (hero.swordChased) {
                ctx.drawImage(swordToDraw.useImg, 0, 0);
            }
            ctx.restore();
        }

    }

    getSwordCoords(imageToDraw) {
        let swordX =  inventory.indexOf('sword') !== -1 ? brick.width / 2 - imageToDraw.useImg.width / 2 : 0;

        if (hero.turn === 'right') {
            swordX = this.x + 25;
            swordY = this.y + 52;
        } else {
            swordX = this.x + 40 - hero.width;
            swordY = this.y + 55;
        }

        return {'x': swordX, 'y': swordY};
    }
}