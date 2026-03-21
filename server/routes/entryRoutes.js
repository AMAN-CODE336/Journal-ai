import express from 'express'
import { createEntry, getEntries, getEntry, updateEntry, deleteEntry } from '../controllers/entryController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.post('/', createEntry)
router.get('/', getEntries)
router.get('/:id', getEntry)
router.put('/:id', updateEntry)
router.delete('/:id', deleteEntry)

export default router