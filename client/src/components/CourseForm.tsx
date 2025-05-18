import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

// Validation schema for course form
const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  domain: z.enum(["DevOps", "MERN", "AI", "CyberSecurity", "BDE", "DigitalMarketing"], {
    required_error: "Domain is required",
  }),
  price: z.coerce.number().min(0, { message: "Price cannot be negative" }).default(0),
  thumbnailUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"], {
    required_error: "Status is required",
  }).default("draft"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  initialData?: CourseFormValues;
  courseId?: number;
  onSuccess?: () => void;
}

export default function CourseForm({ initialData, courseId, onSuccess }: CourseFormProps) {
  const { toast } = useToast();
  const isEditing = !!courseId;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      domain: undefined,
      price: 0,
      thumbnailUrl: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (initialData) {
      // Reset form with initial data if provided
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = async (values: CourseFormValues) => {
    try {
      // Remove empty strings to not overwrite with empty values
      const data = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== "")
      );

      if (isEditing) {
        // Update existing course
        await apiRequest("PUT", `/api/courses/${courseId}`, data);
        toast({
          title: "Course updated",
          description: "Course has been updated successfully",
        });
      } else {
        // Create new course
        await apiRequest("POST", "/api/courses", data);
        form.reset({
          title: "",
          description: "",
          domain: undefined,
          price: 0,
          thumbnailUrl: "",
          status: "draft",
        });
        toast({
          title: "Course created",
          description: "Course has been created successfully",
        });
      }

      // Invalidate courses cache
      queryClient.invalidateQueries({ queryKey: ['/api/instructor/courses'] });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: "Failed to save course. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to MERN Stack" {...field} />
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
                  placeholder="Comprehensive guide to building web applications with MongoDB, Express, React, and Node.js"
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="MERN">MERN Stack</SelectItem>
                    <SelectItem value="AI">Artificial Intelligence</SelectItem>
                    <SelectItem value="CyberSecurity">Cyber Security</SelectItem>
                    <SelectItem value="BDE">Big Data Engineering</SelectItem>
                    <SelectItem value="DigitalMarketing">Digital Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.01} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">
            {isEditing ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}