"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Habit, UserIdentity, Reflection, EvidenceEntry } from "@/types";
import { Sparkles, Heart } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

type ReflectionDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  habit: Habit;
  identity?: UserIdentity | null;
  onSaveReflection: (reflection: Reflection, evidenceEntry?: EvidenceEntry) => void;
};

export default function ReflectionDialog({ 
  isOpen, 
  onOpenChange, 
  habit, 
  identity,
  onSaveReflection 
}: ReflectionDialogProps) {
  const [feeling, setFeeling] = useState<'amazing' | 'good' | 'neutral' | 'challenging'>('good');
  const [note, setNote] = useState('');
  const [identityAlignment, setIdentityAlignment] = useState([3]);

  const isHabitLinkedToIdentity = identity && identity.associatedHabits.includes(habit.id);

  function handleSave() {
    const reflection: Reflection = {
      id: uuidv4(),
      habitId: habit.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      feeling,
      note: note.trim() || undefined,
      identityAlignment: isHabitLinkedToIdentity ? identityAlignment[0] : undefined,
    };

    let evidenceEntry: EvidenceEntry | undefined;
    if (isHabitLinkedToIdentity && identity) {
      evidenceEntry = {
        id: uuidv4(),
        habitId: habit.id,
        habitName: habit.name,
        timestamp: new Date().toISOString(),
        reflection: note.trim() || undefined,
        identityAlignment: identityAlignment[0],
      };
    }

    onSaveReflection(reflection, evidenceEntry);
    
    // Reset form
    setFeeling('good');
    setNote('');
    setIdentityAlignment([3]);
    onOpenChange(false);
  }

  const feelingEmojis = {
    amazing: '🌟',
    good: '😊',
    neutral: '😐',
    challenging: '💪'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Reflection
          </DialogTitle>
          <DialogDescription>
            Great job completing "{habit.name}"! Take a moment to reflect.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Feeling Selection */}
          <div className="space-y-3">
            <Label className="text-base">How did completing this habit feel?</Label>
            <RadioGroup value={feeling} onValueChange={(value) => setFeeling(value as any)}>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(feelingEmojis).map(([value, emoji]) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={value} />
                    <Label 
                      htmlFor={value} 
                      className="flex items-center gap-2 cursor-pointer capitalize"
                    >
                      <span className="text-2xl">{emoji}</span>
                      {value}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Identity Alignment (if applicable) */}
          {isHabitLinkedToIdentity && identity && (
            <div className="space-y-3">
              <Label className="text-base flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                How much did this make you feel like a {identity.statement}?
              </Label>
              <div className="px-4">
                <Slider
                  value={identityAlignment}
                  onValueChange={setIdentityAlignment}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Not at all</span>
                  <span>Somewhat</span>
                  <span>Very much</span>
                </div>
              </div>
              <p className="text-sm text-center font-medium">
                Alignment Score: {identityAlignment[0]}/5
              </p>
            </div>
          )}

          {/* Optional Note */}
          <div className="space-y-2">
            <Label htmlFor="note" className="text-base">
              Any thoughts? (optional)
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What made this easy or hard? Any insights?"
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Skip</Button>
          <Button onClick={handleSave}>Save Reflection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
