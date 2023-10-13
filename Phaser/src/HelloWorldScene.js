import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
    constructor() {
        super('hello-world');
    }

    preload() {
        this.load.image('tiles', 'assets/nightsky.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.image('player', './assets/Skeleton.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tiles1', 'tiles');
        const layer = map.createLayer('surface', tileset, 0, 0);

        this.player = this.physics.add.sprite(100, 450, 'player');
        this.physics.add.collider(this.player, layer);
        layer.setCollisionBetween(148, 149);

        // Camera setup
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Key bindings
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        const speed = 150;
        
        this.player.setVelocityX(0);

        if (this.aKey.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.dKey.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.spaceKey.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-650);
        }
    }
}
