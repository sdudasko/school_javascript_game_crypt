class Enemy extends Character
{
    constructor(...props) {
        super(...props);

        this.type = 'enemy';
    }

    handleAttack() {
        if (this.attacking) {
            let swordCoordsWhenAttacking;

            if (this.turn === 'right') {

                swordCoordsWhenAttacking = this.getXandYOfSwordEnd(
                    this.swordX,
                    this.swordY,
                    this.radians_to_degrees(this.swordAngleRotation) + 225, // Not sure why 225 lul, works tho :D
                    63,
                    180
                );
                this.swordAngleRotation -= Math.PI / 30;

                if (this.swordAngleRotation <= -Math.PI / 6) {

                    this.swordAngleRotation = 0;
                    this.swordAngle = -Math.PI / 2;
                    this.attacking = false;
                }

                if (hero.turn === 'left') {
                    if (
                        swordCoordsWhenAttacking['x'] >= hero.x - hero.width &&
                        (
                            swordCoordsWhenAttacking['y'] <= hero.y + hero.height && // We are higher or on the same height as the hero
                            swordCoordsWhenAttacking['y'] > hero.y - hero.height
                        )
                    ) {
                        this.hit();
                    }
                } else {
                    if (
                        swordCoordsWhenAttacking['x'] >= hero.x &&
                        (
                            swordCoordsWhenAttacking['y'] <= hero.y + hero.height && // We are higher or on the same height as the hero
                            swordCoordsWhenAttacking['y'] > hero.y - hero.height
                        )
                    ) {
                        this.hit();
                    }
                }

            } else {

                swordCoordsWhenAttacking = this.getXandYOfSwordEnd(
                    this.swordX,
                    this.swordY,
                    this.radians_to_degrees(this.swordAngleRotation),
                    63,
                    -180, // - PI due to starting angle of sword
                    -45
                );

                this.swordAngleRotation += Math.PI / 30;

                if (this.swordAngleRotation >= Math.PI / 6) {

                    this.swordAngleRotation = 0;
                    this.swordAngle = -Math.PI / 2;
                    this.attacking = false;
                }

                if (hero.turn === 'left') {
                    if (
                        (
                            swordCoordsWhenAttacking['x'] <= hero.x + hero.width &&
                            swordCoordsWhenAttacking['x'] + this.width >= hero.x
                        ) && (
                            swordCoordsWhenAttacking['y'] <= hero.y + hero.height && // We are higher or on the same height as the hero
                            swordCoordsWhenAttacking['y'] > hero.y - hero.height
                        )
                    ) {
                        this.hit();
                    }
                } else {
                    if (
                        (
                            swordCoordsWhenAttacking['x'] >= hero.x &&
                            swordCoordsWhenAttacking['x'] < hero.x + hero.width
                        ) &&
                        (
                            swordCoordsWhenAttacking['y'] <= hero.y + hero.height && // We are higher or on the same height as the hero
                            swordCoordsWhenAttacking['y'] > hero.y - hero.height
                        )
                    ) {
                        this.hit();
                    }
                }
            }
        }
    }
    hit() {
        for( var i = 0; i < inventory.length; i++) {
            if ( inventory[i] === 7) {
                inventory.splice(i, 1);
                break;
            }
        }
        console.log('You got hit');

    }
}