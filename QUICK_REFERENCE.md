# Quick Reference: n8n Chat Widget Integration

## Your Configuration

**Webhook URL:**
```
https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat
```

**Environment Variable (in .env.local):**
```bash
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat
```

## What You Receive in n8n

Every chat message includes:

```javascript
$json.chatInput      // "I ate pizza"
$json.sessionId      // "abc123..."
$json.action         // "sendMessage"

// Custom metadata from the app:
$json.userId         // "user-123"
$json.userEmail      // "user@email.com"
$json.userName       // "John Doe"
```

## Example n8n Workflow

```
1. Chat Trigger Node
   ↓
2. MongoDB Query (get user's recent data)
   Collection: glucose_readings
   Filter: { userId: {{ $json.userId }} }
   Sort: { timestamp: -1 }
   Limit: 20
   ↓
3. Set Variables
   {
     userName: {{ $json.userName }},
     message: {{ $json.chatInput }},
     recentGlucose: {{ $node["MongoDB"].json }}
   }
   ↓
4. AI Agent (Claude/GPT)
   System Prompt:
   ---
   You are helping {{ $json.userName }} track their diabetes.

   Recent glucose readings: {{ $json.recentGlucose }}

   User message: {{ $json.message }}

   Respond helpfully. If they mention food, ask about carbs.
   If they mention insulin, note the timing and dosage.
   ---
   ↓
5. Response (automatic!)
   Whatever the AI outputs is sent back to the chat
```

## Testing Your Setup

### 1. Check Webhook URL
Visit in browser:
```
https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat
```
Should show a chat interface.

### 2. Test from App
```bash
npm run dev
# Go to http://localhost:3000
# Login → Chat Assistant tab → Send a message
```

### 3. Check n8n Executions
In n8n dashboard, go to Executions to see incoming messages.

## Common Issues

### Chat widget doesn't appear
- Check browser console (F12)
- Verify NEXT_PUBLIC_N8N_WEBHOOK_URL in .env.local
- Restart dev server after changing .env.local

### Messages not reaching n8n
- Make sure workflow is **activated** in n8n
- Check workflow uses **Chat Trigger** (not Webhook)
- Verify webhook URL ends with `/chat`

### No response from AI
- Check n8n execution logs
- Verify AI node has valid API credentials
- Check AI node output format

## Files to Know

- **Component:** `src/components/chat/N8nChatInterface.tsx`
- **Config:** `.env.local`
- **Documentation:** `N8N_CHAT_SETUP.md`

## Useful Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Quick Tips

💡 **Metadata is your friend** - Use userId to query user-specific data in n8n
💡 **Session IDs** - Automatically handled by the widget
💡 **Update without deploy** - Change AI behavior in n8n, no code changes needed
💡 **Test directly** - Open webhook URL in browser to test chat without the app

## Need Help?

1. Check **N8N_CHAT_SETUP.md** for detailed explanations
2. Review n8n executions to see what data you're receiving
3. Check browser console for JavaScript errors
4. Verify environment variables are set correctly

## Your MongoDB Collections

Query these in your n8n workflow:

```javascript
// Recent glucose readings
db.glucose_readings.find({ userId: userId })

// Recent meals
db.meals.find({ userId: userId })

// Recent insulin
db.insulin_doses.find({ userId: userId })

// Recent exercise
db.exercises.find({ userId: userId })
```

## Example AI Prompt Template

```
You are a diabetes management assistant helping {{ $json.userName }}.

CONTEXT:
- Recent glucose: {{ $json.recentGlucose }}
- Recent meals: {{ $json.recentMeals }}
- Recent insulin: {{ $json.recentInsulin }}

USER MESSAGE: {{ $json.chatInput }}

INSTRUCTIONS:
1. Be conversational and supportive
2. If they mention food, ask about carbs and timing
3. If they mention insulin, note type, units, and timing
4. Provide insights based on their historical data
5. Remind them this is not medical advice

RESPOND NOW:
```

## That's It!

The chat widget is already integrated. Just make sure your n8n workflow is set up with a Chat Trigger and you're good to go! 🚀

For more details, see:
- N8N_CHAT_SETUP.md (comprehensive guide)
- CHANGES.md (what changed in the codebase)
- README.md (full application documentation)
