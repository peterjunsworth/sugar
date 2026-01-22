'use client';

import { useAuth } from '../auth/AuthContext';

interface IframeChatInterfaceProps {
  className?: string;
}

export default function IframeChatInterface({ className = '' }: IframeChatInterfaceProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className={`h-full w-full flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Please log in to use the chat assistant</p>
        </div>
      </div>
    );
  }

  // Build the webhook URL with user metadata as query parameters
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
                     'https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat';

  // Add user info as query parameters
  const params = new URLSearchParams({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
  });

  const iframeUrl = `${webhookUrl}?${params.toString()}`;

  return (
    <div className={`h-full w-full ${className}`}>
      <iframe
        src={iframeUrl}
        className="w-full h-full border-0 rounded-lg"
        title="Diabetes Tracking Assistant"
        allow="microphone"
      />
    </div>
  );
}
