# Sugar - Diabetes Tracking Assistant - For release

A Next.js application that helps diabetics track their carb ratio and understand how different food groups affect their blood sugar levels through conversational AI and CGM integration.

## Overview

Sugar is a personal diabetes management tool that allows users to:
- Track meals, insulin doses, medications, exercise, and stress levels through a conversational chatbot
- Connect to CGM devices (Dexcom, Freestyle Libre, Eversense) for automatic glucose data sync
- Receive AI-powered insights based on historical data patterns
- Ask questions like "I plan to eat pizza at 7pm" and get personalized recommendations

**Important Disclaimer**: This application is for personal tracking and educational purposes only. It is NOT a medical device and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your healthcare provider regarding your diabetes management.

## Architecture

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB (for storing user data, glucose readings, meals, etc.)
- **AI/Chat**: n8n workflow integration (webhook-based)
- **CGM Integration**: Direct API integration with Dexcom, Libre, and Eversense

## Features

### Core Features
- User authentication (email/password)
- Conversational chatbot interface powered by n8n
- Automatic glucose data sync from CGM devices
- Manual data entry for meals, insulin, exercise, stress, etc.
- Historical pattern analysis

### CGM Integrations
- **Dexcom**: OAuth2 integration with automatic token refresh
- **Freestyle Libre**: LibreView API integration
- **Eversense**: OAuth2 integration with automatic token refresh

### Data Tracking
- Blood glucose readings (from CGM or manual entry)
- Insulin doses (bolus and basal)
- Medications
- Meals with detailed macronutrients (carbs, fats, proteins, sugars)
- Exercise activities
- Stress levels
- Sleep records

## Getting Started

### Prerequisites

1. **Node.js**: Version 18 or higher
2. **MongoDB**: A MongoDB database (cloud or local)
3. **n8n**: An n8n instance with a configured workflow for the chatbot
4. **CGM API Credentials** (optional, for CGM integration):
   - Dexcom Developer Account
   - Freestyle Libre Developer Access
   - Eversense Developer Account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sugar
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diabetes-tracker?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>

# n8n Webhook Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/your-webhook-id

# CGM API Configuration (Optional)
DEXCOM_CLIENT_ID=your-dexcom-client-id
DEXCOM_CLIENT_SECRET=your-dexcom-client-secret
DEXCOM_API_URL=https://sandbox-api.dexcom.com

LIBRE_CLIENT_ID=your-libre-client-id
LIBRE_CLIENT_SECRET=your-libre-client-secret
LIBRE_API_URL=https://api-us.libreview.io

EVERSENSE_CLIENT_ID=your-eversense-client-id
EVERSENSE_CLIENT_SECRET=your-eversense-client-secret
EVERSENSE_API_URL=https://api.eversensediabetes.com
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## n8n Workflow Configuration

Your n8n workflow should:

1. **Accept a webhook** with the following payload:
```json
{
  "userId": "user-id-string",
  "message": "user message text",
  "sessionId": "optional-session-id",
  "context": {
    "recentGlucose": [...],
    "recentMeals": [...],
    "recentInsulin": [...]
  }
}
```

2. **Process the message** using an AI model (Claude, GPT, etc.)

3. **Extract structured data** from the conversation (optional):
   - Parse mentions of meals, insulin, glucose readings, etc.
   - Return structured data for automatic database storage

4. **Return a response** in this format:
```json
{
  "response": "AI assistant's response text",
  "extractedData": {
    "type": "meal|insulin|glucose|exercise|stress|sleep",
    "data": {
      "timestamp": "ISO-8601 timestamp",
      "value": "...",
      ...
    }
  },
  "suggestions": ["suggestion 1", "suggestion 2"]
}
```

### Sample n8n Workflow Structure

```
Webhook Trigger
  ↓
[Set Variables] (userId, message, context)
  ↓
[AI Model] (Claude/GPT with system prompt)
  ↓
[Extract Data] (Parse for structured information)
  ↓
[MongoDB Insert] (Optional: store extracted data)
  ↓
[Respond to Webhook] (Return formatted response)
```

## Project Structure

```
sugar/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── cgm/           # CGM integration endpoints
│   │   │   └── chat/          # Chat API
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/              # Auth components
│   │   ├── chat/              # Chat interface
│   │   └── dashboard/         # Dashboard components
│   ├── lib/
│   │   ├── auth/              # Auth utilities
│   │   ├── cgm/               # CGM client libraries
│   │   ├── db/                # Database connection
│   │   └── utils/             # Utility functions
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── .env.example
├── .env.local
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Chat
- `POST /api/chat` - Send message to chatbot
- `GET /api/chat?sessionId={id}` - Get chat history

### CGM Integration
- `GET /api/cgm/dexcom` - Initialize Dexcom OAuth
- `POST /api/cgm/dexcom` - Complete Dexcom OAuth
- `POST /api/cgm/libre` - Connect LibreView
- `GET /api/cgm/eversense` - Initialize Eversense OAuth
- `POST /api/cgm/eversense` - Complete Eversense OAuth
- `POST /api/cgm/sync` - Sync glucose data from connected CGM
- `GET /api/cgm/sync` - Get sync status

## Usage

### First Time Setup

1. **Create an account**: Register with email and password
2. **Connect your CGM** (optional): Go to Dashboard → Connect CGM
3. **Sync your data**: Click "Sync Data" to pull recent glucose readings
4. **Start chatting**: Use the Chat Assistant to log meals, insulin, etc.

### Example Chat Interactions

```
User: "I just ate 2 slices of pizza with a side salad"
Assistant: "Thanks for logging that! Can you tell me approximately how many carbs were in the pizza? Also, when did you eat it?"

User: "Around 60 carbs total, ate it at 7pm"
Assistant: "Got it! I've logged your meal. Did you take any insulin for this meal?"

User: "Yes, 6 units of Humalog about 20 minutes before eating"
Assistant: "Perfect, I've recorded that. I'll track how your blood sugar responds to help optimize your dosing for similar meals in the future."

---

User: "I plan to eat pasta tonight at 6pm"
Assistant: "Based on your history, last Tuesday you ate pasta with similar carbs and took 8 units of bolus 30 minutes before eating. Your blood sugar remained stable within 25 mg/dL. Would you like to use a similar approach?"
```

## CGM Setup Guides

### Dexcom
1. Create a developer account at [Dexcom Developer Portal](https://developer.dexcom.com/)
2. Create an application and get your Client ID and Secret
3. Add your credentials to `.env.local`
4. In the app, click "Connect Dexcom" and complete OAuth flow

### Freestyle Libre (LibreView)
1. LibreView uses direct authentication (no developer account needed)
2. In the app, click "Connect Freestyle Libre"
3. Enter your LibreView email and password
4. The app will connect and sync your data

### Eversense
1. Contact Eversense for API access
2. Get your Client ID and Secret
3. Add credentials to `.env.local`
4. Click "Connect Eversense" and complete OAuth flow

## MongoDB Collections

The application uses these MongoDB collections:

- `users` - User accounts and CGM configuration
- `glucose_readings` - Blood glucose readings from CGM or manual entry
- `insulin_doses` - Insulin dose records
- `medications` - Other medication records
- `meals` - Meal logs with nutritional information
- `exercises` - Exercise activity records
- `stress_levels` - Stress level tracking
- `sleep_records` - Sleep tracking
- `meal_patterns` - Analyzed patterns for meal responses
- `glucose_patterns` - Time-of-day glucose patterns
- `chat_sessions` - Chat conversation history
- `cgm_configs` - CGM connection configuration

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Troubleshooting

### CGM Connection Issues

**Dexcom/Eversense OAuth not working**
- Verify your redirect URIs match exactly in your developer portal
- Check that API credentials are correctly set in `.env.local`
- Try using sandbox/development APIs first before production

**LibreView authentication fails**
- Ensure you're using the correct LibreView region API
- Verify your LibreView email and password are correct
- Check that you have an active LibreView account with data

### n8n Integration Issues

**Chat not responding**
- Verify your n8n webhook URL is correct
- Check n8n workflow is active
- Test webhook directly with curl or Postman
- Check n8n logs for errors

**Structured data not being extracted**
- Review n8n workflow response format
- Ensure AI is properly parsing user messages
- Check MongoDB for saved data

## Contributing

This is a personal project, but suggestions and improvements are welcome! Please open an issue to discuss major changes.

## License

MIT License - feel free to use this for your personal diabetes management.

## Support

For issues or questions:
1. Check this README
2. Review the code comments
3. Open an issue on GitHub

## Acknowledgments

- Built with Next.js, MongoDB, and n8n
- CGM integrations: Dexcom, Abbott Libre, Eversense
- This tool was created to help individuals better understand their diabetes management patterns

---

**Remember**: This is a personal tracking tool, not medical advice. Always work with your healthcare team for diabetes management decisions.
