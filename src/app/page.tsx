"use client";

import { useState, useMemo } from 'react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { Habit, ProgressData } from '@/types';
import Header from '@/components/layout/header';
import HabitGrid from '@/components/habits/habit-grid';
import AddHabitDialog from '@/components/habits/add-habit-dialog';
import MotivationModal from '@/components/habits/motivation-modal';
import ProgressDashboard from '@/components/progress/progress-dashboard';
import { getMotivationMessageAction } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"

const initialHabits: Habit[] = [
  // The 7 Habits of Highly Effective People
  { id: '1', name: 'Put First Things First', description: 'Prioritize and execute important tasks.', icon: 'ClipboardList', streak: 2, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 2), 'yyyy-MM-dd')]: true } },
  { id: '2', name: 'Sharpen the Saw', description: 'Engage in self-renewal (physical, mental, emotional, spiritual).', icon: 'Sparkles', streak: 4, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 2), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 3), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 4), 'yyyy-MM-dd')]: true } },
  { id: '3', name: 'Seek First to Understand', description: 'Practice empathetic listening before making yourself heard.', icon: 'Ear', streak: 0, completions: {} },

  // Atomic Habits
  { id: '4', name: 'Identity: A Small Win', description: 'Prove "who I want to become" with one small action.', icon: 'Award', streak: 7, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 2), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 3), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 4), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 5), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 6), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 7), 'yyyy-MM-dd')]: true } },
  { id: '5', name: 'Make It Easy', description: 'Shrink a habit down to its tiniest, 2-minute version.', icon: 'Scaling', streak: 1, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true } },

  // How to Win Friends & Influence People
  { id: '6', name: 'Use a Person\'s Name', description: 'Remember and use people\'s names in conversation.', icon: 'User', streak: 3, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 2), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 3), 'yyyy-MM-dd')]: true } },
  { id: '7', name: 'Sincere Appreciation', description: 'Give honest praise to someone today.', icon: 'Heart', streak: 0, completions: {} },
  { id: '8', name: 'Admit Faults Quickly', description: 'If you\'re wrong, admit it quickly and emphatically.', icon: 'CheckCircle', streak: 1, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true } },

  // Never Split the Difference
  { id: '9', name: 'Practice Mirroring', description: 'Repeat the last few words someone has said to build rapport.', icon: 'Copy', streak: 5, completions: { [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 2), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 3), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 4), 'yyyy-MM-dd')]: true, [format(subDays(new Date(), 5), 'yyyy-MM-dd')]: true } },
  { id: '10', name: 'Practice Labeling', description: 'Acknowledge emotions ("It seems like...") to defuse negativity.', icon: 'Tag', streak: 0, completions: {} },
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

  const progressData: ProgressData[] = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return daysInWeek.map(day => ({
      date: format(day, 'MMM d'),
      day: format(day, 'EEE'),
      completions: habits.reduce((count, habit) => {
        return habit.completions[format(day, 'yyyy-MM-dd')] ? count + 1 : count;
      }, 0)
    }));
  }, [habits]);

  const weeklyGoal = habits.length * 7;
  const weeklyCompletions = progressData.reduce((sum, day) => sum + day.completions, 0);


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
            <ProgressDashboard
              progressData={progressData}
              weeklyGoal={weeklyGoal}
              weeklyCompletions={weeklyCompletions}
            />
            <h1 className="text-3xl font-bold font-headline mb-6 mt-8">Your Habits</h1>
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
