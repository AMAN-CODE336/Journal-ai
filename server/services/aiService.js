import { GoogleGenerativeAI } from '@google/generative-ai'

export const processEntry = async (plainText) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `
    You are an AI assistant for a learning journal app.
    Analyze the following journal entry and return a JSON response with exactly this structure:
    {
      "summary": "2-3 sentence summary of what was learned",
      "topics": ["topic1", "topic2", "topic3"],
      "quizzes": [
        { "question": "question based on the entry", "answer": "answer" },
        { "question": "question based on the entry", "answer": "answer" },
        { "question": "question based on the entry", "answer": "answer" }
      ],
      "insight": "one line motivational insight about what was learned",
      "mood": {
        "label": "one of: happy, sad, anxious, motivated, tired, focused, confused, excited",
        "emoji": "single emoji that represents the mood",
        "score": <number between 1 and 10 representing positivity>
      }
    }

    Journal Entry:
    ${plainText}

    Return only valid JSON, no extra text.
  `
  
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}