// server/src/api/services/ai.service.js
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.getAIChatResponse = async (prompt) => {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192', // A fast model available on Groq
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150, // Increased for feedback
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error getting response from Groq:', error);
    throw new Error('Failed to get AI response');
  }
};