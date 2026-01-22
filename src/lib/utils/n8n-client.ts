import axios from 'axios';
import { N8NWebhookRequest, N8NWebhookResponse } from '@/types';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

if (!N8N_WEBHOOK_URL) {
  console.warn('N8N_WEBHOOK_URL is not set in environment variables');
}

export async function sendMessageToN8N(
  request: N8NWebhookRequest
): Promise<N8NWebhookResponse> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('N8N_WEBHOOK_URL is not configured');
  }

  try {
    const response = await axios.post<N8NWebhookResponse>(
      N8N_WEBHOOK_URL,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('n8n webhook error:', error.response?.data || error.message);
      throw new Error(
        `Failed to communicate with n8n: ${error.response?.data?.message || error.message}`
      );
    }
    throw error;
  }
}

export async function sendChatMessage(
  userId: string,
  message: string,
  sessionId?: string,
  context?: N8NWebhookRequest['context']
): Promise<N8NWebhookResponse> {
  const request: N8NWebhookRequest = {
    userId,
    message,
    sessionId,
    context,
  };

  return sendMessageToN8N(request);
}
