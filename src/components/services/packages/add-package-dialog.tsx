'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  monthly: z.coerce.number().positive('Required'),
  quarterly: z.coerce.number().positive('Required'),
  annual: z.coerce.number().positive('Required'),
  discountValue: z.coerce.number().min(0).max(100).optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddPackageDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddPackageDialog({ open: controlledOpen, onOpenChange, onSuccess }: AddPackageDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', monthly: 0, quarterly: 0, annual: 0, discountValue: 0 },
  });

  async function onSubmit(values: FormValues) {
    try {
      const payload = {
        name: values.name,
        services: [],
        pricing: { monthly: values.monthly, quarterly: values.quarterly, annual: values.annual },
        discounts: values.discountValue
          ? [{ type: 'annual', value: values.discountValue, conditions: 'Annual subscription required' }]
          : [],
      };
      const res = await fetch('/api/services/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create package');
      toast({ title: 'Package created', description: `${values.name} has been added.` });
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch {
      toast({ title: 'Error', description: 'Failed to create package.', variant: 'destructive' });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Create Package</DialogTitle>
          <DialogDescription>Define a new service package with pricing tiers.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Package Name</FormLabel><FormControl><Input placeholder="Premium Package" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-3 gap-3">
              {(['monthly', 'quarterly', 'annual'] as const).map((tier) => (
                <FormField key={tier} control={form.control} name={tier} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{tier} ($)</FormLabel>
                    <FormControl><Input type="number" min={0} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
            </div>
            <FormField control={form.control} name="discountValue" render={({ field }) => (
              <FormItem><FormLabel>Annual Discount (%)</FormLabel><FormControl><Input type="number" min={0} max={100} placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Package'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
