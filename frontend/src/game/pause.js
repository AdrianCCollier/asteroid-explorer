import Phaser from 'phaser';

class PauseScene extends Phaser.Scene {
  constructor() {
      super({ key: 'PauseScene' });
      this.nextSceneKey = 'test';
  }

  init(data) {
    if (data && data.gameScene) {
      this.gameScene = data.gameScene;
    }
  }

  create() {
    console.log(this.gameScene.player.chaseCount);
    this.gameScene.scene.pause();

    if (this.gameScene.player.bossChase) {
      // Adding a semi-transparent background
      this.pauseOverlay = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0x000000);
      this.pauseOverlay.setAlpha(0.44);

      this.pauseOverlay2 = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width * .65, this.cameras.main.height / 4 + 200, 0x000000);
      this.pauseOverlay2.setAlpha(0.80);

      // Adding a title
      this.title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 125, 'YOUR FIGHTING ONE OF THE BIG 4!!!', { color: '#ffffff', fontSize: '24px' });
      // Set the origin to center the text
      this.title.setOrigin(0.5, 0.5); // Centering text

      // Adding second title row
      this.title2 = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 90, 'YOU CAN\T JUST LEAVE!!!', { color: '#ffffff', fontSize: '24px' });
      // Set the origin to center the text
      this.title2.setOrigin(0.5, 0.5);

      // Adding third title row
      this.title3 = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 55, 'RETURN!?!?!?!', { color: '#ffffff', fontSize: '24px' });
      // Set the origin to center the text
      this.title3.setOrigin(0.5, 0.5);


      // Styling Yes Button
      this.yesButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 25, 'Yes', { fill: '#0f0', fontSize: '32px', padding: { x: 20, y: 10 }, backgroundColor: '#000000' })
      .setInteractive()
      .on('pointerdown', () => {
        this.gameScene.scene.resume();
        this.pauseOverlay.destroy();
        this.pauseOverlay2.destroy();
        this.title.destroy();
        this.title2.destroy();
        this.title3.destroy();
        this.yesButton.destroy();
      })
      .on('pointerover', () => this.yesButton.setBackgroundColor('#555555')) // Changing background color when hovered
      .on('pointerout', () => this.yesButton.setBackgroundColor('#000000')); // Changing background color back when not hovered

      this.yesButton.setOrigin(0.5, 0.5)
    } 
    else {
      if (this.gameScene.player.chaseCount != 0) {
        // Adding a semi-transparent background
        this.pauseOverlay = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0x000000);
        this.pauseOverlay.setAlpha(0.44);

        this.pauseOverlay2 = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width * .65, this.cameras.main.height / 4 + 200, 0x000000);
        this.pauseOverlay2.setAlpha(0.80);

        // Adding a title
        this.title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 125, 'ERROR CAN\'T LEAVE ASTEROID!!!', { color: '#ffffff', fontSize: '24px' });
        // Set the origin to center the text
        this.title.setOrigin(0.5, 0.5); // Centering text

        // Adding second title row
        this.title2 = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 90, 'ALIEN(S) CHASING YOU!!!', { color: '#ffffff', fontSize: '24px' });
        // Set the origin to center the text
        this.title2.setOrigin(0.5, 0.5);

        // Adding third title row
        this.title3 = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 55, 'RETURN???', { color: '#ffffff', fontSize: '24px' });
        // Set the origin to center the text
        this.title3.setOrigin(0.5, 0.5);


        // Styling Yes Button
        this.yesButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 25, 'Yes', { fill: '#0f0', fontSize: '32px', padding: { x: 20, y: 10 }, backgroundColor: '#000000' })
        .setInteractive()
        .on('pointerdown', () => {
          this.gameScene.scene.resume();
          this.pauseOverlay.destroy();
          this.pauseOverlay2.destroy();
          this.title.destroy();
          this.title2.destroy();
          this.title3.destroy();
          this.yesButton.destroy();
        })
        .on('pointerover', () => this.yesButton.setBackgroundColor('#555555')) // Changing background color when hovered
        .on('pointerout', () => this.yesButton.setBackgroundColor('#000000')); // Changing background color back when not hovered

        this.yesButton.setOrigin(0.5, 0.5)
      } 
      else {
        // Adding a semi-transparent background
        this.pauseOverlay = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0x000000);
        this.pauseOverlay.setAlpha(0.44);

        this.pauseOverlay2 = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width * .65, this.cameras.main.height / 4 + 200, 0x000000);
        this.pauseOverlay2.setAlpha(0.80);

        // Adding a title
        this.title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 135, 'Leave the asteroid?', { color: '#ffffff', fontSize: '36px' });
        // Set the origin to center the text
        this.title.setOrigin(0.5, 0.5); // Centering text

        // Adding second title row
        this.title2 = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 90, 'This will save your points,', { color: '#ffffff', fontSize: '20px' });
        // Set the origin to center the text
        this.title2.setOrigin(0.5, 0.5);

        // Adding third title row
        this.title3 = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 55, 'and you can always come back later.', { color: '#ffffff', fontSize: '20px' });
        // Set the origin to center the text
        this.title3.setOrigin(0.5, 0.5);

        // Styling Yes Button
        this.yesButton = this.add.text(this.cameras.main.width / 2 - 75, this.cameras.main.height / 2 + 25, 'Yes', { fill: '#0f0', fontSize: '32px', padding: { x: 20, y: 10 }, backgroundColor: '#000000' })
          .setInteractive()
          .on('pointerdown', () => {
            this.gameScene.scene.stop();
            window.location.href = '/solarSystem';
          })
          .on('pointerover', () => this.yesButton.setBackgroundColor('#555555')) // Changing background color when hovered
          .on('pointerout', () => this.yesButton.setBackgroundColor('#000000')); // Changing background color back when not hovered

        this.yesButton.setOrigin(0.5, 0.5)

        // Styling No Button
        this.noButton = this.add.text(this.cameras.main.width / 2 + 75, this.cameras.main.height / 2 + 25, 'No', { fill: '#f00', fontSize: '32px', padding: { x: 20, y: 10 }, backgroundColor: '#000000' })
          .setInteractive()
          .on('pointerdown', () => {
            this.gameScene.scene.resume();
            this.pauseOverlay.destroy();
            this.pauseOverlay2.destroy();
            this.title.destroy();
            this.title2.destroy();
            this.title3.destroy();
            this.yesButton.destroy();
            this.noButton.destroy();
          })
          .on('pointerover', () => this.noButton.setBackgroundColor('#555555')) // Changing background color when hovered
          .on('pointerout', () => this.noButton.setBackgroundColor('#000000')); // Changing background color back when not hovered

        this.noButton.setOrigin(0.5, 0.5)
      }
    }
  }
}

export default PauseScene;