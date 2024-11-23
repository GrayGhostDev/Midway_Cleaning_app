"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ServiceService } from "@/lib/services/service.service";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  monthlyPrice: z.string().min(1, "Please enter monthly price"),
  quarterlyPrice: z.string().min(1, "Please enter quarterly price"),
  annualPrice: z.string().min(1, "Please enter annual price"),
  discountType: z.string().optional(),
  discountValue: z.string().optional(),
});

interface AddPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPackageDialog({ open, onOpenChange }: AddPackageDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      services: [],
      monthlyPrice: "",
      quarterlyPrice: "",
      annualPrice: "",
      discountType: "",
      discountValue: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await ServiceService.createServicePackage({
        name: values.name,
        services: values.services.map(id => ({
          serviceId: parseInt(id),
          frequency: "weekly",
        })),
        pricing: {
          monthly: parseFloat(values.monthlyPrice),
          quarterly: parseFloat(values.quarterlyPrice),
          annual: parseFloat(values.annualPrice),
        },
        discounts: values.discountType && values.discountValue
          ? [{
              type: values.discountType,
              value: parseFloat(values.discountValue),
            }]
          : undefined,
      });

      toast({
        title: "Package Created",
        description: "New service package has been created successfully.",
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service package. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Service Package</DialogTitle>
          <DialogDescription>
            Create a new package by combining multiple cleaning services.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Premium Cleaning Package" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the package and its benefits..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <FormLabel>Included Services</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {["1", "2", "3"].map((service) => (
                      <FormField
                        key={service}
                        control={form.control}
                        name="services"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(service)}
                                onCheckedChange={(checked) => {
                                  const values = new Set(field.value);
                                  checked ? values.add(service) : values.delete(service);
                                  field.onChange(Array.from(values));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Service {service}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="monthlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quarterlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quarterly Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annualPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new-customer">New Customer</SelectItem>
                        <SelectItem value="loyalty">Loyalty</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Create Package</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}