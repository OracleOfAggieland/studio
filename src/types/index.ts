import type { IconName } from '@/components/lucide-icon';

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  streak: number;
  completions: Record<string, boolean>; // date string 'yyyy-MM-dd' -> boolean
  // New fields for enhancements
  triggers?: HabitTrigger[];
  currentDifficulty?: 'tiny' | 'easy' | 'medium' | 'hard';
  baseDifficulty?: 'tiny' | 'easy' | 'medium' | 'hard';
  environmentalCues?: string[];
  temptationBundle?: string;
  lastMissedDate?: string;
  missedCount?: number;
  identityTags?: string[];
  stackedWithHabitId?: string; // For habit stacking
  optimalTimes?: string[]; // Suggested times based on completion patterns
}

export interface HabitTrigger {
  id: string;
  type: 'time' | 'location' | 'after-habit' | 'emotional' | 'environmental';
  value: string;
  habitId: string;
  successRate?: number;
  totalAttempts?: number;
  successfulAttempts?: number;
}

export interface UserIdentity {
  id: string;
  statement: string; // "I am a..."
  createdAt: string;
  associatedHabits: string[]; // Habit IDs
  evidenceEntries: EvidenceEntry[];
  currentScore: number; // 0-100 alignment score
}

export interface EvidenceEntry {
  id: string;
  habitId: string;
  habitName: string;
  timestamp: string;
  reflection?: string;
  identityAlignment: number; // 1-5 scale
}

export interface ProgressData {
  date: string;
  day: string;
  completions: number;
}

export interface Reflection {
  id: string;
  habitId: string;
  date: string;
  feeling: 'amazing' | 'good' | 'neutral' | 'challenging';
  note?: string;
  identityAlignment?: number; // 1-5 scale
}

export interface EnvironmentalDesign {
  habitId: string;
  makeItObvious: string[];
  makeItAttractive: string[];
  makeItEasy: string[];
  makeItSatisfying: string[];
}
