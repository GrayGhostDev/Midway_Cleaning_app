import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface MaintenanceRequestDialogProps {
  onSubmit: (request: {
    equipmentId: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    requestedBy: string;
    notes: string;
  }) => void;
  equipment: Array<{ id: string; name: string }>;
}

export function MaintenanceRequestDialog({
  onSubmit,
  equipment,
}: MaintenanceRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    equipmentId: '',
    description: '',
    priority: 'medium' as const,
    requestedBy: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setOpen(false);
    setFormData({
      equipmentId: '',
      description: '',
      priority: 'medium',
      requestedBy: '',
      notes: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Request Maintenance</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Maintenance</DialogTitle>
          <DialogDescription>
            Submit a maintenance request for equipment that needs attention.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="equipment" className="text-sm font-medium">
              Equipment
            </label>
            <Select
              value={formData.equipmentId}
              onValueChange={(value) =>
                setFormData({ ...formData, equipmentId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipment.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priority
            </label>
            <Select
              value={formData.priority}
              onValueChange={(value: 'low' | 'medium' | 'high') =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="requestedBy" className="text-sm font-medium">
              Requested By
            </label>
            <Input
              id="requestedBy"
              value={formData.requestedBy}
              onChange={(e) =>
                setFormData({ ...formData, requestedBy: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
