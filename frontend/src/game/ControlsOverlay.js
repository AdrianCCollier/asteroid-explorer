export default class ControlsOverlay {
  constructor(scene) {
    this.scene = scene
    this.createControlsOverlay()
  }

  createControlsOverlay() {
    // Create a semi-transparent rectangle as the background for the controls overlay
    this.controlsOverlay = this.scene.add
      .rectangle(
        0,
        0, // Temporary zero position, will set in update
        350,
        150, // Width and height of the rectangle
        0x000000,
        0.5 // Black color, 50% opacity
      )
      .setOrigin(-0.2, -0.45)

    this.controlsOverlay.setScrollFactor(0)
    this.controlsOverlay.setDepth(1000)

    // Add text instructions on the overlay
    this.controlsText = this.scene.add
      .text(
        0,
        0,
        'Move Left -> A\nMove Right -> D\nJump -> Space Bar\nBoost Jump -> Double Space Bar\nAim -> Mouse\nShoot -> Left Mouse Click',
        {
          font: '22px Arial',
          fill: '#FFFFFF',
          align: 'left',
        }
      )
      .setOrigin(-0.25, -0.5)

    this.controlsText.setScrollFactor(0)
    this.controlsText.setDepth(1001) // Slightly higher than the rectangle

    // Schedule the overlay and text to disappear after 10 seconds
    this.scene.time.delayedCall(
      10000,
      () => {
        this.controlsOverlay.setVisible(false)
        this.controlsText.setVisible(false)
      },
      [],
      this
    )
  }

  updatePosition(x, y) {
    this.controlsOverlay.x = x
    this.controlsOverlay.y = y
    this.controlsText.x = x
    this.controlsText.y = y
  }
}
