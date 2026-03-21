import express from 'express'
import protect from '../middleware/auth.js'
import Entry from '../models/Entry.js'
import { streamChat } from '../services/chatService.js'

const router = express.Router()

router.post('/', protect, async (req, res) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ message: 'Message is required' })

    const entries = await Entry.find({ userId: req.user.id }).select('title plainText createdAt')
    if (entries.length === 0) return res.status(400).json({ message: 'No entries found' })

    // Set streaming headers — keeps connection open
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    await streamChat(entries, message, res)

  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ message: 'Failed to process chat' })
  }
})

export default router