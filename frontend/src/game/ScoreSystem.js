class ScoreSystem {
  constructor(scene) {
    this.scene = scene;
    // Try to read the score from local storage, default to 0 if not found
    const savedScore = localStorage.getItem('gameScore');
    this.points = savedScore ? parseInt(savedScore, 10) : 0;

    // Set up the points display text
    this.pointsText = this.scene.add.text(0, 0, 'Points: ' + this.points, {
      fontSize: '32px',
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
    this.pointsText.setText('Points: ' + this.points)
  }

  resetPoints() {
    this.points = 0
    this.pointsText.setText('Points: ' + this.points)
  }

  canAfford(amount) {
    return this.points >= amount
  }

  spendPoints(amount) {
    if (this.canAfford(amount)) {
      this.points -= amount
      this.pointsText.setText('points: ' + this.points)
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
