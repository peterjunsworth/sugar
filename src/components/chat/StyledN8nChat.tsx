'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface StyledN8nChatProps {
  className?: string;
}

export default function StyledN8nChat({ className = '' }: StyledN8nChatProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [n8nChat, setN8nChat] = useState<any>(null);

  // Initialize N8n chat in background (API only, no UI)
  useEffect(() => {
    if (typeof window !== 'undefined' && user && !n8nChat) {
      // We'll use fetch API directly instead of N8n UI component
      // This avoids N8n creating duplicate inputs
      const sendToN8n = async (message: string) => {
        const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
                          'https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat';

        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'sendMessage',
              chatInput: message,
              sessionId: `session_${user.id}`,
              metadata: {
                userId: user.id,
                userEmail: user.email,
                userName: user.name,
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            return data.output || data.message || 'Message received';
          } else {
            return 'I received your message and will help you track that.';
          }
        } catch (error) {
          console.error('N8n webhook error:', error);
          return 'I received your message. Let me help you track that.';
        }
      };

      setN8nChat({ sendMessage: sendToN8n });

      // Add initial AI message
      setMessages([{
        id: '1',
        type: 'ai',
        content: `Welcome back, ${user.name}! 👋\n\nI'm your diabetes tracking assistant. Tell me about:\n• Meals and carbs ("I ate 2 slices of pizza")\n• Insulin doses ("I took 5 units of Humalog")\n• Blood glucose readings ("My glucose is 145")\n• Exercise, stress, or sleep patterns\n\nAsk me questions like "What insulin should I take for pasta?"`,
        timestamp: new Date(),
      }]);

      console.log('N8n API initialized (no UI rendering)');
    }
  }, [user, n8nChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !n8nChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send to N8n webhook
      const response = await n8nChat.sendMessage(inputValue);

      // Simulate delay for typing indicator
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response?.output || 'I received your message and will help you track that.',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to send message:', error);

      // Fallback response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'I received your message. Let me help you track that.',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Initialize Lucide icons
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, [messages, isTyping]);

  if (!user) {
    return (
      <div className={`h-full w-full flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Please log in to use the chat assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat Messages - fills remaining space above input bar */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className={`message-avatar ${message.type}`}>
              <i data-lucide={message.type === 'ai' ? 'bot' : 'user'} className="icon-lg"></i>
            </div>
            <div>
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="message ai">
            <div className="message-avatar ai">
              <i data-lucide="bot" className="icon-lg"></i>
            </div>
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar - at bottom of chat-container */}
      <div className="input-bar">
        <button className="btn-icon btn-ghost" aria-label="Attach photo">
          <i data-lucide="camera" className="icon-lg"></i>
        </button>
        <div className="input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask me anything or log your meal..."
            aria-label="Chat input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="input-actions">
            <button className="input-action-btn" aria-label="Voice input">
              <i data-lucide="mic" className="icon"></i>
            </button>
          </div>
        </div>
        <button
          className="send-btn"
          aria-label="Send message"
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
        >
          <i data-lucide="send" className="icon"></i>
        </button>
      </div>
    </div>
  );
}
