let sword_width = 13;

class Hero extends Character {

    constructor(...props) {
        super(...props);

        this.type = 'hero';
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

                if (enemy.turn === 'left') {
                    if (
                        swordCoordsWhenAttacking['x'] >= enemy.x - enemy.width &&
                        (
                            swordCoordsWhenAttacking['y'] <= enemy.y + enemy.height && // We are higher or on the same height as the enemy
                            swordCoordsWhenAttacking['y'] > enemy.y - enemy.height
                        )
                    ) {
                        this.hit();
                    }
                } else {
                    if (
                        swordCoordsWhenAttacking['x'] >= enemy.x &&
                        (
                            swordCoordsWhenAttacking['y'] <= enemy.y + enemy.height && // We are higher or on the same height as the enemy
                            swordCoordsWhenAttacking['y'] > enemy.y - enemy.height
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

                if (enemy.turn === 'left') {
                    if (
                        (
                            swordCoordsWhenAttacking['x'] <= enemy.x + enemy.width &&
                            swordCoordsWhenAttacking['x'] + this.width >= enemy.x
                        ) && (
                            swordCoordsWhenAttacking['y'] <= enemy.y + enemy.height && // We are higher or on the same height as the enemy
                            swordCoordsWhenAttacking['y'] > enemy.y - enemy.height
                        )
                    ) {
                        this.hit();
                    }
                } else {
                    if (
                        (
                            swordCoordsWhenAttacking['x'] >= enemy.x &&
                            swordCoordsWhenAttacking['x'] < enemy.x + enemy.width
                        ) &&
                        (
                            swordCoordsWhenAttacking['y'] <= enemy.y + enemy.height && // We are higher or on the same height as the enemy
                            swordCoordsWhenAttacking['y'] > enemy.y - enemy.height
                        )
                    ) {
                        this.hit();
                    }
                }
            }
        }
    }

    hit() {
        console.log('Enemy got hit!');
    }
}