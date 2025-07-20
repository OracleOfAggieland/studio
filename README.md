# Firebase Studio

This is a Next.js starter in Firebase Studio.

## Local Development

Create a `.env.local` file with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Run the development server with `npm run dev`.

To enable AI-generated motivation messages, include your Google AI (Gemini)
API key as well:

```
GEMINI_API_KEY=AIzaSyB-RIjhhODp6aPTzqVcwbXD894oebXFCUY
```

The application also accepts `GOOGLE_API_KEY`, `NEXT_PUBLIC_GEMINI_API_KEY`, or
`NEXT_PUBLIC_GOOGLE_API_KEY` for convenience.
