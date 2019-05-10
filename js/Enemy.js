class Enemy extends Character
{
    constructor(...props) {
        super(...props);

        this.type = 'enemy';
    }

    handleAttack() {
        if (this.attacking) {

            let swordCoordsWhenAttacking = this.getXandYOfSwordEnd(
                this.swordX,
                this.swordY,
                this.radians_to_degrees(this.swordAngleRotation) + 225, // Not sure why 225 lul, works tho :D
                63
            );
            // console.log(swordCoordsWhenAttacking['y'], enemy.y + 63);
            if (this.turn === 'right') {
                this.swordAngleRotation -= Math.PI / 30;

                if (this.swordAngleRotation <= - Math.PI / 6) {

                    this.swordAngleRotation = 0;
                    this.swordAngle = - Math.PI / 2;
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
                    if (swordCoordsWhenAttacking['x'] >= enemy.x + enemy.width + 15) {
                    }
                }

            } else {
                this.swordAngleRotation += Math.PI / 30;

                if (this.swordAngleRotation >= Math.PI / 6) {

                    this.swordAngleRotation = 0;
                    this.swordAngle = - Math.PI / 2;
                    this.attacking = false;
                }
            }
        }
    }
    hit() {
        console.log('I got hit! :(');
    }
}