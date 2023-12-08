const { connectToDatabase } = require('./database.js')

// This function connects to the database, and inserts a new player.
async function addPlayer(player) {
  const db = await connectToDatabase();
  const playerCollection = db.collection('players');
  try {
    const result = await playerCollection.insertOne(player);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { addPlayer };
