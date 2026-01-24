'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';

interface N8nChatInterfaceProps {
  className?: string;
}

export default function N8nChatInterface({ className = '' }: N8nChatInterfaceProps) {
  const { user } = useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInitialized = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && user && !chatInitialized.current && chatContainerRef.current) {
      chatInitialized.current = true;

      // Import and initialize n8n chat widget
      import('@n8n/chat').then((module) => {
        const createChat = module.createChat || module.default?.createChat || module.default;

        if (createChat && typeof createChat === 'function') {
          try {
            createChat({
              // Your n8n webhook URL
              webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
                          'https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat',

              // IMPORTANT: Set mode to 'fullscreen' to embed in the page
              mode: 'fullscreen',

              // Target element to render the chat
              target: chatContainerRef.current as Element,

              // Pass user information to the chat (will be sent with each message)
              initialMessages: [
                `Welcome back, ${user.name}! 👋\n\nI'm your diabetes tracking assistant. Tell me about:\n• Meals and carbs ("I ate 2 slices of pizza")\n• Insulin doses ("I took 5 units of Humalog")\n• Blood glucose readings ("My glucose is 145")\n• Exercise, stress, or sleep patterns\n\nAsk me questions like "What insulin should I take for pasta?"`,
              ],

              // Chat configuration
              chatInputKey: 'chatInput',
              chatSessionKey: 'sessionId',

              // Pass metadata with each message (your n8n workflow can access this)
              metadata: {
                userId: user.id,
                userEmail: user.email,
                userName: user.name,
              },

              // Show welcome screen on first load
              showWelcomeScreen: false,
            });

            console.log('n8n chat initialized successfully in fullscreen mode');
          } catch (error) {
            console.error('Failed to initialize n8n chat:', error);
          }
        } else {
          console.error('createChat function not found in @n8n/chat module');
        }
      }).catch((error) => {
        console.error('Failed to load @n8n/chat:', error);
      });
    }

    return () => {
      chatInitialized.current = false;
    };
  }, [user]);

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
    <div
      ref={chatContainerRef}
      className={`h-full w-full ${className}`}
      id="n8n-chat-container"
    >
      {/* The n8n chat widget will be rendered here */}
    </div>
  );
}
