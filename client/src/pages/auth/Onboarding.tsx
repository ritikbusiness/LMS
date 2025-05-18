import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Form schema
const OnboardingSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  year: z.string().min(1, { message: "Please select your year." }),
  branch: z.string().min(1, { message: "Please enter your branch/department." }),
  domain: z.string().min(1, { message: "Please select your field of interest." }),
});

export default function OnboardingPage() {
  const { user, refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if user has already completed onboarding
  useEffect(() => {
    if (user && user.domain) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Initialize form with default values
  const form = useForm<z.infer<typeof OnboardingSchema>>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      year: user?.year || "",
      branch: user?.branch || "",
      domain: user?.domain || "",
    },
  });

  async function onSubmit(data: z.infer<typeof OnboardingSchema>) {
    setIsSubmitting(true);
    try {
      // Submit onboarding data
      await apiRequest("POST", "/api/users/onboarding", data);
      
      // Refresh user data
      await refreshUser();
      
      toast({
        title: "Onboarding Complete",
        description: "Your profile has been updated successfully.",
      });
      
      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast({
        title: "Onboarding Failed",
        description: "There was a problem completing your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to Kayago LMS</CardTitle>
          <CardDescription className="text-center">
            Please complete your profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1st">First Year</SelectItem>
                        <SelectItem value="2nd">Second Year</SelectItem>
                        <SelectItem value="3rd">Third Year</SelectItem>
                        <SelectItem value="4th">Fourth Year</SelectItem>
                        <SelectItem value="PG">Post Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch / Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Interest</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your interest" />
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
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Complete Onboarding"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  );
}