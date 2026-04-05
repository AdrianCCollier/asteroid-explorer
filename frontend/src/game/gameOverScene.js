import Phaser from 'phaser';

// GameOverScene appears when a player dies, A black screen appears with the window text box, giving the player the option to try again, or return back to the main menu
class GameOverScene extends Phaser.Scene {
  constructor() {
      super({ key: 'GameOverScene' });
      this.nextSceneKey = 'test';
  }

  init(data) {
    if (data && data.gameScene) {
      this.nextSceneKey = data.gameScene;
    }
    this.score = (data && data.score) ? data.score : '0'
    this.kills = (data && data.kills !== undefined) ? data.kills : 0
  }

  create() {
      this.cameras.main.fadeIn(400, 0, 0, 0)

      const cx = this.cameras.main.width / 2
      const cy = this.cameras.main.height / 2

      // Adding a semi-transparent background
      const rect = this.add.rectangle(cx, cy, 420, 280, 0x000000);
      rect.setAlpha(0.8);

      // Adding a title
      const title = this.add.text(cx, cy - 90, 'Game Over. Want To Try Again?', { color: '#ffffff', fontSize: '20px' });
      title.setOrigin(0.5, 0.5);

      this.add.text(cx, cy - 40, `Score: ${this.score}`, { color: '#ffdd00', fontSize: '22px' }).setOrigin(0.5, 0.5)
      this.add.text(cx, cy, `Enemies Defeated: ${this.kills}`, { color: '#aaffaa', fontSize: '18px' }).setOrigin(0.5, 0.5)
      
      // Styling Yes Button
      const yesButton = this.add.text(cx - 70, cy + 60, 'Yes', { fill: '#0f0', fontSize: '32px', padding: { x: 20, y: 10 }, backgroundColor: '#000000' })
          .setInteractive()
          .on('pointerdown', () => {
              this.scene.stop();
              this.scene.start(this.nextSceneKey);
          })
          .on('pointerover', () => yesButton.setBackgroundColor('#555555')) // Changing background color when hovered
          .on('pointerout', () => yesButton.setBackgroundColor('#000000')); // Changing background color back when not hovered
      
      // Styling No Button
      const noButton = this.add.text(cx + 70, cy + 60, 'No', { fill: '#f00', fontSize: '32px', padding: { x: 20, y: 10 }, backgroundColor: '#000000' })
          .setInteractive()
          .on('pointerdown', () => {
              this.scene.stop();
              window.location.href = '/solarSystem'; // Change the URL to '/'
          })
          .on('pointerover', () => noButton.setBackgroundColor('#555555')) // Changing background color when hovered
          .on('pointerout', () => noButton.setBackgroundColor('#000000')); // Changing background color back when not hovered
  }
}

export default GameOverScene;