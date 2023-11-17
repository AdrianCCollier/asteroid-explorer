class Inventory {
  constructor() {
    this.unlockedItems = []
    this.loadProgress()
  }

  // push an item into our unlockedItems array if it already isn't present, and save it to local storage
  unlockItem(item) {
    if (!this.unlockedItems.includes(item)) {
      this.unlockedItems.push(item)
    }
    this.saveProgress()
  }

  // returns a boolean, if our item is unlocked (present in unlockedItems array)
  isItemUnlocked(item) {
    return this.unlockedItems.includes(item)
  }

  // print out entire unlockedItems array
  getAllUnlockedItems() {
    return this.unlockedItems;
  }

  // save unlockedItems array into local storage with key 'weapon', to view this open console developer tools -> application -> Local Storage -> localhost:3001
  saveProgress() {
    localStorage.setItem('weapon', JSON.stringify(this.unlockedItems))
    localStorage.setItem('pistol', JSON.stringify(true))
    localStorage.setItem('ar', JSON.stringify(false))
    localStorage.setItem('shotgun', JSON.stringify(false))

    localStorage.setItem('equipped', JSON.stringify("ar"));
  }

  // fetch unlockedItems array from local storage
  loadProgress() {
    const savedProgress = localStorage.getItem('weapon')
    if (savedProgress) {
      this.unlockedItems = JSON.parse(savedProgress) || []
    }
  }
  
}

const instance = new Inventory()
export default instance
