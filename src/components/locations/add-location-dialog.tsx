import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddLocationDialogProps {
  onAdd: (location: {
    name: string;
    address: string;
    type: string;
    size: number;
    cleaningFrequency: string;
    lastCleaned: string;
    nextScheduled: string;
  }) => void;
}

export function AddLocationDialog({ onAdd }: AddLocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: '',
    size: 0,
    cleaningFrequency: '',
    lastCleaned: new Date().toISOString().split('T')[0],
    nextScheduled: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setOpen(false);
    setFormData({
      name: '',
      address: '',
      type: '',
      size: 0,
      cleaningFrequency: '',
      lastCleaned: new Date().toISOString().split('T')[0],
      nextScheduled: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Location</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new cleaning location.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="size" className="text-sm font-medium">
                Size (sq ft)
              </label>
              <Input
                id="size"
                type="number"
                min="0"
                value={formData.size}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    size: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="cleaningFrequency" className="text-sm font-medium">
              Cleaning Frequency
            </label>
            <Select
              value={formData.cleaningFrequency}
              onValueChange={(value) =>
                setFormData({ ...formData, cleaningFrequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="lastCleaned" className="text-sm font-medium">
                Last Cleaned
              </label>
              <Input
                id="lastCleaned"
                type="date"
                value={formData.lastCleaned}
                onChange={(e) =>
                  setFormData({ ...formData, lastCleaned: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="nextScheduled" className="text-sm font-medium">
                Next Scheduled
              </label>
              <Input
                id="nextScheduled"
                type="date"
                value={formData.nextScheduled}
                onChange={(e) =>
                  setFormData({ ...formData, nextScheduled: e.target.value })
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Location</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
