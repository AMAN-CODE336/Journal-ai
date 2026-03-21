import express from 'express'
import protect from '../middleware/auth.js'
import Entry from '../models/Entry.js'
import { getSuggestions } from '../services/suggestionService.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user.id }).select('title plainText ai')
    if (entries.length < 2) return res.status(400).json({ message: 'Write at least 2 entries to get suggestions' })
    const suggestions = await getSuggestions(entries)
    res.json(suggestions)
  } catch (error) {
        console.error('Suggestion error:', error) // ADD THIS
    res.status(500).json({ message: 'Failed to generate suggestions' })
  }
})

export default router