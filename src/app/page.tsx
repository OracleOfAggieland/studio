"use client";

import { useState, useMemo, useEffect } from 'react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { Habit, ProgressData, HabitTrigger, UserIdentity, Reflection, EvidenceEntry, EnvironmentalDesign } from '@/types';
import Header from '@/components/layout/header';
import HabitGrid from '@/components/habits/habit-grid';
import AddHabitDialog from '@/components/habits/add-habit-dialog';
import MotivationModal from '@/components/habits/motivation-modal';
import TriggerDialog from '@/components/habits/trigger-dialog';
import IdentityDialog from '@/components/identity/identity-dialog';
import ReflectionDialog from '@/components/habits/reflection-dialog';
import EnvironmentWizard from '@/components/habits/environment-wizard';
import IdentityDashboard from '@/components/identity/identity-dashboard';
import ProgressDashboard from '@/components/progress/progress-dashboard';
import { getMotivationMessageAction } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { fetchHabits, saveHabit, updateHabit, resetHabitStreak } from '@/lib/habits';

const initialHabits: Habit[] = [];

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
  const [triggerDialogHabit, setTriggerDialogHabit] = useState<Habit | null>(null);
  const [identityDialogOpen, setIdentityDialogOpen] = useState(false);
  const [reflectionDialogHabit, setReflectionDialogHabit] = useState<Habit | null>(null);
  const [environmentWizardHabit, setEnvironmentWizardHabit] = useState<Habit | null>(null);
  const [userIdentity, setUserIdentity] = useState<UserIdentity | null>(null);
  const [environmentalDesigns, setEnvironmentalDesigns] = useState<Record<string, EnvironmentalDesign>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchHabits().then(setHabits).catch(() => setHabits([]));
  }, []);

  // Check for missed habits and update difficulty
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        // Check if habit was missed yesterday
        if (!habit.completions[yesterday] && !habit.completions[today]) {
          const missedCount = (habit.missedCount || 0) + 1;
          
          // Auto-adjust difficulty after 2 misses
          if (missedCount >= 2 && habit.currentDifficulty !== 'tiny') {
            toast({
              title: `${habit.name} adjusted to Tiny Mode`,
              description: "We've made it easier to help you get back on track!",
              duration: 5000,
            });
            
            return {
              ...habit,
              missedCount,
              currentDifficulty: 'tiny',
              lastMissedDate: yesterday,
            };
          }
          
          return {
            ...habit,
            missedCount,
            lastMissedDate: yesterday,
          };
        }
        
        // Reset missed count if completed
        if (habit.completions[today]) {
          return {
            ...habit,
            missedCount: 0,
          };
        }
        
        return habit;
      })
    );
  }, [toast]);

  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => {
      const aCompleted = a.completions[format(new Date(), 'yyyy-MM-dd')] || false;
      const bCompleted = b.completions[format(new Date(), 'yyyy-MM-dd')] || false;
      
      // Stacked habits come first if their prerequisite is complete
      if (a.stackedWithHabitId && b.stackedWithHabitId) {
        return 0;
      }
      if (a.stackedWithHabitId) {
        const prereq = habits.find(h => h.id === a.stackedWithHabitId);
        if (prereq?.completions[format(new Date(), 'yyyy-MM-dd')]) {
          return -1;
        }
      }
      if (b.stackedWithHabitId) {
        const prereq = habits.find(h => h.id === b.stackedWithHabitId);
        if (prereq?.completions[format(new Date(), 'yyyy-MM-dd')]) {
          return 1;
        }
      }
      
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
      currentDifficulty: 'medium',
      baseDifficulty: 'medium',
    };
    setHabits(prev => [...prev, habitToAdd]);
    saveHabit(habitToAdd);
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
          
          // Level up difficulty after 7 day streak
          let newDifficulty = h.currentDifficulty;
          if (newStreak >= 7 && h.currentDifficulty === 'tiny') {
            newDifficulty = 'easy';
          } else if (newStreak >= 14 && h.currentDifficulty === 'easy') {
            newDifficulty = 'medium';
          } else if (newStreak >= 21 && h.currentDifficulty === 'medium') {
            newDifficulty = 'hard';
          }
          
          updatedHabit = { 
            ...h, 
            completions: newCompletions, 
            streak: newStreak,
            currentDifficulty: newDifficulty,
            missedCount: 0,
          };
          return updatedHabit;
        }
        return h;
      })
    );

    if (updatedHabit) {
      updateHabit(updatedHabit);
    }

    if (updatedHabit && updatedHabit.completions[today]) {
      // Show reflection dialog if identity is set and habit is linked
      if (userIdentity && userIdentity.associatedHabits.includes(habitId)) {
        setReflectionDialogHabit(updatedHabit);
      } else {
        // Show regular motivation
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
    }
  };

  const handleResetStreak = (habitId: string) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === habitId ? { ...h, streak: 0, completions: {} } : h
      )
    );
    resetHabitStreak(habitId);
    toast({ title: 'Streak Reset', description: 'Your streak has been reset.' });
  };

  const handleUpdateTriggers = (habitId: string, triggers: HabitTrigger[]) => {
    let updated: Habit | undefined;
    setHabits(prevHabits =>
      prevHabits.map(h => {
        if (h.id === habitId) {
          updated = { ...h, triggers };
          return updated;
        }
        return h;
      })
    );
    // Handle habit stacking
    const stackedTrigger = triggers.find(t => t.type === 'after-habit');
    if (stackedTrigger) {
      setHabits(prevHabits =>
        prevHabits.map(h =>
          h.id === habitId ? { ...h, stackedWithHabitId: stackedTrigger.value } : h
        )
      );
    }

    if (updated) updateHabit(updated);
    
    toast({
      title: "Triggers Updated!",
      description: "Your implementation intentions have been saved.",
    });
  };

  const handleSaveIdentity = (identity: UserIdentity) => {
    setUserIdentity(identity);
    toast({
      title: "Identity Defined!",
      description: `You're on your way to becoming a ${identity.statement}.`,
    });
  };

  const handleSaveReflection = (reflection: Reflection, evidenceEntry?: EvidenceEntry) => {
    if (evidenceEntry && userIdentity) {
      const newEvidence = [...userIdentity.evidenceEntries, evidenceEntry];
      const newScore = Math.min(100, newEvidence.length * 2); // Simple scoring
      
      setUserIdentity({
        ...userIdentity,
        evidenceEntries: newEvidence,
        currentScore: newScore,
      });
    }
    
    toast({
      title: "Reflection Saved!",
      description: "Your progress has been recorded.",
    });
    
    setReflectionDialogHabit(null);
  };

  const handleSaveEnvironmentalDesign = (design: EnvironmentalDesign) => {
    setEnvironmentalDesigns(prev => ({
      ...prev,
      [design.habitId]: design,
    }));
    
    toast({
      title: "Environment Designed!",
      description: "Your environment is now optimized for success.",
    });
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header onAddHabit={() => setAddDialogOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Identity Section */}
            {!userIdentity && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-4">Start with Identity</h2>
                <p className="text-muted-foreground mb-6">
                  Your habits shape who you become. Define your ideal identity first.
                </p>
                <Button onClick={() => setIdentityDialogOpen(true)} size="lg">
                  <Target className="mr-2 h-5 w-5" />
                  Define Your Identity
                </Button>
              </div>
            )}
            
            {userIdentity && (
              <IdentityDashboard 
                identity={userIdentity} 
                onEditIdentity={() => setIdentityDialogOpen(true)}
              />
            )}
            
            {/* Progress Dashboard */}
            <ProgressDashboard
              progressData={progressData}
              weeklyGoal={weeklyGoal}
              weeklyCompletions={weeklyCompletions}
            />
            
            {/* Habits */}
            <div>
              <h1 className="text-3xl font-bold font-headline mb-6">Your Habits</h1>
              <HabitGrid
                habits={sortedHabits}
                onToggleCompletion={handleToggleCompletion}
                onOpenTriggers={(habit) => setTriggerDialogHabit(habit)}
                onOpenEnvironment={(habit) => setEnvironmentWizardHabit(habit)}
                onResetStreak={handleResetStreak}
              />
            </div>
          </div>
        </main>
      </div>
      
      {/* Dialogs */}
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
      
      {triggerDialogHabit && (
        <TriggerDialog
          isOpen={!!triggerDialogHabit}
          onOpenChange={(open) => !open && setTriggerDialogHabit(null)}
          habit={triggerDialogHabit}
          habits={habits}
          onUpdateTriggers={handleUpdateTriggers}
        />
      )}
      
      <IdentityDialog
        isOpen={identityDialogOpen}
        onOpenChange={setIdentityDialogOpen}
        habits={habits}
        identity={userIdentity}
        onSaveIdentity={handleSaveIdentity}
      />
      
      {reflectionDialogHabit && (
        <ReflectionDialog
          isOpen={!!reflectionDialogHabit}
          onOpenChange={(open) => !open && setReflectionDialogHabit(null)}
          habit={reflectionDialogHabit}
          identity={userIdentity}
          onSaveReflection={handleSaveReflection}
        />
      )}
      
      {environmentWizardHabit && (
        <EnvironmentWizard
          isOpen={!!environmentWizardHabit}
          onOpenChange={(open) => !open && setEnvironmentWizardHabit(null)}
          habit={environmentWizardHabit}
          environmentalDesign={environmentalDesigns[environmentWizardHabit.id]}
          onSaveDesign={handleSaveEnvironmentalDesign}
        />
      )}
    </>
  );
}
