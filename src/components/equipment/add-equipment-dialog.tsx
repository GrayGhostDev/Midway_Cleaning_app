'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddEquipmentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAdd?: (equipment: {
    name: string;
    type: string;
    status: 'available' | 'in-use' | 'maintenance';
    location: string;
    lastMaintenance: string;
  }) => void;
}

export function AddEquipmentDialog({ 
  open, 
  onOpenChange = () => {},
  onAdd = () => {} 
}: AddEquipmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'available' as const,
    location: '',
    lastMaintenance: new Date().toISOString().split('T')[0],
  });

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange(newOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    handleOpenChange(false);
    setFormData({
      name: '',
      type: '',
      status: 'available',
      location: '',
      lastMaintenance: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <Dialog open={open ?? isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
          <DialogDescription>
            Enter the details of the new equipment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastMaintenance">Last Maintenance</Label>
              <Input
                id="lastMaintenance"
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Equipment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
