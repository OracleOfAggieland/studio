"use client"

import type { Habit } from "@/types"
import HabitCard from "./habit-card"
import { prefilledHabits } from "@/data/prefilled-habits"

interface HabitGridProps {
  habits: Habit[];
  onToggleCompletion: (habitId: string) => void;
  onOpenTriggers: (habit: Habit) => void;
  onOpenEnvironment: (habit: Habit) => void;
  onResetStreak: (habitId: string) => void;
}

export default function HabitGrid({
  habits,
  onToggleCompletion,
  onOpenTriggers,
  onOpenEnvironment,
  onResetStreak
}: HabitGridProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">No habits yet!</h2>
        <p className="text-muted-foreground">Click "New Habit" to start building a better you.</p>
        <div className="text-left max-w-md mx-auto">
          <h3 className="font-semibold">Try one of these habits:</h3>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            {prefilledHabits.map(h => (
              <li key={h.name}>
                <span className="font-medium">{h.name}</span> – {h.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {habits.map(habit => {
        const stackedFromHabit = habit.stackedWithHabitId 
          ? habits.find(h => h.id === habit.stackedWithHabitId) 
          : null;
          
        return (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggleCompletion={onToggleCompletion}
            onOpenTriggers={onOpenTriggers}
            onOpenEnvironment={onOpenEnvironment}
            onResetStreak={onResetStreak}
            stackedFromHabit={stackedFromHabit}
          />
        );
      })}
    </div>
  )
}
