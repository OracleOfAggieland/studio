"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Habit, EnvironmentalDesign } from "@/types";
import { Eye, Heart, Zap, Gift, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type EnvironmentWizardProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  habit: Habit;
  environmentalDesign?: EnvironmentalDesign;
  onSaveDesign: (design: EnvironmentalDesign) => void;
};

export default function EnvironmentWizard({ 
  isOpen, 
  onOpenChange, 
  habit,
  environmentalDesign,
  onSaveDesign 
}: EnvironmentWizardProps) {
  const [design, setDesign] = useState<EnvironmentalDesign>({
    habitId: habit.id,
    makeItObvious: environmentalDesign?.makeItObvious || [],
    makeItAttractive: environmentalDesign?.makeItAttractive || [],
    makeItEasy: environmentalDesign?.makeItEasy || [],
    makeItSatisfying: environmentalDesign?.makeItSatisfying || [],
  });
  
  const [currentInputs, setCurrentInputs] = useState({
    obvious: '',
    attractive: '',
    easy: '',
    satisfying: '',
  });

  const addItem = (category: keyof typeof currentInputs) => {
    const value = currentInputs[category].trim();
    if (!value) return;

    const categoryMap = {
      obvious: 'makeItObvious',
      attractive: 'makeItAttractive',
      easy: 'makeItEasy',
      satisfying: 'makeItSatisfying',
    } as const;

    setDesign(prev => ({
      ...prev,
      [categoryMap[category]]: [...prev[categoryMap[category]], value],
    }));

    setCurrentInputs(prev => ({ ...prev, [category]: '' }));
  };

  const removeItem = (category: keyof EnvironmentalDesign, index: number) => {
    if (category === 'habitId') return;
    
    setDesign(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const suggestions = {
    makeItObvious: [
      "Place visual reminders where you'll see them",
      "Set items out the night before",
      "Use sticky notes in key locations",
      "Create a dedicated space for this habit"
    ],
    makeItAttractive: [
      "Bundle with something you enjoy",
      "Join a community doing the same",
      "Track progress visually",
      "Create a ritual around it"
    ],
    makeItEasy: [
      "Reduce steps needed to start",
      "Prepare everything in advance",
      "Start with 2 minutes only",
      "Remove friction points"
    ],
    makeItSatisfying: [
      "Create immediate rewards",
      "Track streaks visually",
      "Share wins with someone",
      "Celebrate small victories"
    ],
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Environmental Design Wizard</DialogTitle>
          <DialogDescription>
            Design your environment to make "{habit.name}" inevitable.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="obvious" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="obvious" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Obvious
            </TabsTrigger>
            <TabsTrigger value="attractive" className="text-xs">
              <Heart className="h-3 w-3 mr-1" />
              Attractive
            </TabsTrigger>
            <TabsTrigger value="easy" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Easy
            </TabsTrigger>
            <TabsTrigger value="satisfying" className="text-xs">
              <Gift className="h-3 w-3 mr-1" />
              Satisfying
            </TabsTrigger>
          </TabsList>

          <TabsContent value="obvious" className="space-y-4">
            <div>
              <Label className="text-base mb-2 block">Make It Obvious</Label>
              <p className="text-sm text-muted-foreground mb-4">
                How can you make cues for this habit more visible?
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a cue..."
                    value={currentInputs.obvious}
                    onChange={(e) => setCurrentInputs(prev => ({ ...prev, obvious: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('obvious')}
                  />
                  <Button size="sm" onClick={() => addItem('obvious')}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {design.makeItObvious.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {design.makeItObvious.map((item, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {item}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => removeItem('makeItObvious', index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                  <div className="space-y-1">
                    {suggestions.makeItObvious.map((suggestion, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {suggestion}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attractive" className="space-y-4">
            <div>
              <Label className="text-base mb-2 block">Make It Attractive</Label>
              <p className="text-sm text-muted-foreground mb-4">
                How can you make this habit more appealing?
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an attraction..."
                    value={currentInputs.attractive}
                    onChange={(e) => setCurrentInputs(prev => ({ ...prev, attractive: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('attractive')}
                  />
                  <Button size="sm" onClick={() => addItem('attractive')}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {design.makeItAttractive.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {design.makeItAttractive.map((item, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {item}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => removeItem('makeItAttractive', index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                  <div className="space-y-1">
                    {suggestions.makeItAttractive.map((suggestion, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {suggestion}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="easy" className="space-y-4">
            <div>
              <Label className="text-base mb-2 block">Make It Easy</Label>
              <p className="text-sm text-muted-foreground mb-4">
                How can you reduce friction for this habit?
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a simplification..."
                    value={currentInputs.easy}
                    onChange={(e) => setCurrentInputs(prev => ({ ...prev, easy: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('easy')}
                  />
                  <Button size="sm" onClick={() => addItem('easy')}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {design.makeItEasy.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {design.makeItEasy.map((item, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {item}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => removeItem('makeItEasy', index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                  <div className="space-y-1">
                    {suggestions.makeItEasy.map((suggestion, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {suggestion}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="satisfying" className="space-y-4">
            <div>
              <Label className="text-base mb-2 block">Make It Satisfying</Label>
              <p className="text-sm text-muted-foreground mb-4">
                How can you add immediate rewards?
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a reward..."
                    value={currentInputs.satisfying}
                    onChange={(e) => setCurrentInputs(prev => ({ ...prev, satisfying: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('satisfying')}
                  />
                  <Button size="sm" onClick={() => addItem('satisfying')}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {design.makeItSatisfying.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {design.makeItSatisfying.map((item, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {item}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => removeItem('makeItSatisfying', index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                  <div className="space-y-1">
                    {suggestions.makeItSatisfying.map((suggestion, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {suggestion}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            onSaveDesign(design);
            onOpenChange(false);
          }}>
            Save Design
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
