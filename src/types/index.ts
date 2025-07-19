import type { IconName } from '@/components/lucide-icon';

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  streak: number;
  completions: Record<string, boolean>; // date string 'yyyy-MM-dd' -> boolean
}
