const mongoose = require('mongoose')

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO)
    console.log('Connected to mongoDB.')
  } catch (error) {
    throw error
  }
}

connect()

mongoose.connection.on('disconnected', () => {
  console.log('mongoDB disconnected!')
})
