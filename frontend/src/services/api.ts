import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt: string;
}

export interface SendMessageRequest {
  message: string;
  sessionId?: string;
}

export interface SendMessageResponse {
  reply: string;
  sessionId: string;
}

export const chatApi = {
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await axios.post<SendMessageResponse>(
      `${API_BASE_URL}/chat/message`,
      data
    );
    return response.data;
  },

  getHistory: async (sessionId: string): Promise<{ messages: ChatMessage[] }> => {
    const response = await axios.get(`${API_BASE_URL}/chat/history/${sessionId}`);
    return response.data;
  },
};