'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { ChatMessage } from '@/types';

interface ChatInterfaceProps {
  className?: string;
}

export default function ChatInterface({ className = '' }: ChatInterfaceProps) {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load recent chat history on mount
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    if (!token) return;

    try {
      const response = await axios.get('/api/chat?limit=1', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sessions = response.data.sessions;
      if (sessions && sessions.length > 0) {
        const latestSession = sessions[0];
        setSessionId(latestSession._id);
        setMessages(latestSession.messages || []);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !token) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to UI immediately
    const tempUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await axios.post(
        '/api/chat',
        {
          message: userMessage,
          sessionId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { sessionId: newSessionId, message: assistantMessage, suggestions: newSuggestions } = response.data;

      if (!sessionId && newSessionId) {
        setSessionId(newSessionId);
      }

      setMessages((prev) => [...prev.slice(0, -1), tempUserMessage, assistantMessage]);

      if (newSuggestions) {
        setSuggestions(newSuggestions);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the temporary message on error
      setMessages((prev) => prev.slice(0, -1));

      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    setSuggestions([]);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg font-medium mb-2">Welcome to Your Diabetes Tracker</p>
            <p className="text-sm">Start by telling me about your meals, insulin doses, or blood sugar readings.</p>
            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium">Try saying:</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>"I just ate 2 slices of pizza"</p>
                <p>"I took 5 units of Humalog 20 minutes ago"</p>
                <p>"My blood sugar is 145 mg/dL"</p>
                <p>"I plan to eat pasta for dinner at 7pm"</p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t">
          <p className="text-xs text-gray-600 mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => useSuggestion(suggestion)}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
