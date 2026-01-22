# Changes Made: n8n Chat Widget Integration

## Summary

The application has been updated to use the official **@n8n/chat** widget instead of a custom-built chat interface. This simplifies the architecture significantly and provides a better user experience.

## What Changed

### ✅ Added
1. **@n8n/chat package** - Official n8n chat widget
2. **N8nChatInterface.tsx** - New component that embeds the chat widget
3. **NEXT_PUBLIC_N8N_WEBHOOK_URL** - Environment variable for client-side webhook URL
4. **N8N_CHAT_SETUP.md** - Complete documentation on how the widget works

### ❌ What's No Longer Needed (But Still Present)
These files/features are still in the codebase but not actively used with the n8n chat widget:
- `/api/chat/route.ts` - Custom chat API (you can delete this if you want)
- `ChatInterface.tsx` - Old custom chat UI (you can delete this)
- `n8n-client.ts` - Webhook utilities (not needed for widget)
- Chat session storage in MongoDB (widget handles sessions)

### 🔄 Modified
1. **page.tsx** - Now imports `N8nChatInterface` instead of `ChatInterface`
2. **.env.local** - Updated with your actual webhook URL
3. **.env.example** - Updated to show NEXT_PUBLIC_ prefix requirement

## How It Works Now

### Before (Custom Chat):
```
User types message
    ↓
React component
    ↓
POST to /api/chat (Next.js API)
    ↓
Fetch context from MongoDB
    ↓
POST to n8n webhook
    ↓
n8n processes with AI
    ↓
Response back through API
    ↓
Store in MongoDB
    ↓
Display to user
```

### After (n8n Chat Widget):
```
User types message
    ↓
@n8n/chat widget (with metadata)
    ↓
Direct to n8n Chat Trigger
    ↓
n8n processes with AI
    ↓
Response automatically displayed
```

**Much simpler!** The widget handles everything.

## Your Webhook URL

Your n8n chat webhook is configured as:
```
https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat
```

Note the `/chat` suffix - this is important!

## What You Get

### Metadata Sent to Your Workflow

Every message includes:
```json
{
  "chatInput": "user's message",
  "sessionId": "auto-generated",
  "userId": "from-app",
  "userEmail": "from-app",
  "userName": "from-app"
}
```

### In Your n8n Workflow

Access this data:
```javascript
$json.chatInput   // The message
$json.userId      // User ID from the app
$json.userName    // User name from the app
$json.userEmail   // User email from the app
```

## Next Steps

### 1. Update Your n8n Workflow

Make sure your workflow uses a **Chat Trigger** node (not regular Webhook):
- This gives you the `/chat` endpoint
- Handles sessions automatically
- Manages chat UI state

### 2. Access User Context

In your workflow, you can query the database for user-specific data:
```javascript
// MongoDB node
db.collection('glucose_readings')
  .find({ userId: $json.userId })
  .sort({ timestamp: -1 })
  .limit(20);
```

### 3. Build Your AI Prompt

```
You are helping ${$json.userName} manage their diabetes.

Recent glucose readings: ${recentData}
Recent meals: ${recentMeals}

User message: ${$json.chatInput}

Respond helpfully and track any food, insulin, or activity mentioned.
```

### 4. Test It

1. Run your app: `npm run dev`
2. Login
3. Go to Chat Assistant tab
4. Send a message
5. Should connect directly to your n8n workflow!

## Environment Variables

Required in `.env.local`:
```bash
# Must be NEXT_PUBLIC_ because it's used client-side
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat
```

## Benefits

✅ **Simpler architecture** - No custom API routes needed
✅ **Better UX** - Professional chat interface
✅ **Easier updates** - Change behavior in n8n without code deploys
✅ **Session management** - Handled automatically
✅ **Less code to maintain** - Widget does the heavy lifting

## Cleanup (Optional)

If you want to clean up unused code:

### Can Delete:
- `src/app/api/chat/route.ts` (old custom chat API)
- `src/components/chat/ChatInterface.tsx` (old custom UI)
- `src/lib/utils/n8n-client.ts` (webhook utilities)
- MongoDB chat_sessions collection usage

### Should Keep:
- All CGM integrations (still useful!)
- Auth system (still needed!)
- Dashboard (still needed!)
- MongoDB for glucose/meals/insulin data (still needed!)

## Documentation

See these files for more details:
- **N8N_CHAT_SETUP.md** - Complete guide to the chat widget
- **README.md** - General application documentation
- **SETUP.md** - Quick setup guide

## Testing Checklist

- [ ] n8n workflow has Chat Trigger node
- [ ] Webhook URL in .env.local is correct
- [ ] App runs: `npm run dev`
- [ ] Can login
- [ ] Chat tab appears
- [ ] Can send messages
- [ ] Messages reach n8n workflow
- [ ] AI responses appear in chat
- [ ] User metadata (userId, userName) is accessible in workflow

All set! 🎉
