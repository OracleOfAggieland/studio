"use client"

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Habit, UserIdentity } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Star, Target } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

type IdentityDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  habits: Habit[];
  identity?: UserIdentity | null;
  onSaveIdentity: (identity: UserIdentity) => void;
};

const identitySchema = z.object({
  statement: z.string().min(3, "Identity statement must be at least 3 characters"),
  associatedHabits: z.array(z.string()).min(1, "Select at least one habit"),
});

export default function IdentityDialog({ isOpen, onOpenChange, habits, identity, onSaveIdentity }: IdentityDialogProps) {
  const form = useForm<z.infer<typeof identitySchema>>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      statement: identity?.statement || '',
      associatedHabits: identity?.associatedHabits || [],
    },
  });

  function onSubmit(values: z.infer<typeof identitySchema>) {
    const newIdentity: UserIdentity = {
      id: identity?.id || uuidv4(),
      statement: values.statement,
      createdAt: identity?.createdAt || format(new Date(), 'yyyy-MM-dd'),
      associatedHabits: values.associatedHabits,
      evidenceEntries: identity?.evidenceEntries || [],
      currentScore: identity?.currentScore || 0,
    };
    
    onSaveIdentity(newIdentity);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Define Your Identity</DialogTitle>
          <DialogDescription>
            Who do you want to become? Your habits are votes for your future self.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="statement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Identity Statement
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">I am a</span>
                      <Input 
                        placeholder="writer, healthy person, leader..." 
                        {...field} 
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Complete the sentence: "I am a..."
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="associatedHabits"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Which habits support this identity?
                    </FormLabel>
                    <FormDescription>
                      Select habits that help you become this person
                    </FormDescription>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {habits.map((habit) => (
                      <FormField
                        key={habit.id}
                        control={form.control}
                        name="associatedHabits"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={habit.id}
                              className="flex items-center space-x-3 space-y-0 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(habit.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, habit.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== habit.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <div className="flex-1">
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {habit.name}
                                </FormLabel>
                                {habit.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {habit.description}
                                  </p>
                                )}
                              </div>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Identity</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
