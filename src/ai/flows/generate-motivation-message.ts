'use server';

/**
 * @fileOverview Generates personalized motivation messages for habit completion.
 *
 * - generateMotivationMessage - A function that generates a motivational message.
 * - GenerateMotivationMessageInput - The input type for the generateMotivationMessage function.
 * - GenerateMotivationMessageOutput - The return type for the generateMotivationMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMotivationMessageInputSchema = z.object({
  habitName: z.string().describe('The name of the habit completed.'),
  streakLength: z
    .number()
    .describe('The current streak length for the habit.'),
});
export type GenerateMotivationMessageInput = z.infer<
  typeof GenerateMotivationMessageInputSchema
>;

const GenerateMotivationMessageOutputSchema = z.object({
  message: z.string().describe('The personalized motivational message.'),
});
export type GenerateMotivationMessageOutput = z.infer<
  typeof GenerateMotivationMessageOutputSchema
>;

export async function generateMotivationMessage(
  input: GenerateMotivationMessageInput
): Promise<GenerateMotivationMessageOutput> {
  return generateMotivationMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMotivationMessagePrompt',
  input: {schema: GenerateMotivationMessageInputSchema},
  output: {schema: GenerateMotivationMessageOutputSchema},
  prompt: `You are a motivational coach. Generate a short, personalized message to encourage the user based on the habit they completed and their current streak.

Habit: {{habitName}}
Streak Length: {{streakLength}}

Message: `,
});

const generateMotivationMessageFlow = ai.defineFlow(
  {
    name: 'generateMotivationMessageFlow',
    inputSchema: GenerateMotivationMessageInputSchema,
    outputSchema: GenerateMotivationMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
