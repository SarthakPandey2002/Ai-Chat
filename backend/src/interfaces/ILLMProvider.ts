/**
 * LLM Provider Interface
 *
 * This interface defines the contract for all LLM providers.
 * This abstraction makes it trivial to swap between different LLM providers
 * (Groq, OpenAI, Claude, etc.) or add support for multiple providers.
 *
 * Benefits:
 * - Easy to add new LLM providers (just implement this interface)
 * - Easy to add new channels (WhatsApp, Instagram) with different providers
 * - Testable (can create mock providers for testing)
 * - Follows dependency inversion principle
 */

export interface Message {
  sender: string;
  text: string;
}

/**
 * Interface that all LLM providers must implement
 */
export interface ILLMProvider {
  /**
   * Generates an AI reply based on user message and conversation history
   *
   * @param userMessage - The current message from the user
   * @param conversationHistory - Previous messages for context
   * @returns Promise<string> - The AI-generated reply
   * @throws Error if LLM API call fails
   */
  generateReply(userMessage: string, conversationHistory: Message[]): Promise<string>;
}
