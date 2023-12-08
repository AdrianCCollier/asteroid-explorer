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
      
  }
}

export default WinScene;