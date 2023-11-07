import Phaser from 'phaser';

class WinScene extends Phaser.Scene {
  constructor() {
      super({ key: 'WinScene' });
  }

  create() {
      // Adding a semi-transparent background
      const rect = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, 400, 200, 0x000000);
      rect.setAlpha(0.8);
      
      // Adding a title
      const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'Nice Job! Returning to orbit', { color: '#ffffff', fontSize: '20px' });
      title.setOrigin(0.5, 0.5); // Centering text

      this.time.delayedCall(3000, () => {
        // Redirect to '/' after 3 seconds (3000 milliseconds)
        window.location.href = '/solarSystem';
      }, [], this);
      
      /*// Styling Yes Button
      const yesButton = this.add.text(this.cameras.main.width / 2 - 70, this.cameras.main.height / 2 + 20, 'Yes', { fill: '#0f0', fontSize: '32px', padding: { x: 20, y: 10 }, backgroundColor: '#000000' })
          .setInteractive()
          .on('pointerdown', () => {
              this.scene.stop();
              this.scene.start('SidescrollerScene');
          })
          .on('pointerover', () => yesButton.setBackgroundColor('#555555')) // Changing background color when hovered
          .on('pointerout', () => yesButton.setBackgroundColor('#000000')); // Changing background color back when not hovered
      
      // Styling No Button
      const noButton = this.add.text(this.cameras.main.width / 2 + 70, this.cameras.main.height / 2 + 20, 'No', { fill: '#f00', fontSize: '32px', padding: { x: 20, y: 10 }, backgroundColor: '#000000' })
          .setInteractive()
          .on('pointerdown', () => {
              this.scene.stop();
              window.location.href = '/'; // Change the URL to '/'
          })
          .on('pointerover', () => noButton.setBackgroundColor('#555555')) // Changing background color when hovered
          .on('pointerout', () => noButton.setBackgroundColor('#000000')); // Changing background color back when not hovered*/
  }
}

export default WinScene;