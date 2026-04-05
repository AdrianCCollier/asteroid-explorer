// ScoreSystem displays the current score in game
class ScoreSystem {
  constructor(scene) {
    this.scene = scene;
    this.points = 0;
    localStorage.setItem('playerPoints', '0');

    // Set up the points display text
    this.pointsText = this.scene.add.text(0, 0, 'Score: ' + this.points, {
      font: '32px Arial',
      fill: '#ffffff',
    });
    this.pointsText.setScrollFactor(0);
    this.pointsText.setDepth(1000);
    
    // Position the points display
    this.setPosition();
  }

  setPosition() {
    this.pointsText.setPosition(
      this.scene.cameras.main.width - this.pointsText.width - 100,
      10
    )
  }

  increasePoints(points) {
    this.points += points
    this.pointsText.setText('Score: ' + this.points)
  }

  resetPoints() {
    this.points = 0
    this.pointsText.setText('Score: ' + this.points)
  }

  canAfford(amount) {
    return this.points >= amount
  }

  spendPoints(amount) {
    if (this.canAfford(amount)) {
      this.points -= amount
      this.pointsText.setText('Score: ' + this.points)
      return true // Purchase successful
    } else {
      // Handle case where there are not enough points
      console.log('Not enough points to make this purchase')
      return false // Purchase failed
    }
  }

  getCurrentPoints() {
    return this.points
  }
}

export default ScoreSystem
