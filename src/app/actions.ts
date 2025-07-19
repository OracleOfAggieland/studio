'use server';

import { generateMotivationMessage } from '@/ai/flows/generate-motivation-message';
import { generateIdentityMotivation } from '@/ai/flows/generate-identity-motivation';

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

export async function getIdentityMotivationAction(
  habitName: string, 
  identityStatement: string, 
  evidenceCount: number, 
  alignmentScore: number
) {
  try {
    // Artificial delay for demonstration purposes
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = await generateIdentityMotivation({ 
      habitName, 
      identityStatement, 
      evidenceCount, 
      alignmentScore 
    });
    return { success: true, message: result.message };
  } catch (error) {
    console.error('Error generating identity motivation message:', error);
    return { 
      success: false, 
      message: `You're becoming a ${identityStatement} with every action. Keep going!` 
    };
  }
}
