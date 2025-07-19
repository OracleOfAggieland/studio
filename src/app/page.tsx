"use client";

import { useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { Habit } from '@/types';
import Header from '@/components/layout/header';
import HabitGrid from '@/components/habits/habit-grid';
import AddHabitDialog from '@/components/habits/add-habit-dialog';
import MotivationModal from '@/components/habits/motivation-modal';
import { getMotivationMessageAction } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"

const initialHabits: Habit[] = [
  // 7 Habits of Highly Effective People
  { id: '1', name: 'Be Proactive', description: 'Focus on your circle of influence.', icon: 'Target', streak: 4, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 2), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 3), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 4), 'yyyy-MM-dd')]: true } },
  { id: '2', name: 'Begin with the End in Mind', description: 'Review your personal mission statement.', icon: 'Milestone', streak: 2, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 2), 'yyyy-MM-dd')]: true } },
  { id: '3', name: 'Put First Things First', description: 'Plan your day using the priority matrix.', icon: 'ClipboardList', streak: 0, completions: {} },
  { id: '4', name: 'Sharpen the Saw', description: 'Engage in self-renewal (mental, physical, spiritual).', icon: 'Sparkles', streak: 1, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true } },
  
  // How to Win Friends and Influence People
  { id: '5', name: 'Use a Person\'s Name', description: 'Address someone by their name in conversation.', icon: 'User', streak: 5, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 2), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 3), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 4), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 5), 'yyyy-MM-dd')]: true } },
  { id: '6', name: 'Listen Actively', description: 'Encourage others to talk about themselves.', icon: 'Ear', streak: 3, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 2), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 3), 'yyyy-MM-dd')]: true } },

  // Atomic Habits
  { id: '7', name: 'Improve 1% Every Day', description: 'Make one small improvement to a skill or process.', icon: 'TrendingUp', streak: 10, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 2), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 3), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 4), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 5), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 6), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 7), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 8), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 9), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 10), 'yyyy-MM-dd')]: true} },
  { id: '8', name: 'Habit Stacking', description: 'Pair a new habit with an existing one.', icon: 'Layers', streak: 0, completions: {} },

  // Never Split the Difference
  { id: '9', name: 'Practice Tactical Empathy', description: 'Acknowledge the other person\'s feelings.', icon: 'Handshake', streak: 1, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true } },
  { id: '10', name: 'Use Mirroring', description: 'Repeat the last few words someone has said.', icon: 'Copy', streak: 0, completions: {} },
];

function calculateStreakFromCompletions(completions: Record<string, boolean>) {
  let streak = 0;
  let currentDate = new Date();

  if (!completions[format(currentDate, 'yyyy-MM-dd')]) {
    currentDate = subDays(currentDate, 1);
  }

  while (completions[format(currentDate, 'yyyy-MM-dd')]) {
    streak++;
    currentDate = subDays(currentDate, 1);
  }

  return streak;
}


export default function Home() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [motivation, setMotivation] = useState<{ title: string; message: string | null } | null>(null);
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false);
  const { toast } = useToast();

  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => {
      const aCompleted = a.completions[format(new Date(), 'yyyy-MM-dd')] || false;
      const bCompleted = b.completions[format(new Date(), 'yyyy-MM-dd')] || false;
      if (aCompleted === bCompleted) return 0;
      return aCompleted ? 1 : -1;
    });
  }, [habits]);

  const handleAddHabit = (newHabit: Omit<Habit, 'id' | 'streak' | 'completions'>) => {
    const habitToAdd: Habit = {
      ...newHabit,
      id: uuidv4(),
      streak: 0,
      completions: {},
    };
    setHabits(prev => [...prev, habitToAdd]);
    setAddDialogOpen(false);
    toast({
      title: "Habit Added!",
      description: `You're all set to start building your new habit: "${newHabit.name}".`,
    })
  };

  const handleToggleCompletion = async (habitId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    let updatedHabit: Habit | undefined;

    setHabits(prevHabits =>
      prevHabits.map(h => {
        if (h.id === habitId) {
          const newCompletions = { ...h.completions, [today]: !h.completions[today] };
          const newStreak = calculateStreakFromCompletions(newCompletions);
          updatedHabit = { ...h, completions: newCompletions, streak: newStreak };
          return updatedHabit;
        }
        return h;
      })
    );

    if (updatedHabit && updatedHabit.completions[today]) {
      setIsLoadingMotivation(true);
      setMotivation({ title: `Great job on ${updatedHabit.name}!`, message: null });
      
      const result = await getMotivationMessageAction(updatedHabit.name, updatedHabit.streak);
      
      if (result.success) {
        setMotivation({ title: `Great job on ${updatedHabit.name}!`, message: result.message });
      } else {
        setMotivation({ title: 'Oops!', message: result.message });
      }
      setIsLoadingMotivation(false);
    }
  };


  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header onAddHabit={() => setAddDialogOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold font-headline mb-6">Your Habits</h1>
            <HabitGrid habits={sortedHabits} onToggleCompletion={handleToggleCompletion} />
          </div>
        </main>
      </div>
      <AddHabitDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddHabit={handleAddHabit}
      />
       <MotivationModal
        isOpen={!!motivation}
        onOpenChange={() => setMotivation(null)}
        title={motivation?.title || ''}
        message={motivation?.message || ''}
        isLoading={isLoadingMotivation}
      />
    </>
  );
}
