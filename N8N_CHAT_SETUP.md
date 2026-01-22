# Using the n8n Chat Widget

This application now uses the official `@n8n/chat` widget for a seamless embedded chat experience.

## How It Works

### 1. **The n8n Chat Widget**

Instead of building a custom chat interface, we embed n8n's official chat widget directly into the application. This gives you:

✅ **Pre-built UI** - Professional chat interface out of the box
✅ **Session Management** - Automatic conversation history
✅ **Typing Indicators** - Built-in loading states
✅ **Easy Updates** - Update chat behavior from n8n without code changes
✅ **Metadata Support** - Passes user info automatically

### 2. **What Gets Sent to Your n8n Workflow**

When a user sends a message, the chat widget automatically sends:

```json
{
  "chatInput": "I just ate 2 slices of pizza",
  "sessionId": "auto-generated-session-id",
  "action": "sendMessage",

  // Custom metadata you defined (available in workflow)
  "userId": "user-123",
  "userEmail": "user@example.com",
  "userName": "John Doe"
}
```

### 3. **Your n8n Workflow Structure**

Your workflow should be much simpler now:

```
Chat Trigger (built-in to n8n)
         ↓
Access User Metadata ($json.userId, $json.userName, etc.)
         ↓
Query MongoDB for user's recent data (glucose, meals, insulin)
         ↓
AI Model (Claude/GPT) with context
         ↓
Return Response (automatic)
```

### 4. **Setting Up Your n8n Workflow**

1. **Create a new workflow** in n8n
2. **Add a "Chat Trigger" node** (not a regular webhook)
   - This gives you the special `/chat` endpoint
   - Handles sessions automatically
3. **Access metadata** in your workflow:
   ```javascript
   const userId = $json.userId;
   const userName = $json.userName;
   const userMessage = $json.chatInput;
   ```
4. **Query for context** (optional but recommended):
   ```javascript
   // In a MongoDB node or Code node
   // Get recent glucose readings for this user
   const recentGlucose = await db.collection('glucose_readings')
     .find({ userId: userId })
     .sort({ timestamp: -1 })
     .limit(10)
     .toArray();
   ```
5. **Send to AI** with full context:
   ```
   System: You are a diabetes assistant for ${userName}.

   Recent glucose: ${JSON.stringify(recentGlucose)}

   User message: ${userMessage}

   Respond helpfully and track any mentioned meals, insulin, etc.
   ```
6. **Return response** - Just output text, n8n handles the rest!

### 5. **Getting Your Webhook URL**

Your webhook URL is already configured:
```
https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat
```

Notice it ends with `/chat` - this is important! This indicates it's a chat-specific webhook.

### 6. **Benefits of This Approach**

#### Before (Custom Chat):
- Had to build entire chat UI
- Manage sessions manually
- Handle loading states
- Store messages in database
- Complex API routing

#### Now (n8n Chat Widget):
- Chat UI provided by `@n8n/chat`
- Sessions handled automatically
- Loading states built-in
- Messages stored by n8n
- Direct connection to workflow

### 7. **Accessing Chat Data in Your Workflow**

The n8n Chat Trigger provides:

```javascript
// Available in your workflow:
$json.chatInput        // The user's message
$json.sessionId        // Unique session ID
$json.action           // Usually "sendMessage"

// Your custom metadata:
$json.userId           // Passed from the app
$json.userEmail        // Passed from the app
$json.userName         // Passed from the app
```

### 8. **Example Workflow Nodes**

**Node 1: Chat Trigger**
- Receives messages from the widget
- Automatic session management

**Node 2: Set Variables**
```javascript
return {
  userId: $json.userId,
  message: $json.chatInput,
  session: $json.sessionId
};
```

**Node 3: MongoDB Query** (Optional)
```javascript
// Query user's recent data
db.collection('glucose_readings')
  .find({ userId: items[0].json.userId })
  .sort({ timestamp: -1 })
  .limit(20);
```

**Node 4: AI Agent**
```
System Prompt:
You are helping ${userName} manage their diabetes.

Recent glucose readings: ${recentData}

User: ${message}

Respond helpfully. If they mention food, ask about carbs and insulin.
```

**Response is automatic!** - Whatever your AI outputs is sent back to the chat widget.

### 9. **Customizing the Chat Appearance**

In `/src/components/chat/N8nChatInterface.tsx`, you can customize:

```typescript
createChat({
  webhookUrl: '...',

  // Customize theme
  theme: {
    primaryColor: '#3b82f6',  // Brand color
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
  },

  // Custom welcome message
  initialMessages: [
    'Welcome! How can I help you today?'
  ],

  // Position (for floating mode)
  // mode: 'fullscreen', // or 'window'
});
```

### 10. **Why This Is Better**

✅ **No custom API routes** - Direct connection to n8n
✅ **No message storage** - n8n handles it
✅ **Professional UI** - Looks great out of the box
✅ **Easy updates** - Change AI behavior in n8n, no code deploy
✅ **Session management** - Automatic conversation history
✅ **User context** - Metadata passes user info to every message

### 11. **Testing**

1. Start your app: `npm run dev`
2. Go to the Chat Assistant tab
3. Send a message - it goes directly to your n8n workflow
4. Your AI processes it and responds
5. All automatic!

### 12. **Debugging**

If chat isn't working:

1. **Check the webhook URL** in `.env.local`:
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat
   ```

2. **Verify workflow is active** in n8n

3. **Check browser console** for errors:
   ```
   F12 → Console tab
   ```

4. **Test directly** by opening your webhook URL in browser
   - Should show chat interface

5. **Check n8n logs** in your workflow executions

### 13. **What We Removed**

Since we're using the n8n chat widget, these are no longer needed:
- ❌ Custom chat API routes (`/api/chat`)
- ❌ Chat message storage in MongoDB
- ❌ Custom chat UI components
- ❌ Manual session management
- ❌ n8n webhook client utilities

Everything is handled by the `@n8n/chat` package!

### 14. **Next Steps**

1. ✅ n8n chat widget is already integrated
2. ✅ Your webhook URL is configured
3. ⚠️ Make sure your n8n workflow uses a "Chat Trigger" (not regular webhook)
4. ⚠️ Access metadata in your workflow: `$json.userId`, `$json.userName`
5. ⚠️ Query MongoDB for user context if needed
6. ✅ Start chatting!

For the full @n8n/chat documentation, see: https://www.npmjs.com/package/@n8n/chat
