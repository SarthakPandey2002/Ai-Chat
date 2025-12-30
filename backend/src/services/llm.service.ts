/**
 * LLM Service
 *
 * This service acts as a facade for LLM operations.
 * It uses the provider pattern to allow easy swapping between different LLM providers
 * (Groq, OpenAI, Claude, etc.) without changing the rest of the codebase.
 *
 * Architecture benefits:
 * - Separation of concerns: service layer is independent of specific LLM implementation
 * - Easy to add new providers (WhatsApp could use OpenAI, Instagram could use Claude, etc.)
 * - Easy to test (can inject mock providers)
 * - Easy to switch providers (just change one line below)
 */

import { ILLMProvider, Message } from '../interfaces/ILLMProvider';
import { GroqProvider } from '../providers/GroqProvider';

// Initialize the LLM provider
// To switch providers, just create a different provider instance here
// Example: const llmProvider = new OpenAIProvider(process.env.OPENAI_API_KEY);
const llmProvider: ILLMProvider = new GroqProvider(process.env.GROQ_API_KEY!);

/**
 * Generates an AI reply for a user message
 *
 * @param userMessage - The user's message
 * @param conversationHistory - Previous messages for context
 * @returns Promise<string> - The AI-generated reply
 */
export const generateAIReply = async (
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> => {
  try {
    return await llmProvider.generateReply(userMessage, conversationHistory);
  } catch (error: any) {
    console.error('LLM Service Error:', error);
    // Fallback to a helpful error message
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or email us at support@spurshop.com for immediate assistance!";
  }
};
