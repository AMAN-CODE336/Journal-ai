import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'User already exists' })
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })
    generateToken(res, user._id)
    res.status(201).json({ _id: user._id, name: user.name, email: user.email })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })
    generateToken(res, user._id)
    res.json({ _id: user._id, name: user.name, email: user.email })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const logout = (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out successfully' })
}

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  res.json(user)
}