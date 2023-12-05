const mongoose = require('mongoose')

const uri =
  'mongodb+srv://AsteroidExplorer:KXtGYjRqonPAOy81@asteroid-explorer.q3dn9n7.mongodb.net/?retryWrites=true&w=majority'

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful!'))
  .catch((err) => console.error('MongoDB connection error:', err))

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err)
})
