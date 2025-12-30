import { useState, useEffect, useRef } from 'react';
  import { chatApi } from '../services/api';
  import type { Message } from '../types';
  import './Chat.css';

  export const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!inputValue.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: inputValue.trim(),
        timestamp: new Date(),
      };

      // Add user message to UI
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);
      setError(null);

      try {
        // Send to backend
        const response = await chatApi.sendMessage({
          message: userMessage.text,
          sessionId: sessionId || undefined,
        });

        // Save session ID
        if (!sessionId) {
          setSessionId(response.sessionId);
          localStorage.setItem('chatSessionId', response.sessionId);
        }

        // Add AI response to UI
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: response.reply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (err: any) {
        console.error('Error sending message:', err);
        setError(err.response?.data?.error || 'Failed to send message. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="chat-container">
        <div className="chat-header">
          <h1>SpurShop AI Support</h1>
          <p>Ask me anything about shipping, returns, or our policies!</p>
        </div>

        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <h2>👋 Welcome!</h2>
              <p>Hi! I'm your SpurShop support assistant. How can I help you today?</p>
              <div className="suggested-questions">
                <p><strong>Try asking:</strong></p>
                <button onClick={() => setInputValue('What is your return policy?')}>
                  What is your return policy?
                </button>
                <button onClick={() => setInputValue('Do you offer free shipping?')}>
                  Do you offer free shipping?
                </button>
                <button onClick={() => setInputValue('What are your support hours?')}>
                  What are your support hours?
                </button>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-avatar">
                {msg.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{msg.text}</div>
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message ai">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            maxLength={1000}
          />
          <button type="submit" disabled={!inputValue.trim() || isLoading}>
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    );
  };