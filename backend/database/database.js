const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config()
const DATABASE_URI = process.env.DATABASE_URI

let db;

// This function can be imported and used in any other files that require a database connection,
// This avoids repeated code
async function connectToDatabase() {
  if (db) return db // return existing db connection if already connected

  const client = new MongoClient(DATABASE_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })

  try {
    await client.connect()
    db = client.db('asteroid-explorer-db')
    console.log(
      'Pinged your deployment. Successfully connected to MongoDB!'
    )
    return db
  } catch (error) {
    console.error('Error connecting to the database', error)
    throw error;
  }
}

module.exports = { connectToDatabase, db }
