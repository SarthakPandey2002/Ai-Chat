import prisma from '../db/prisma';
import { generateAIReply } from './llm.service';

export interface ChatMessage {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}

export const handleChatMessage = async (data: ChatMessage): Promise<ChatResponse> => {
  let conversationId = data.sessionId;

  // Create new conversation if no sessionId provided
  if (!conversationId) {
    const newConversation = await prisma.conversation.create({
      data: {},
    });
    conversationId = newConversation.id;
  }

  // Save user message to database
  await prisma.message.create({
    data: {
      conversationId,
      sender: 'user',
      text: data.message,
    },
  });

  // Get conversation history for context
  const history = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: 10, // Last 10 messages for context
  });

  // Generate AI reply using LLM
  const aiReply = await generateAIReply(data.message, history);

  // Save AI reply to database
  await prisma.message.create({
    data: {
      conversationId,
      sender: 'ai',
      text: aiReply,
    },
  });

  return {
    reply: aiReply,
    sessionId: conversationId,
  };
};

// Get conversation history
export const getConversationHistory = async (sessionId: string) => {
  const messages = await prisma.message.findMany({
    where: { conversationId: sessionId },
    orderBy: { createdAt: 'asc' },
  });

  return messages;
};