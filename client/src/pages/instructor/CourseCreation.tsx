import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { CheckCircle, ChevronLeft, ChevronRight, Plus, Upload, Play, Film, BookOpen } from 'lucide-react';

// Step indicators for course creation process
const steps = [
  { id: 'type', label: 'Course Type', description: 'What type of content will you create?' },
  { id: 'title', label: 'Course Title', description: 'What will you name your course?' },
  { id: 'category', label: 'Category', description: 'Choose the best category for your course' },
  { id: 'time', label: 'Time Commitment', description: 'How much time can you spend creating your course?' },
  { id: 'audience', label: 'Target Audience', description: 'Who are you creating this course for?' }
];

// Course creation form schema
const courseSchema = z.object({
  courseType: z.enum(['course', 'practice']),
  title: z.string().min(10, 'Title must be at least 10 characters').max(60, 'Title must be less than 60 characters'),
  category: z.string().min(1, 'Please select a category'),
  timeCommitment: z.enum(['very_busy', 'side_work', 'flexible', 'undecided']),
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
      courseType: 'course',
      title: '',
      category: '',
      timeCommitment: 'side_work',
      targetAudience: ''
    }
  });

  // Calculate progress percentage based on current step
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    // For simplicity in demo, we're not validating each step individually
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
    <div className="container max-w-5xl py-8 mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{steps[currentStep].label}</span>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-serif">{steps[currentStep].description}</CardTitle>
          <CardDescription>{getStepDescription(currentStep)}</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Course Type */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="courseType"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <div 
                          className={`flex flex-col p-6 border rounded-lg cursor-pointer hover:border-primary transition-all ${field.value === 'course' ? 'border-primary bg-primary/5' : 'border-border'}`}
                          onClick={() => field.onChange('course')}
                        >
                          <div className="flex justify-between items-start">
                            <Film className="h-8 w-8 text-primary mb-4" />
                            {field.value === 'course' && <CheckCircle className="h-5 w-5 text-primary" />}
                          </div>
                          <h3 className="text-lg font-medium mb-2">Course</h3>
                          <p className="text-sm text-muted-foreground">
                            Create rich learning experiences with video lectures, quizzes, coding exercises, etc.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="courseType"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <div 
                          className={`flex flex-col p-6 border rounded-lg cursor-pointer hover:border-primary transition-all ${field.value === 'practice' ? 'border-primary bg-primary/5' : 'border-border'}`}
                          onClick={() => field.onChange('practice')}
                        >
                          <div className="flex justify-between items-start">
                            <BookOpen className="h-8 w-8 text-primary mb-4" />
                            {field.value === 'practice' && <CheckCircle className="h-5 w-5 text-primary" />}
                          </div>
                          <h3 className="text-lg font-medium mb-2">Practice Test</h3>
                          <p className="text-sm text-muted-foreground">
                            Help students prepare for certification exams by providing practice questions.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Course Title */}
              {currentStep === 1 && (
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Title</FormLabel>
                      <FormDescription>
                        It's ok if you can't think of a good title now. You can change it later.
                      </FormDescription>
                      <FormControl>
                        <Input 
                          placeholder="E.g. Learn React JS from Scratch" 
                          {...field} 
                          className="mt-1.5"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs mt-1.5">
                        <FormMessage />
                        <span className={`${field.value.length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {field.value.length}/60
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {/* Step 3: Category */}
              {currentStep === 2 && (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormDescription>
                        If you're not sure about the right category, you can change it later.
                      </FormDescription>
                      <FormControl>
                        <select 
                          className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                          {...field}
                        >
                          <option value="">Choose a category</option>
                          <option value="Software_Development">Software Development</option>
                          <option value="Data_Analytics">Data Analytics</option>
                          <option value="Cloud_DevOps">Cloud & DevOps</option>
                          <option value="AI_ML">AI & Machine Learning</option>
                          <option value="Web_Development">Web Development</option>
                          <option value="IT_Support">IT Support</option>
                          <option value="Networking_Security">Networking & Security</option>
                          <option value="Project_Management">Project Management</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 4: Time Commitment */}
              {currentStep === 3 && (
                <FormField
                  control={form.control}
                  name="timeCommitment"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>How much time can you spend creating your course per week?</FormLabel>
                      <FormDescription>
                        There's no wrong answer. We can help you achieve your goals even if you don't have much time.
                      </FormDescription>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="space-y-3 mt-3"
                        >
                          <div className={`flex items-center space-x-2 rounded-md border p-4 ${field.value === 'very_busy' ? 'border-primary bg-primary/5' : ''}`}>
                            <RadioGroupItem value="very_busy" id="very_busy" />
                            <Label htmlFor="very_busy" className="flex-1 cursor-pointer">
                              I'm very busy right now (0-2 hours)
                            </Label>
                          </div>
                          
                          <div className={`flex items-center space-x-2 rounded-md border p-4 ${field.value === 'side_work' ? 'border-primary bg-primary/5' : ''}`}>
                            <RadioGroupItem value="side_work" id="side_work" />
                            <Label htmlFor="side_work" className="flex-1 cursor-pointer">
                              I'll work on this on the side (2-4 hours)
                            </Label>
                          </div>
                          
                          <div className={`flex items-center space-x-2 rounded-md border p-4 ${field.value === 'flexible' ? 'border-primary bg-primary/5' : ''}`}>
                            <RadioGroupItem value="flexible" id="flexible" />
                            <Label htmlFor="flexible" className="flex-1 cursor-pointer">
                              I have lots of flexibility (5+ hours)
                            </Label>
                          </div>
                          
                          <div className={`flex items-center space-x-2 rounded-md border p-4 ${field.value === 'undecided' ? 'border-primary bg-primary/5' : ''}`}>
                            <RadioGroupItem value="undecided" id="undecided" />
                            <Label htmlFor="undecided" className="flex-1 cursor-pointer">
                              I haven't yet decided if I have time
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 5: Target Audience */}
              {currentStep === 4 && (
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Who is this course for?</FormLabel>
                      <FormDescription>
                        Write a clear description of the intended learners for your course who will find your course content valuable.
                      </FormDescription>
                      <FormControl>
                        <Textarea 
                          placeholder="Example: This course is designed for beginners with no prior programming experience who want to learn web development..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </CardContent>

        <div className="p-6 pt-0 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button onClick={nextStep}>
            {currentStep < steps.length - 1 ? (
              <>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              'Create Course'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function getStepDescription(step: number): string {
  switch (step) {
    case 0:
      return "First, let's find out what type of course you're making.";
    case 1:
      return "It's ok if you can't think of a good title now. You can change it later.";
    case 2:
      return "If you're not sure about the right category, you can change it later.";
    case 3:
      return "There's no wrong answer. We can help you achieve your goals even if you don't have much time.";
    case 4:
      return "Define who your ideal students are so they can find your course.";
    default:
      return "";
  }
}