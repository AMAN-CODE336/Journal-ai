import { GoogleGenerativeAI } from '@google/generative-ai'

export const getSuggestions = async (entries) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const summary = entries.map(e => `- ${e.title}: ${e.plainText?.slice(0, 200)}`).join('\n')

  const prompt = `
    You are an AI learning coach analyzing a student's journal entries.
    Based on these journal entries, suggest what they should learn next.
    
    Journal entries:
    ${summary}
    
    Return ONLY valid JSON with this structure:
    {
      "suggestions": [
        {
          "topic": "topic name",
          "reason": "why they should learn this based on their journal",
          "difficulty": "beginner | intermediate | advanced",
          "resources": ["resource 1", "resource 2"]
        }
      ],
      "pattern": "one sentence about their overall learning pattern",
      "strength": "what they are strongest in",
      "gap": "biggest knowledge gap you notice"
    }
  `

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}