import Phaser from 'phaser';

// WinScene appears when a player defeats a boss, message displays, then is rerouted back to the main menu after 3 seconds
class WinScene extends Phaser.Scene {
  constructor() {
      super({ key: 'WinScene' });
  }

  init(data) {
    this.score = (data && data.score) ? data.score : '0'
    this.kills = (data && data.kills !== undefined) ? data.kills : 0
  }

  create() {
      this.cameras.main.fadeIn(400, 0, 0, 0)

      const cx = this.cameras.main.width / 2
      const cy = this.cameras.main.height / 2

      // Adding a semi-transparent background
      const rect = this.add.rectangle(cx, cy, 420, 240, 0x000000);
      rect.setAlpha(0.8);

      this.add.text(cx, cy - 80, 'Nice Job! Returning to orbit', { color: '#ffffff', fontSize: '20px' }).setOrigin(0.5, 0.5)
      this.add.text(cx, cy - 20, `Score: ${this.score}`, { color: '#ffdd00', fontSize: '22px' }).setOrigin(0.5, 0.5)
      this.add.text(cx, cy + 30, `Enemies Defeated: ${this.kills}`, { color: '#aaffaa', fontSize: '18px' }).setOrigin(0.5, 0.5)

      this.time.delayedCall(3000, () => {
        window.location.href = '/solarSystem';
      }, [], this);
  }
}

export default WinScene;
