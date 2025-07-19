"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface HeaderProps {
  onAddHabit: () => void;
}

export default function Header({ onAddHabit }: HeaderProps) {
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between h-16">
        <h1 className="text-2xl font-bold text-primary font-headline">Habitual</h1>
        <Button onClick={onAddHabit}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>
    </header>
  )
}
