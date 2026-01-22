# Quick Setup Guide

## Initial Configuration

Follow these steps to get your Sugar diabetes tracking app running:

### 1. Environment Variables

Edit `.env.local` with your actual credentials:

```bash
# Required: MongoDB Connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/diabetes-tracker?retryWrites=true&w=majority

# Required: NextAuth Secret (generate one)
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Required: n8n Webhook URL
N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/your-webhook-id

# Optional: CGM API Credentials (only if using CGM integrations)
DEXCOM_CLIENT_ID=your-dexcom-client-id
DEXCOM_CLIENT_SECRET=your-dexcom-client-secret
# ... (see .env.example for all options)
```

### 2. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

### 3. MongoDB Setup

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Update `MONGODB_URI` in `.env.local`

#### Option B: Local MongoDB
```bash
# Install MongoDB locally, then use:
MONGODB_URI=mongodb://localhost:27017/diabetes-tracker
```

### 4. n8n Workflow Setup

#### Quick n8n Cloud Setup:
1. Sign up at [n8n.cloud](https://n8n.cloud)
2. Create a new workflow
3. Add a **Webhook** node (trigger)
4. Copy the webhook URL
5. Add an **AI** node (Claude/OpenAI/etc.)
6. Configure the AI with this system prompt:

```
You are a diabetes management assistant. Help users track:
- Meals and carbohydrate intake
- Insulin doses and timing
- Blood glucose readings
- Exercise, stress, and sleep

When users mention these activities, extract structured data and be conversational.
Use the context provided about their recent readings to give personalized advice.

When appropriate, extract data in this format:
{
  "type": "meal|insulin|glucose|exercise|stress|sleep",
  "data": {
    "timestamp": "ISO timestamp",
    ...relevant fields
  }
}
```

7. Add a **Respond to Webhook** node
8. Configure response format:

```json
{
  "response": "{{ $json.output }}",
  "extractedData": "{{ $json.extractedData }}",
  "suggestions": ["suggestion 1", "suggestion 2"]
}
```

9. Activate the workflow
10. Copy webhook URL to your `.env.local`

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### 6. First Use

1. Open http://localhost:3000
2. Create an account (register)
3. Optionally connect a CGM device
4. Start chatting with the assistant!

## Testing Without n8n

If you want to test the app without n8n initially:

1. Comment out the n8n call in `/src/app/api/chat/route.ts`
2. Return a mock response:

```typescript
// const n8nResponse = await sendChatMessage(...);
const n8nResponse = {
  response: "Thanks for your message! (n8n not connected yet)",
  suggestions: ["Try: I ate pizza", "Try: I took 5 units of insulin"]
};
```

## Common Issues

### "Connection failed" when registering
- Check MongoDB URI is correct
- Verify MongoDB cluster is running
- Check network/firewall settings

### Chat not responding
- Verify n8n webhook URL is correct
- Check n8n workflow is activated
- Test webhook with curl:

```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","message":"hello"}'
```

### CGM connection fails
- Verify API credentials are correct
- Check redirect URIs match in developer portal
- Start with sandbox APIs before production

## Next Steps

1. ✅ Configure environment variables
2. ✅ Set up MongoDB
3. ✅ Create n8n workflow
4. ✅ Run the app
5. ✅ Create an account
6. ✅ Start tracking!

For detailed documentation, see [README.md](./README.md)
