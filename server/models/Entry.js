import mongoose from 'mongoose'

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  plainText: {
    type: String
  },
  date: { type: Date, default: Date.now },
  tags: [String],
  ai: {
    summary: String,
    topics: [String],
    quizzes: [{
      question: String,
      answer: String
    }],
    insight: String,
     mood: {
    label: String,      // happy, sad, anxious, motivated, tired, focused
    emoji: String,      // 😊 😔 😤 💪 😴 🎯
    score: Number       // 1-10
  },
    processedAt: Date
  },
  meta: {
    wordCount: Number,
    readingTime: Number
  }
}, { timestamps: true })

export default mongoose.model('Entry', entrySchema)