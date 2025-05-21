import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CheckCircle, ChevronLeft, ChevronRight, Film, BookOpen } from 'lucide-react';

// Course creation form schema
const courseSchema = z.object({
  // Step 1: Teaching Experience
  teachingExperience: z.enum(['in_person_informal', 'in_person_professional', 'online', 'other']),
  
  // Step 2: Video Experience
  videoExperience: z.enum(['beginner', 'some_knowledge', 'experienced', 'videos_ready']),
  
  // Step 3: Audience
  audienceSize: z.enum(['none', 'small', 'sizeable']),
  
  // Common fields
  title: z.string().min(10, 'Title must be at least 10 characters').max(60, 'Title must be less than 60 characters'),
  category: z.string().min(1, 'Please select a category'),
  targetAudience: z.string().min(10, 'Please describe your target audience')
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CourseCreation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      teachingExperience: 'in_person_informal',
      videoExperience: 'beginner',
      audienceSize: 'none',
      title: '',
      category: '',
      targetAudience: ''
    }
  });

  // Define steps with Udemy style
  const steps = [
    { id: 'teaching', label: 'Step 1 of 3', title: 'Share your knowledge' },
    { id: 'video', label: 'Step 2 of 3', title: 'Create a course' },
    { id: 'audience', label: 'Step 3 of 3', title: 'Expand your reach' }
  ];

  // Calculate progress percentage based on current step
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
    } else {
      // Submit the form when on the last step
      form.handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(current => current - 1);
    }
  };

  const onSubmit = (data: CourseFormValues) => {
    toast({
      title: "Course information saved",
      description: "You'll be redirected to continue setting up your course.",
    });
    
    // In a real app, we would save the data to the backend here
    console.log("Form data:", data);
    
    // Redirect to the course structure page after submission
    setTimeout(() => {
      setLocation('/instructor/course-structure');
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6">
      {/* Header with logo and step indicator */}
      <div className="border-b pb-4 mb-6 flex items-center">
        <div className="text-xl font-bold">Desired Career Academy</div>
        <div className="ml-auto text-sm">
          Step {currentStep + 1} of {steps.length}
        </div>
        <Button variant="ghost" className="ml-4 px-2" onClick={() => setLocation('/dashboard')}>
          Exit
        </Button>
      </div>

      {/* Progress bar */}
      <div className="mb-1">
        <div className="h-1 bg-purple-100 w-full rounded-sm overflow-hidden">
          <div 
            className="h-full bg-purple-600 transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        {/* Step 1: Teaching Experience */}
        {currentStep === 0 && (
          <div>
            <h1 className="text-3xl font-bold mb-4">{steps[currentStep].title}</h1>
            <p className="mb-6 text-gray-600">
              Desired Career Academy values skill-based experiences that give students the chance to learn actionable skills. Whether
              you have experience teaching, or it's your first time, we'll help you package your knowledge into an online course
              that improves student lives.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">What kind of teaching have you done before?</h2>
            
            <div className="mt-6 mb-12 flex">
              <div className="w-2/3">
                <FormField
                  control={form.control}
                  name="teachingExperience"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="space-y-3"
                        >
                          <div className="border rounded-md p-3 hover:border-gray-400 cursor-pointer">
                            <RadioGroupItem value="in_person_informal" id="in_person_informal" className="sr-only" />
                            <Label htmlFor="in_person_informal" className="flex-1 cursor-pointer font-medium">
                              In person, informally
                            </Label>
                          </div>
                          
                          <div className="border rounded-md p-3 hover:border-gray-400 cursor-pointer">
                            <RadioGroupItem value="in_person_professional" id="in_person_professional" className="sr-only" />
                            <Label htmlFor="in_person_professional" className="flex-1 cursor-pointer font-medium">
                              In person, professionally
                            </Label>
                          </div>
                          
                          <div className="border rounded-md p-3 hover:border-gray-400 cursor-pointer">
                            <RadioGroupItem value="online" id="online" className="sr-only" />
                            <Label htmlFor="online" className="flex-1 cursor-pointer font-medium">
                              Online
                            </Label>
                          </div>
                          
                          <div className="border rounded-md p-3 hover:border-gray-400 cursor-pointer">
                            <RadioGroupItem value="other" id="other" className="sr-only" />
                            <Label htmlFor="other" className="flex-1 cursor-pointer font-medium">
                              Other
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="w-1/3 pl-8 flex items-center justify-center">
                <img 
                  src="https://s.udemycdn.com/teaching/onboarding/illustration-teacher.svg" 
                  alt="Teaching illustration" 
                  className="max-w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Video Experience */}
        {currentStep === 1 && (
          <div>
            <h1 className="text-3xl font-bold mb-4">{steps[currentStep].title}</h1>
            <p className="mb-6 text-gray-600">
              Over the years we've helped thousands of instructors learn how to record at home. No matter your experience
              level, you can become a video pro too. We'll equip you with the latest resources, tips, and support to help you
              succeed.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">How much of a video "pro" are you?</h2>
            
            <div className="mt-6 mb-12 flex">
              <div className="w-2/3">
                <FormField
                  control={form.control}
                  name="videoExperience"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="space-y-3"
                        >
                          <div className="border rounded-md p-3 hover:border-gray-400 cursor-pointer">
                            <RadioGroupItem value="beginner" id="beginner" className="sr-only" />
                            <Label htmlFor="beginner" className="flex-1 cursor-pointer font-medium">
                              I'm a beginner
                            </Label>
                          </div>
                          
                          <div className="border rounded-md p-3 hover:border-gray-400 cursor-pointer">
                            <RadioGroupItem value="some_knowledge" id="some_knowledge" className="sr-only" />
                            <Label htmlFor="some_knowledge" className="flex-1 cursor-pointer font-medium">
                              I have some knowledge
                            </Label>
                          </div>
                          
                          <div className="border rounded-md p-3 hover:border-gray-400 cursor-pointer">
                            <RadioGroupItem value="experienced" id="experienced" className="sr-only" />
                            <Label htmlFor="experienced" className="flex-1 cursor-pointer font-medium">
                              I'm experienced
                            </Label>
                          </div>
                          
                          <div className="border rounded-md p-3 hover:border-gray-400 cursor-pointer">
                            <RadioGroupItem value="videos_ready" id="videos_ready" className="sr-only" />
                            <Label htmlFor="videos_ready" className="flex-1 cursor-pointer font-medium">
                              I have videos ready to upload
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="w-1/3 pl-8 flex items-center justify-center">
                <img 
                  src="https://s.udemycdn.com/teaching/onboarding/illustration-video.svg" 
                  alt="Video recording illustration" 
                  className="max-w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Audience */}
        {currentStep === 2 && (
          <div>
            <h1 className="text-3xl font-bold mb-4">{steps[currentStep].title}</h1>
            <p className="mb-6 text-gray-600">
              Once you publish your course, you can grow your student audience and make an impact with the support of
              Desired Career Academy marketplace promotions and also through your own marketing efforts. Together, we'll help the right
              students discover your course.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Do you have an audience to share your course with?</h2>
            
            <div className="mt-6 mb-12 flex">
              <div className="w-2/3">
                <FormField
                  control={form.control}
                  name="audienceSize"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="space-y-3"
                        >
                          <div className="border rounded-md p-3 hover:border-gray-400 cursor-pointer">
                            <RadioGroupItem value="none" id="none" className="sr-only" />
                            <Label htmlFor="none" className="flex-1 cursor-pointer font-medium">
                              Not at the moment
                            </Label>
                          </div>
                          
                          <div className="border rounded-md p-3 hover:border-gray-400 cursor-pointer">
                            <RadioGroupItem value="small" id="small" className="sr-only" />
                            <Label htmlFor="small" className="flex-1 cursor-pointer font-medium">
                              I have a small following
                            </Label>
                          </div>
                          
                          <div className="border rounded-md p-3 hover:border-gray-400 cursor-pointer">
                            <RadioGroupItem value="sizeable" id="sizeable" className="sr-only" />
                            <Label htmlFor="sizeable" className="flex-1 cursor-pointer font-medium">
                              I have a sizeable following
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="w-1/3 pl-8 flex items-center justify-center">
                <img 
                  src="https://s.udemycdn.com/teaching/onboarding/illustration-audience.svg" 
                  alt="Audience illustration" 
                  className="max-w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              onClick={prevStep}
              className="px-6"
            >
              Previous
            </Button>
          ) : (
            <div></div> // Empty div to maintain spacing
          )}

          <Button 
            onClick={nextStep}
            className="px-6 bg-purple-600 hover:bg-purple-700"
          >
            {currentStep < steps.length - 1 ? 'Continue' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
}