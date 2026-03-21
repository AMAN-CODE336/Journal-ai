import Entry from '../models/Entry.js'
import { processEntry } from '../services/aiService.js'

export const createEntry = async (req, res) => {
  try {
    const { title, content, plainText } = req.body
    const entry = await Entry.create({
      userId: req.user.id,
      title,
      content,
      plainText,
        date: date || Date.now(),
      meta: {
        wordCount: plainText.split(' ').length,
        readingTime: Math.ceil(plainText.split(' ').length / 200)
      }
    })

    res.status(201).json(entry)

    processEntry(plainText).then(async (aiData) => {
      await Entry.findByIdAndUpdate(entry._id, {
        ai: { ...aiData, processedAt: new Date() }
      })
    }).catch(err => console.error('AI processing failed:', err))

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getEntries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const skip = (page - 1) * limit

    const query = {
      userId: req.user.id,
      ...(search && {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { plainText: { $regex: search, $options: 'i' } }
        ]
      })
    }

    const total = await Entry.countDocuments(query)
    const entries = await Entry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
export const getEntry = async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, userId: req.user.id })
    if (!entry) return res.status(404).json({ message: 'Entry not found' })
    res.json(entry)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateEntry = async (req, res) => {
  try {
    const { title, content, plainText } = req.body
    const entry = await Entry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        title,
        content,
        plainText,
        meta: {
          wordCount: plainText.split(' ').length,
          readingTime: Math.ceil(plainText.split(' ').length / 200)
        }
      },
      { new: true }
    )
    if (!entry) return res.status(404).json({ message: 'Entry not found' })
    res.json(entry)
  // Reprocess AI in background on every save
    processEntry(plainText).then(async (aiData) => {
      await Entry.findByIdAndUpdate(entry._id, {
        ai: { ...aiData, processedAt: new Date() }
      })
    }).catch(err => console.error('AI reprocessing failed:', err))
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
export const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!entry) return res.status(404).json({ message: 'Entry not found' })
    res.json({ message: 'Entry deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}