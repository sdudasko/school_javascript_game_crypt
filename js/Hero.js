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

                let self = this;
                enemies.forEach(function (enemy, index) {
                    if (enemy.turn === 'left') {
                        if (
                            swordCoordsWhenAttacking['x'] >= enemy.x - enemy.width &&
                            (
                                swordCoordsWhenAttacking['y'] <= enemy.y + enemy.height && // We are higher or on the same height as the enemy
                                swordCoordsWhenAttacking['y'] > enemy.y - enemy.height
                            )
                        ) {
                            self.hit(enemy);
                        }
                    } else {
                        if (enemies.length > 0)
                            if (
                                swordCoordsWhenAttacking['x'] >= enemy.x &&
                                (
                                    swordCoordsWhenAttacking['y'] <= enemy.y + enemy.height && // We are higher or on the same height as the enemy
                                    swordCoordsWhenAttacking['y'] > enemy.y - enemy.height
                                )
                            ) {
                                self.hit(enemy);
                            }
                    }
                });

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

                let self = this;
                enemies.forEach(function (enemy, index) {
                    if (enemies.length > 0 && enemy.turn === 'left') {
                        if (
                            (
                                swordCoordsWhenAttacking['x'] <= enemy.x + enemy.width &&
                                swordCoordsWhenAttacking['x'] + self.width >= enemy.x
                            ) && (
                                swordCoordsWhenAttacking['y'] <= enemy.y + enemy.height && // We are higher or on the same height as the enemy
                                swordCoordsWhenAttacking['y'] > enemy.y - enemy.height
                            )
                        ) {
                            self.hit(enemy);
                        }
                    } else {
                        if (enemies.length > 0)
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
                                self.hit(enemy);
                            }
                    }
                });
            }
        }
    }

    hit(enemy) {
        if (this.swordChased) {
            let foundEnemy = enemies.find(o => o.id === enemy.id);
            let foundEnemyIndex = enemies.indexOf(foundEnemy);

            if (level.currentLevel === level.levels[1]) {
                foundEnemy.health -= 5;
                enemy_health.value = foundEnemy.health;
            }

            if (foundEnemy.health <= 0) {
                enemies.splice(foundEnemyIndex, 1);

            }
            if (enemies.length === 0) {
                enemy_health.value = 100;
                currentLevel++;
                writeWaveNum = true;
                setTimeout(function() {
                    for (let i = 1; i <= currentLevel * 2; i++) {
                        console.log(Math.random());
                        let xPos = (Math.random() * 7) * 100;
                        let yPos = (Math.random() * 3) * 100;
                        console.log(xPos);

                        enemies.push(
                            new Enemy(
                                xPos, yPos, true, true, 'left', 2, 'enemy_anim_spread2.png', 2
                            ),
                        );
                    }
                }, 4000);
            }
        }
    }
}