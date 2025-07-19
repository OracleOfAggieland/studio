"use client"

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Habit, HabitTrigger } from "@/types";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

type TriggerDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  habit: Habit;
  habits: Habit[]; // For habit stacking
  onUpdateTriggers: (habitId: string, triggers: HabitTrigger[]) => void;
};

const triggerSchema = z.object({
  type: z.enum(['time', 'location', 'after-habit', 'emotional', 'environmental']),
  value: z.string().min(1, "Please provide a trigger value"),
  stackedHabitId: z.string().optional(),
});

export default function TriggerDialog({ isOpen, onOpenChange, habit, habits, onUpdateTriggers }: TriggerDialogProps) {
  const [triggers, setTriggers] = useState<HabitTrigger[]>(habit.triggers || []);
  
  const form = useForm<z.infer<typeof triggerSchema>>({
    resolver: zodResolver(triggerSchema),
    defaultValues: {
      type: 'time',
      value: '',
    },
  });

  const triggerType = form.watch('type');

  function onSubmit(values: z.infer<typeof triggerSchema>) {
    const newTrigger: HabitTrigger = {
      id: uuidv4(),
      type: values.type,
      value: values.type === 'after-habit' && values.stackedHabitId 
        ? values.stackedHabitId 
        : values.value,
      habitId: habit.id,
      successRate: 0,
      totalAttempts: 0,
      successfulAttempts: 0,
    };
    
    const updatedTriggers = [...triggers, newTrigger];
    setTriggers(updatedTriggers);
    form.reset();
  }

  function removeTrigger(triggerId: string) {
    setTriggers(triggers.filter(t => t.id !== triggerId));
  }

  function saveTriggers() {
    onUpdateTriggers(habit.id, triggers);
    onOpenChange(false);
  }

  const getTriggerLabel = (trigger: HabitTrigger) => {
    switch (trigger.type) {
      case 'time':
        return `At ${trigger.value}`;
      case 'location':
        return `When at ${trigger.value}`;
      case 'after-habit':
        const stackedHabit = habits.find(h => h.id === trigger.value);
        return `After "${stackedHabit?.name || 'Unknown habit'}"`;
      case 'emotional':
        return `When feeling ${trigger.value}`;
      case 'environmental':
        return `When I see ${trigger.value}`;
      default:
        return trigger.value;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set Implementation Intentions</DialogTitle>
          <DialogDescription>
            Create "When-Then" triggers to make "{habit.name}" automatic.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Triggers */}
          {triggers.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Current Triggers:</p>
              <div className="flex flex-wrap gap-2">
                {triggers.map(trigger => (
                  <Badge key={trigger.id} variant="secondary" className="pr-1">
                    {getTriggerLabel(trigger)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2"
                      onClick={() => removeTrigger(trigger.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add New Trigger Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a trigger type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="time">Time-based</SelectItem>
                        <SelectItem value="location">Location-based</SelectItem>
                        <SelectItem value="after-habit">After another habit</SelectItem>
                        <SelectItem value="emotional">Emotional state</SelectItem>
                        <SelectItem value="environmental">Environmental cue</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {triggerType === 'time' && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormDescription>
                        When will you do this habit?
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}

              {triggerType === 'location' && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., home, office, gym" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {triggerType === 'after-habit' && (
                <FormField
                  control={form.control}
                  name="stackedHabitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Habit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a habit to stack after" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {habits
                            .filter(h => h.id !== habit.id)
                            .map(h => (
                              <SelectItem key={h.id} value={h.id}>
                                {h.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Stack this habit after completing another one
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}

              {triggerType === 'emotional' && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emotional State</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., stressed, happy, tired" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {triggerType === 'environmental' && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environmental Cue</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., my running shoes, coffee maker" {...field} />
                      </FormControl>
                      <FormDescription>
                        What visual cue will remind you?
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Trigger
              </Button>
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={saveTriggers}>Save Triggers</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
