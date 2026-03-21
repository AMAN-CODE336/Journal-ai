import { GoogleGenerativeAI } from '@google/generative-ai'

export const chatWithJournal = async (entries, message) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const journalContext = entries
    .map(e => `Entry: "${e.title}" (${new Date(e.createdAt).toDateString()})\n${e.plainText?.slice(0, 500)}`)
    .join('\n\n')

  const prompt = `
    You are an expert learning coach and personal AI assistant who has deeply analyzed all of the user's journal entries.
    
    Your job is to:
    - Answer questions about their learning journey with SPECIFIC references to their actual entries
    - When asked what to learn next, give CONCRETE actionable suggestions with reasons based on what they've already learned
    - When asked about progress, give DETAILED insights about patterns, strengths and weaknesses
    - Be encouraging, specific and actionable — not vague
    - Format your response clearly with sections if needed
    - Always base your answer on their actual journal content

    Journal Entries:
    ${journalContext}

    User Question: ${message}

    Give a detailed, specific, helpful answer based on their journal entries.
  `

  const result = await model.generateContent(prompt)
  return result.response.text()
}

// NEW — streaming version of the same function
export const streamChat = async (entries, message, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const journalContext = entries
    .map(e => `Entry: "${e.title}" (${new Date(e.createdAt).toDateString()})\n${e.plainText?.slice(0, 500)}`)
    .join('\n\n')

  const prompt = `
    You are an expert learning coach and personal AI assistant who has deeply analyzed all of the user's journal entries.
    
    Your job is to:
    - Answer questions about their learning journey with SPECIFIC references to their actual entries
    - When asked what to learn next, give CONCRETE actionable suggestions with reasons based on what they've already learned
    - When asked about progress, give DETAILED insights about patterns, strengths and weaknesses
    - Be encouraging, specific and actionable — not vague
    - Format your response clearly with sections if needed
    - Always base your answer on their actual journal content

    Journal Entries:
    ${journalContext}

    User Question: ${message}

    Give a detailed, specific, helpful answer based on their journal entries.
  `

  // generateContentStream → chunks instead of full response
  const result = await model.generateContentStream(prompt)

  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) {
      res.write(`data: ${JSON.stringify({ text })}\n\n`)
    }
  }

  res.write('data: [DONE]\n\n')
  res.end()
}