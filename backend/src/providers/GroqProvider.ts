/**
 * Groq LLM Provider Implementation
 *
 * Uses Groq's fast inference API with Llama 3.3 70B model.
 * Groq provides excellent free tier and ultra-fast responses.
 */

import Groq from 'groq-sdk';
import { ILLMProvider, Message } from '../interfaces/ILLMProvider';

// FAQ knowledge base for SpurShop
const STORE_KNOWLEDGE = `SpurShop - E-commerce Customer Support

SHIPPING POLICY:
- Free shipping on orders over $50
- Standard shipping (5-7 business days): $5.99
- Express shipping (2-3 business days): $14.99
- We ship to USA, Canada, UK, and EU countries
- International shipping: 10-14 business days

RETURN & REFUND POLICY:
- 30-day money-back guarantee
- Items must be unused and in original packaging
- Free returns for defective items
- Refunds processed within 5-7 business days
- Return shipping cost: $7.99 (unless defective)

SUPPORT HOURS:
- Monday-Friday: 9 AM - 6 PM EST
- Saturday: 10 AM - 4 PM EST
- Sunday: Closed
- Email: support@spurshop.com

PAYMENT METHODS:
- Visa, MasterCard, Amex, PayPal, Apple Pay
- All payments secure and encrypted`;

/**
 * Groq LLM Provider
 * Implements ILLMProvider interface using Groq's API
 */
export class GroqProvider implements ILLMProvider {
  private client: Groq;
  private model: string;

  constructor(apiKey: string, model: string = 'llama-3.3-70b-versatile') {
    this.client = new Groq({ apiKey });
    this.model = model;
  }

  /**
   * Generates AI reply using Groq's Llama model
   */
  async generateReply(userMessage: string, conversationHistory: Message[]): Promise<string> {
    try {
      // Build conversation context
      const messages: any[] = [
        {
          role: 'system',
          content: `You are a friendly and helpful customer support agent for SpurShop, an e-commerce store.

Use the following knowledge base to answer customer questions accurately:

${STORE_KNOWLEDGE}

Guidelines:
- Be friendly, professional, and concise
- Use the information from the knowledge base above
- If asked about something not in the knowledge base, politely say you don't have that information and offer to help with what you do know
- Use emojis occasionally to be friendly (but don't overuse them)
- Format your responses nicely with bullet points or numbered lists when appropriate
- Always try to be helpful and ask follow-up questions to better assist the customer`
        }
      ];

      // Add conversation history (last 10 messages for context)
      const recentHistory = conversationHistory.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      }

      // Add current user message
      messages.push({
        role: 'user',
        content: userMessage
      });

      // Call Groq API
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
      });

      const reply = completion.choices[0]?.message?.content ||
        "I apologize, but I'm having trouble processing your request right now. Please try again!";

      return reply;

    } catch (error: any) {
      console.error('Groq API Error:', error);
      throw new Error('Failed to generate AI response. Please try again later.');
    }
  }
}
