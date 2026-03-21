import mongoose from 'mongoose'

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected')
    })
    .catch(() => {
      console.log('⚠️ DB not connected')
    })
}

export default connectDB