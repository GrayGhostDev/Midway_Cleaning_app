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

interface AddInventoryDialogProps {
  onAdd: (item: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    reorderPoint: number;
    lastRestocked: string;
    location: string;
  }) => void;
}

export function AddInventoryDialog({ onAdd }: AddInventoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    reorderPoint: 0,
    lastRestocked: new Date().toISOString().split('T')[0],
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setOpen(false);
    setFormData({
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      reorderPoint: 0,
      lastRestocked: new Date().toISOString().split('T')[0],
      location: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new item to the inventory.
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
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cleaning-solutions">
                  Cleaning Solutions
                </SelectItem>
                <SelectItem value="cleaning-supplies">
                  Cleaning Supplies
                </SelectItem>
                <SelectItem value="paper-products">Paper Products</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="unit" className="text-sm font-medium">
                Unit
              </label>
              <Select
                value={formData.unit}
                onValueChange={(value) =>
                  setFormData({ ...formData, unit: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="bottles">Bottles</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                  <SelectItem value="packs">Packs</SelectItem>
                  <SelectItem value="rolls">Rolls</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="reorderPoint" className="text-sm font-medium">
              Reorder Point
            </label>
            <Input
              id="reorderPoint"
              type="number"
              min="0"
              value={formData.reorderPoint}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reorderPoint: parseInt(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
