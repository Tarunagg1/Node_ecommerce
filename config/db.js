const mongoose = require('mongoose')

const connect = async () => {
  await mongoose.connect(process.env.MONGO)
  console.log('Connected to mongoDB.')
}

connect()

mongoose.connection.on('disconnected', () => {
  console.log('mongoDB disconnected!')
})

module.exports = mongoose.connection
