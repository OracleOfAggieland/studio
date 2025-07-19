'use server';

/**
 * @fileOverview Generates personalized identity-based motivation messages.
 *
 * - generateIdentityMotivation - A function that generates an identity-reinforcing message.
 * - GenerateIdentityMotivationInput - The input type for the generateIdentityMotivation function.
 * - GenerateIdentityMotivationOutput - The return type for the generateIdentityMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIdentityMotivationInputSchema = z.object({
  habitName: z.string().describe('The name of the habit completed.'),
  identityStatement: z.string().describe('The user\'s identity statement (e.g., "writer", "healthy person").'),
  evidenceCount: z.number().describe('Number of evidence entries for this identity.'),
  alignmentScore: z.number().describe('How aligned they felt with their identity (1-5).'),
});
export type GenerateIdentityMotivationInput = z.infer<
  typeof GenerateIdentityMotivationInputSchema
>;

const GenerateIdentityMotivationOutputSchema = z.object({
  message: z.string().describe('The personalized identity-reinforcing message.'),
});
export type GenerateIdentityMotivationOutput = z.infer<
  typeof GenerateIdentityMotivationOutputSchema
>;

export async function generateIdentityMotivation(
  input: GenerateIdentityMotivationInput
): Promise<GenerateIdentityMotivationOutput> {
  return generateIdentityMotivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIdentityMotivationPrompt',
  input: {schema: GenerateIdentityMotivationInputSchema},
  output: {schema: GenerateIdentityMotivationOutputSchema},
  prompt: `You are an identity coach helping someone become their ideal self. Generate a short, powerful message that reinforces their identity transformation.

Habit Completed: {{habitName}}
Their Identity: "I am a {{identityStatement}}"
Evidence Entries: {{evidenceCount}}
Today's Alignment: {{alignmentScore}}/5

Create a message that:
1. Reinforces their identity ("You ARE a {{identityStatement}}")
2. Connects this specific habit to their identity
3. Celebrates their progress ({{evidenceCount}} pieces of evidence)
4. Is concise and emotionally resonant
5. Uses "you" language, not "they"

Message: `,
});

const generateIdentityMotivationFlow = ai.defineFlow(
  {
    name: 'generateIdentityMotivationFlow',
    inputSchema: GenerateIdentityMotivationInputSchema,
    outputSchema: GenerateIdentityMotivationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
