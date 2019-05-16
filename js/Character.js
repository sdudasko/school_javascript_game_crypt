class Character {

    /**
     *
     * @param x - position
     * @param y - position
     * @param swordChased - has chased sword
     * @param hasSwordByDefault
     * @param turn - turn direction
     * @param walkSpeed
     * @param imgSrc
     */
    constructor(
        x, y, swordChased = false, hasSwordByDefault = false, turn = 'right', walkSpeed = 3, imgSrc, spawnLevel = 1
    ) {
        this.id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
        this.height = 80;
        this.width = 40;
        this.speedX = 0;
        this.speedY = 0;
        this.walkSpeed = walkSpeed;
        this.walkBackSpeed = -walkSpeed;

        this.startingY = 0;

        this.swordX = 0;
        this.swordY = 0;

        this.swordAngle = -Math.PI / 2;
        this.swordAngleRotation = 0;
        this.swordEndX = 0;
        this.swordChased = swordChased;
        this.hasSwordByDefault = hasSwordByDefault;

        this.turn = turn;
        this.imgSrc = imgSrc;

        this.x = x;
        this.y = y;

        this.jumping = false;
        this.attacking = false;

        if (this.constructor === Character) {
            throw new TypeError('Abstract class "Character" cannot be instantiated directly.');
        }
        this.health = 100;
        this.spawnLevel = spawnLevel;

    }

    attack() {

        if ((inventory.indexOf(level.notation['SWORD']) !== -1) && this.swordChased === false) {
            this.chaseSword();
            return;
        }

        if (!this.attacking) {
            // TODO - enemy sword angle handling
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

        if (this.imgSrc !== undefined) {
            imageToDraw = imagesByCell.find(function (el) {
                return el.notation === level.notation['ENEMY'];
            });
        }

        let i = imageToDraw.useImg;
        let spriteW = 37, spriteH = 80;

        if (this.type === 'enemy') {
            if (enemies.length !== 0)
                if (hero.x + 25 <= enemies[0].x) {
                    this.startingY = 80;
                } else {
                    this.startingY = 0;
                }
        } else {
            if (heldKeyLeft && !heldKeyRight) {
                this.startingY = 80;
            } else {
                if (!heldKeyLeft && heldKeyRight) {
                    this.startingY = 0;
                }
            }
        }

        ctx.save();
        ctx.drawImage(i, cycle * spriteW, this.startingY, spriteW, spriteH, this.x, this.y, spriteW, spriteH);
        ctx.restore();

        if ((heldKeyRight || heldKeyLeft) && (globalCounter % 2.5 === 0) && this.onGround()) {
            cycle = (cycle + 1) % 8;
        }

        this.swordX = this.getSwordCoords(imageToDraw)['x'];
        this.swordY = this.getSwordCoords(imageToDraw)['y'];

        let swordToDraw = imagesByCell.find(function (el) {
            return el.notation === level.notation['SWORD'];
        });

        if (this.hasSword()) {
            ctx.save();
            ctx.translate(this.swordX, this.swordY);
            ctx.rotate(this.swordAngle);
            if (this.swordChased) {
                ctx.drawImage(swordToDraw.useImg, 0, 0);
            }
            ctx.restore();
        }

    }

    jump(type = null, el) {
        if (type === 'enemy') {
            // enemies.forEach(function (e, i) {
                if (!el.jumping) {
                    el.speedY = -16;
                    el.jumping = true;
                }
            // });
        } else {
            if (!hero.jumping) {
                hero.speedY = -16;
                hero.jumping = true;
            }
        }
    }

    onGround() {

        let characterBrickCol = Math.floor(((this.x - 30 + this.width) / brick.width));
        let characterBrickRow = Math.floor(((this.y - (this.height / 2)) / brick.height)) + 2;

        let curBrick = rowColToArrayIndex(characterBrickCol, characterBrickRow);

        return level.currentLevel[curBrick] === 1;

    }

    hasSword() {
        if (!this.hasSwordByDefault) {
            return inventory.indexOf(level.notation['SWORD']) !== -1;
        }
        return true;
    }

    chaseSword(chase = true) {
        this.swordChased = chase;
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
            hero.speedX = this.walkBackSpeed;
        }

        if (enemies.length > 0) {
            this.enemyAIControl();

            enemies.forEach(function (e, i) {
                if (hero.y < e.y) {
                    e.jump('enemy', e);
                }
            })

        }

        if (heldKeyRight) {
            hero.speedX = this.walkSpeed;
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

        if (this.speedX <= 0 && this.onGround() && ((this.y + this.height - brick.height) % brick.height) !== 0) {
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

        this.handleAttack();

        this.swordAngle += this.swordAngleRotation;

        this.x += this.speedX;
        this.y += this.speedY;

        if (hero !== undefined) {
            if (hero.x === (canvas.width - hero.width + 3) && hero.turn === 'right') {
                level.set('currentLevel', level.levels[1]);
                hero.x = 0;
            }

            // We are on the left side of 2nd level
            if ((hero.x <= 0) && (level.currentLevel === level.levels[1]) && (hero.turn === 'left')) {
                level.set('currentLevel', level.levels[0]);
                hero.x = canvas.width - this.width;
            }
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
        swordTaken = true;

    }

    getSwordCoords(imageToDraw) {
        let swordX = inventory.indexOf('sword') !== -1 ? brick.width / 2 - imageToDraw.useImg.width / 2 : 0;

        if (this.turn === 'right') {
            this.swordX = this.x + 25;
            this.swordY = this.y + 52;
        } else {
            this.swordX = this.x + 40 - this.width;
            this.swordY = this.y + 55;
        }


        return {'x': this.swordX, 'y': this.swordY};
    }

    getXandYOfSwordEnd(xCoord, yCoord, angle, length, increaseToX, increaseToY = 0) {
        length = typeof length !== 'undefined' ? length : 10;
        angle = angle * Math.PI / 180; // if you're using degrees instead of radians
        return {
            x: length * Math.cos(angle + increaseToX) + xCoord,
            y: length * Math.sin(angle + increaseToY) + yCoord
        }
    }

    radians_to_degrees(radians) {
        var pi = Math.PI;
        return radians * (180 / pi);
    }

    enemyAIControl() {
        let self = this;
        if (enemies.length > 0) {
            enemies.forEach(function (element, index) {
                if (
                    hero.x + 80 <= element.x
                ) { // 80 - sword length
                    element.turn = 'left';
                    element.speedX = self.walkBackSpeed;

                } else if (hero.x - 75 > element.x) {
                    element.turn = 'right';
                    element.speedX = self.walkSpeed;
                }
            });
        }
    }

}