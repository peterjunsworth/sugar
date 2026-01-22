# Troubleshooting n8n Chat Widget Not Showing

## Quick Checks

### 1. Open Browser Console
Press **F12** or **Cmd+Option+I** (Mac) to open Developer Tools, then look at:

#### Console Tab
Look for these messages:
```
✅ "n8n chat initialized successfully" - Good!
❌ "Failed to initialize n8n chat" - Problem
❌ "createChat function not found" - Problem
❌ "Failed to load @n8n/chat" - Problem
```

#### Network Tab
Check if the widget is trying to load:
- Look for requests to `peterjunsworth.app.n8n.cloud`
- Check if they're succeeding (200 status) or failing

### 2. Check Your n8n Workflow

Visit your webhook URL directly in a browser:
```
https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat
```

**Expected:** You should see a chat interface
**If 404:** Your workflow might not have a Chat Trigger node

### 3. Verify Environment Variable

In your running terminal where `npm run dev` is running, check:
```bash
echo $NEXT_PUBLIC_N8N_WEBHOOK_URL
```

Or check in browser console:
```javascript
console.log(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL)
```

Should output:
```
https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat
```

### 4. Restart Dev Server

After any `.env.local` changes:
```bash
# Kill the server (Ctrl+C)
# Then restart
npm run dev
```

## Common Issues

### Issue 1: "Loading chat..." Stuck Forever

**Cause:** Widget failed to initialize
**Fix:**
1. Open browser console (F12)
2. Look for error messages
3. Check if `@n8n/chat` module loaded
4. Verify webhook URL is accessible

### Issue 2: Chat Shows Briefly Then Disappears

**Cause:** Webhook URL is incorrect or workflow is not active
**Fix:**
1. Test webhook URL directly in browser
2. Check n8n workflow is **activated** (toggle in top-right)
3. Verify workflow has a **Chat Trigger** node (not regular Webhook)

### Issue 3: Nothing Shows At All

**Cause:** Component might not be rendering
**Fix:**
Check the Chat Assistant tab HTML:
```javascript
// In browser console:
document.querySelector('div[class*="h-full w-full"]')
```

Should see the chat container.

### Issue 4: Module Import Error

**Cause:** `@n8n/chat` not installed properly
**Fix:**
```bash
npm install @n8n/chat --force
npm run dev
```

## Manual Testing

Add this to your component temporarily to test:

```typescript
useEffect(() => {
  console.log('User:', user);
  console.log('Webhook URL:', process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL);
  console.log('Window defined:', typeof window !== 'undefined');
}, [user]);
```

## Alternative: Simple Iframe Embed

If the widget continues to have issues, you can use a simple iframe as fallback:

```typescript
return (
  <div className="h-full w-full">
    {user ? (
      <iframe
        src={`https://peterjunsworth.app.n8n.cloud/webhook/5e29cdc8-0dfa-469e-992e-c7568f3d0b68/chat?userId=${user.id}&userName=${user.name}`}
        className="w-full h-full border-0"
        title="n8n Chat"
      />
    ) : (
      <div className="flex items-center justify-center h-full text-gray-500">
        Please log in to use the chat assistant
      </div>
    )}
  </div>
);
```

## What to Check Right Now

1. **Run the app:**
   ```bash
   npm run dev
   ```

2. **Open browser to:** http://localhost:3000

3. **Login/Register**

4. **Go to Chat Assistant tab**

5. **Open browser console (F12)**

6. **Look for messages:**
   - Should see "n8n chat initialized successfully"
   - Or error messages telling you what's wrong

7. **Check Network tab:**
   - Filter by "chat" or "webhook"
   - See if requests are being made

## Report Back

When reporting issues, include:
1. ✅ Browser console messages (F12 → Console tab)
2. ✅ Network requests (F12 → Network tab)
3. ✅ What you see on screen (screenshot helps)
4. ✅ Whether webhook URL works when visited directly in browser

## Next Steps

If chat still doesn't show after these checks, we can:
1. Use the iframe fallback method (simpler, always works)
2. Or debug the @n8n/chat module import issue
3. Or use the custom chat interface we built earlier

Let me know what you see in the browser console!
