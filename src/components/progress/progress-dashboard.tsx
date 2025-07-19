import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target } from 'lucide-react';
import type { ProgressData } from '@/types';
import { WeeklyProgressChart } from './weekly-progress-chart';

interface ProgressDashboardProps {
  progressData: ProgressData[];
  weeklyGoal: number;
  weeklyCompletions: number;
}

export default function ProgressDashboard({ progressData, weeklyGoal, weeklyCompletions }: ProgressDashboardProps) {
  const weeklyProgressPercentage = weeklyGoal > 0 ? (weeklyCompletions / weeklyGoal) * 100 : 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>This Week's Progress</CardTitle>
          <CardDescription>A visual summary of your habit completions this week.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <WeeklyProgressChart data={progressData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Weekly Goal</CardTitle>
          <CardDescription>Stay consistent to build momentum.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-center p-6 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-4">
                    <Trophy className="h-10 w-10 text-amber-500" />
                    <div>
                        <p className="text-3xl font-bold">{weeklyCompletions}</p>
                        <p className="text-sm text-muted-foreground">Completions</p>
                    </div>
                </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between items-baseline">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span>Weekly Goal: {weeklyGoal}</span>
                  </div>
                  <span className="text-sm font-semibold">{Math.round(weeklyProgressPercentage)}%</span>
              </div>
              <Progress value={weeklyProgressPercentage} aria-label={`${Math.round(weeklyProgressPercentage)}% of weekly goal complete`} />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
