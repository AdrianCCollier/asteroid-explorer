class Inventory {
  constructor() {
    this.unlockedItems = []
    this.loadProgress()
  }

  unlockItem(item) {
    if (!this.unlockedItems.includes(item)) {
      this.unlockedItems.push(item)
    }
    this.saveProgress()
  }

  isItemUnlocked(item) {
    return this.unlockedItems.includes(item)
  }

  saveProgress() {
    localStorage.setItem('weapon', JSON.stringify(this.unlockedItems))
  }

  loadProgress() {
    const savedProgress = localStorage.getItem('weapon')
    if (savedProgress) {
      this.unlockedItems = JSON.parse(savedProgress) || []
    }
  }
}

const instance = new Inventory()
export default instance
