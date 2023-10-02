const { connectToDatabase } = require('./database.js')

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
