"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";

const formSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  rating: z.string().min(1, "Please select a rating"),
  comment: z.string().min(10, "Please provide more detailed feedback"),
  category: z.string().min(1, "Please select a category"),
});

export function FeedbackForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceId: "",
      rating: "",
      comment: "",
      category: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Service</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the service to review" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Regular Cleaning - March 15, 2024</SelectItem>
                  <SelectItem value="2">Deep Cleaning - March 10, 2024</SelectItem>
                  <SelectItem value="3">Window Cleaning - March 5, 2024</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      <div className="flex items-center">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-primary text-primary mr-0.5"
                          />
                        ))}
                        {Array.from({ length: 5 - rating }).map((_, i) => (
                          <Star
                            key={i + rating}
                            className="h-4 w-4 text-muted-foreground mr-0.5"
                          />
                        ))}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="quality">Service Quality</SelectItem>
                  <SelectItem value="staff">Staff Performance</SelectItem>
                  <SelectItem value="timeliness">Timeliness</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="value">Value for Money</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please share your experience with our service..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Feedback</Button>
      </form>
    </Form>
  );
}