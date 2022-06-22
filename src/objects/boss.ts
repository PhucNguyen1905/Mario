import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { Hammer } from './hammer';

export class Boss extends Enemy {
    body: Phaser.Physics.Arcade.Body;
    hammers: Phaser.GameObjects.Group;
    THROWING_TIME: number = 1000;
    countThrow: number = 0;

    constructor(aParams: ISpriteConstructor) {
        super(aParams);
        this.speed = -20;
        this.dyingScoreValue = 1500;
        this.body.setSize(32, 36)
        this.initHammers();
    }
    initHammers() {
        this.hammers = this.currentScene.add.group({
            /*classType: Portal,*/
            runChildUpdate: true
        });
    }
    getHammers() {
        return this.hammers;
    }

    update(time: number, delta: number): void {
        if (!this.isDying) {
            if (this.isActivated) {
                // boss is still alive
                // add speed to velocity x
                this.body.setVelocityX(this.speed);
                this.countThrow += delta;
                console.log(delta)
                if (this.countThrow > this.THROWING_TIME) {
                    this.throwHammer();
                    this.countThrow = 0;
                }

                // if boss is moving into obstacle from map layer, turn
                if (this.body.blocked.right || this.body.blocked.left) {
                    this.setFlipX(this.body.velocity.x < 0);
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
    throwHammer() {
        const hammer = new Hammer({ scene: this.currentScene, x: this.x, y: this.y, texture: 'hammer' });
        this.hammers.add(hammer);
    }
}
