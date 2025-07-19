"use client"

import { format } from "date-fns"
import { Flame, Clock, MapPin, Link2, Heart, Brain, Settings, RotateCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Habit } from "@/types"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/lucide-icon"

interface HabitCardProps {
  habit: Habit;
  onToggleCompletion: (habitId: string) => void;
  onOpenTriggers: (habit: Habit) => void;
  onOpenEnvironment: (habit: Habit) => void;
  onResetStreak: (habitId: string) => void;
  stackedFromHabit?: Habit | null;
}

export default function HabitCard({
  habit,
  onToggleCompletion,
  onOpenTriggers,
  onOpenEnvironment,
  onResetStreak,
  stackedFromHabit
}: HabitCardProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompletedToday = habit.completions[today] || false;

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'tiny': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'easy': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'time': return Clock;
      case 'location': return MapPin;
      case 'after-habit': return Link2;
      case 'emotional': return Heart;
      case 'environmental': return Brain;
      default: return Clock;
    }
  };

  const shouldShowTinyHabitSuggestion = habit.missedCount && habit.missedCount >= 2 && !isCompletedToday;

  return (
    <Card className={cn(
      "flex flex-col transition-all duration-300 relative overflow-hidden",
      isCompletedToday ? "bg-secondary/50 border-primary/50" : "bg-card",
      shouldShowTinyHabitSuggestion && "border-yellow-500/50"
    )}>
      {stackedFromHabit && (
        <div className="absolute top-0 left-0 right-0 bg-primary/10 px-3 py-1">
          <p className="text-xs flex items-center gap-1">
            <Link2 className="h-3 w-3" />
            After: {stackedFromHabit.name}
          </p>
        </div>
      )}
      
      <CardHeader className={stackedFromHabit ? "pt-8" : ""}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-4 flex-1">
            <Icon name={habit.icon} className="h-8 w-8 text-primary shrink-0" />
            <div className="flex-1">
              <CardTitle className="font-headline text-lg leading-tight">{habit.name}</CardTitle>
              {habit.description && <CardDescription className="pt-1">{habit.description}</CardDescription>}
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenTriggers(habit)}
              title="Set triggers"
            >
              <Clock className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenEnvironment(habit)}
              title="Environmental design"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onResetStreak(habit.id)}
              title="Reset streak"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Difficulty Badge */}
        {habit.currentDifficulty && (
          <div className="mt-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs", getDifficultyColor(habit.currentDifficulty))}
            >
              {habit.currentDifficulty} mode
            </Badge>
          </div>
        )}

        {/* Active Triggers */}
        {habit.triggers && habit.triggers.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {habit.triggers.slice(0, 2).map(trigger => {
              const IconComponent = getTriggerIcon(trigger.type);
              return (
                <Badge key={trigger.id} variant="secondary" className="text-xs">
                  <IconComponent className="h-3 w-3 mr-1" />
                  {trigger.type === 'time' ? trigger.value : trigger.type}
                </Badge>
              );
            })}
            {habit.triggers.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{habit.triggers.length - 2} more
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-grow">
        {shouldShowTinyHabitSuggestion && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Struggling? Try Tiny Mode!</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              Make it easier: Just 2 minutes or 1 small action
            </p>
          </div>
        )}

        {habit.temptationBundle && (
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium">Bundled with:</span> {habit.temptationBundle}
          </div>
        )}
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
