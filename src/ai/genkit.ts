import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Allow the Google AI plugin to receive an API key from various environment
// variables. This helps avoid runtime failures when the expected `GEMINI_API_KEY`
// or `GOOGLE_API_KEY` variables are not set but an alternative (e.g. prefixed
// with `NEXT_PUBLIC_`) is provided.
const googleApiKey =
  process.env.GOOGLE_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const ai = genkit({
  plugins: [googleAI({ apiKey: googleApiKey })],
  model: 'googleai/gemini-2.0-flash',
});
