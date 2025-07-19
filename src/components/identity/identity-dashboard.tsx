"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { UserIdentity, EvidenceEntry } from '@/types';
import { Trophy, Target, Calendar, TrendingUp, Star, Sparkles } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface IdentityDashboardProps {
  identity: UserIdentity | null;
  onEditIdentity: () => void;
}

export default function IdentityDashboard({ identity, onEditIdentity }: IdentityDashboardProps) {
  if (!identity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Define Your Identity</CardTitle>
          <CardDescription>
            Start building your ideal self by defining who you want to become.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onEditIdentity} className="w-full">
            <Target className="mr-2 h-4 w-4" />
            Set Your Identity
          </Button>
        </CardContent>
      </Card>
    );
  }

  const recentEvidence = identity.evidenceEntries.slice(-5).reverse();
  const averageAlignment = identity.evidenceEntries.length > 0
    ? identity.evidenceEntries.reduce((sum, entry) => sum + entry.identityAlignment, 0) / identity.evidenceEntries.length
    : 0;

  const getAlignmentColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-blue-600';
    if (score >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIdentityBadge = () => {
    const totalEntries = identity.evidenceEntries.length;
    if (totalEntries >= 100) return { name: 'Master', icon: '👑', color: 'bg-purple-500' };
    if (totalEntries >= 50) return { name: 'Expert', icon: '🏆', color: 'bg-yellow-500' };
    if (totalEntries >= 25) return { name: 'Practitioner', icon: '⭐', color: 'bg-blue-500' };
    if (totalEntries >= 10) return { name: 'Apprentice', icon: '🌟', color: 'bg-green-500' };
    if (totalEntries >= 1) return { name: 'Beginner', icon: '🌱', color: 'bg-gray-500' };
    return null;
  };

  const badge = getIdentityBadge();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Identity Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Your Identity</CardTitle>
            <Button variant="ghost" size="sm" onClick={onEditIdentity}>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold">I am a {identity.statement}</p>
            {badge && (
              <Badge 
                variant="secondary" 
                className={`mt-2 ${badge.color} text-white border-0`}
              >
                <span className="mr-1">{badge.icon}</span>
                {badge.name}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Identity Score</span>
              <span className="font-semibold">{Math.round(identity.currentScore)}%</span>
            </div>
            <Progress value={identity.currentScore} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <p className="text-2xl font-bold">{identity.evidenceEntries.length}</p>
              <p className="text-xs text-muted-foreground">Evidence Entries</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${getAlignmentColor(averageAlignment)}`}>
                {averageAlignment.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Avg. Alignment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Journal */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Evidence Journal
          </CardTitle>
          <CardDescription>
            Every completed habit is evidence of your identity transformation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentEvidence.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Complete habits to build evidence of your new identity</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {recentEvidence.map((entry) => (
                  <div
                    key={entry.id}
                    className="border rounded-lg p-4 space-y-2 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{entry.habitName}</p>
                        {entry.reflection && (
                          <p className="text-sm text-muted-foreground mt-1">
                            "{entry.reflection}"
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < entry.identityAlignment
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
