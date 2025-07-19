"use client"

import type { Habit } from "@/types"
import HabitCard from "./habit-card"

interface HabitGridProps {
  habits: Habit[];
  onToggleCompletion: (habitId: string) => void;
}

export default function HabitGrid({ habits, onToggleCompletion }: HabitGridProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
        <h2 className="text-xl font-semibold">No habits yet!</h2>
        <p className="text-muted-foreground mt-2">Click "New Habit" to start building a better you.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {habits.map(habit => (
        <HabitCard key={habit.id} habit={habit} onToggleCompletion={onToggleCompletion} />
      ))}
    </div>
  )
}
