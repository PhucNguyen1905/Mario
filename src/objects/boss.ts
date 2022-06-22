import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Boss extends Enemy {
    body: Phaser.Physics.Arcade.Body;

    constructor(aParams: ISpriteConstructor) {
        super(aParams);
        this.speed = -20;
        this.dyingScoreValue = 1000;
        this.body.setSize(32, 36)
    }

    update(): void {
        if (!this.isDying) {
            if (this.isActivated) {
                // boss is still alive
                // add speed to velocity x
                this.body.setVelocityX(this.speed);

                // if boss is moving into obstacle from map layer, turn
                if (this.body.blocked.right || this.body.blocked.left) {
                    this.setFlipX(true);
                    this.speed = -this.speed;
                    this.body.velocity.x = this.speed;
                }

                // apply walk animation
                this.anims.play('bossWalk', true);
            } else {
                if (
                    Phaser.Geom.Intersects.RectangleToRectangle(
                        this.getBounds(),
                        this.currentScene.cameras.main.worldView
                    )
                ) {
                    this.isActivated = true;
                }
            }
        } else {
            // boss is dying, so stop animation, make velocity 0 and do not check collisions anymore
            this.anims.stop();
            this.body.setVelocity(0, 0);
            this.body.checkCollision.none = true;
        }
    }

    public gotHitOnHead(): void {
        this.isDying = true;
        this.setFrame(7);
        this.showAndAddScore();
    }

    protected gotHitFromBulletOrMarioHasStar(): void {
        this.isDying = true;
        this.body.setVelocityX(20);
        this.body.setVelocityY(-20);
        this.setFlipY(true);
    }

    public isDead(): void {
        this.destroy();
    }
}
