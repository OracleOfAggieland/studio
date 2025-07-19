"use client"

import { format } from "date-fns"
import { Flame } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Habit } from "@/types"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/lucide-icon"

interface HabitCardProps {
  habit: Habit;
  onToggleCompletion: (habitId: string) => void;
}

export default function HabitCard({ habit, onToggleCompletion }: HabitCardProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompletedToday = habit.completions[today] || false;

  return (
    <Card className={cn(
      "flex flex-col transition-all duration-300",
      isCompletedToday ? "bg-secondary/50 border-primary/50" : "bg-card"
    )}>
      <CardHeader>
        <div className="flex items-center gap-4">
            <Icon name={habit.icon} className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-lg leading-tight">{habit.name}</CardTitle>
        </div>
        {habit.description && <CardDescription className="pt-2">{habit.description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Flame className={cn("h-6 w-6", habit.streak > 0 ? "text-amber-500 fill-current" : "text-muted-foreground")} />
          <span className="text-xl font-bold">{habit.streak}</span>
          <span className="text-sm text-muted-foreground">day streak</span>
        </div>
        <Button 
          variant={isCompletedToday ? "default" : "outline"} 
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => onToggleCompletion(habit.id)}
          aria-label={`Mark ${habit.name} as ${isCompletedToday ? 'incomplete' : 'complete'}`}
        >
          {isCompletedToday ? (
            <Icon name="Check" className="h-8 w-8" />
          ) : (
             <Icon name="Plus" className="h-8 w-8 text-muted-foreground" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
