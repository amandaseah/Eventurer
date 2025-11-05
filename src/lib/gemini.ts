import { GoogleGenerativeAI } from '@google/generative-ai';
import { faqData } from '../data/faqData';

// Create FAQ context from our database
const createFAQContext = () => {
  const faqContext = faqData
    .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
    .join('\n\n');

  return `You are a helpful FAQ assistant for Eventurer, a mood-based event discovery platform.
Your role is to answer user questions based on the FAQ database provided below.
Be friendly, concise, and helpful. If a question isn't covered in the FAQs, politely direct users to contact support at eventurer.support@gmail.com or call +65 9999 9999.

Here is the complete FAQ database:

${faqContext}

Guidelines:
- Answer questions naturally and conversationally
- If multiple FAQs are relevant, mention all of them
- Keep responses concise but informative
- Use a friendly, approachable tone
- If unsure, suggest contacting support
- Don't make up information not in the FAQs`;
};

export async function getChatbotResponse(userMessage: string): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Create a new chat session for each request with FAQ context
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: createFAQContext() }],
        },
        {
          role: 'model',
          parts: [{ text: 'Hello! I\'m your Eventurer FAQ assistant. I\'m here to help answer any questions you have about using the platform. What would you like to know?' }],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);

    // Fallback error messages
    if (error instanceof Error && error.message.includes('API key')) {
      return "I'm having trouble connecting to my AI service. Please contact support at eventurer.support@gmail.com for assistance.";
    }

    return "Sorry, I'm experiencing technical difficulties right now. Please try again in a moment, or contact support at eventurer.support@gmail.com.";
  }
}
