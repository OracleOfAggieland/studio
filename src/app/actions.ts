'use server';

import { generateMotivationMessage } from '@/ai/flows/generate-motivation-message';

export async function getMotivationMessageAction(habitName: string, streakLength: number) {
  try {
    // Artificial delay for demonstration purposes
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = await generateMotivationMessage({ habitName, streakLength });
    return { success: true, message: result.message };
  } catch (error) {
    console.error('Error generating motivation message:', error);
    return { success: false, message: 'Could not generate a message right now. But keep up the great work, you are doing amazing!' };
  }
}
