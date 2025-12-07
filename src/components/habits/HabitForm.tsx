import { useState } from 'react';
import { Habit, HabitCategory, HabitFrequency } from '@/types/habit';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHabits } from '@/context/HabitContext';
import { getHabitColor } from '@/utils/habitHelpers';

interface HabitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editHabit?: Habit | null;
}

const HabitForm = ({ open, onOpenChange, editHabit }: HabitFormProps) => {
  const { addHabit, updateHabit } = useHabits();
  const [name, setName] = useState(editHabit?.name || '');
  const [description, setDescription] = useState(editHabit?.description || '');
  const [category, setCategory] = useState<HabitCategory>(editHabit?.category || 'other');
  const [frequency, setFrequency] = useState<HabitFrequency>(editHabit?.frequency || 'daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    const habitData = {
      name: name.trim(),
      description: description.trim(),
      category,
      frequency,
      color: getHabitColor(category),
    };

    if (editHabit) {
      updateHabit(editHabit.id, habitData);
    } else {
      addHabit(habitData);
    }

    onOpenChange(false);
    setName('');
    setDescription('');
    setCategory('other');
    setFrequency('daily');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editHabit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Exercise"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about this habit..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as HabitCategory)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as HabitFrequency)}>
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editHabit ? 'Update' : 'Create'} Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;
