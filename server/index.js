import dotenv from 'dotenv'
dotenv.config()
// console.log('ENV CHECK:', process.env.GEMINI_API_KEY)
import express from 'express'
import connectDB from './config/db.js'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import entryRoutes from './routes/entryRoutes.js'
import suggestionRoutes from './routes/suggestionRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import userRoutes from './routes/userRoutes.js'
import rateLimit from 'express-rate-limit'

// General rate limit — all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 mins
  message: { message: 'Too many requests, please try again later.' }
})

// Strict rate limit — AI routes only
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 AI requests per hour
  message: { message: 'AI request limit reached. Please wait before trying again.' }
})

const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
// Apply general limit to all routes
app.use(generalLimiter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'JournalAI server is alive 🚀' })
})
app.get('/api/models', async (req, res) => {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const models = await genAI.listModels()
  res.json(models)
})

app.use('/api/suggestions', suggestionRoutes , aiLimiter)

 app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/entries', entryRoutes)
app.use('/api/chat', chatRoutes , aiLimiter)

connectDB()

app.listen(process.env.PORT || 5000, () => console.log(`✅ Server running on port 5000`))
