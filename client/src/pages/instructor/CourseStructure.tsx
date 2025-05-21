import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, ChevronLeft, ChevronRight, BookOpen, FilePlus, AlertCircle } from 'lucide-react';

export default function CourseStructure() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  return (
    <div className="container max-w-7xl py-8 mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 text-muted-foreground hover:text-foreground" 
        onClick={() => setLocation('/instructor/dashboard')}
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to courses
      </Button>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar navigation */}
        <div className="md:w-1/4">
          <Card className="sticky top-4">
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-4">Plan your course</h3>
              <RadioGroup defaultValue="course_structure" className="space-y-3">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="intended_learners" id="intended_learners" className="mt-1" />
                  <div>
                    <Label htmlFor="intended_learners" className="flex items-center cursor-pointer">
                      Intended learners
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Who this course is for</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border-l-2 border-primary pl-3 ml-2">
                  <RadioGroupItem value="course_structure" id="course_structure" className="mt-1" />
                  <div>
                    <Label htmlFor="course_structure" className="flex items-center cursor-pointer font-medium">
                      Course structure
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Plan your curriculum</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="setup_test_video" id="setup_test_video" className="mt-1" />
                  <div>
                    <Label htmlFor="setup_test_video" className="flex items-center cursor-pointer">
                      Setup & test video
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Create your recording environment</p>
                  </div>
                </div>
              </RadioGroup>
              
              <h3 className="font-medium text-lg mt-6 mb-4">Create your content</h3>
              <RadioGroup defaultValue="" className="space-y-3">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="film_edit" id="film_edit" className="mt-1" disabled />
                  <div>
                    <Label htmlFor="film_edit" className="flex items-center cursor-pointer text-muted-foreground">
                      Film & edit
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Film your lectures</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="curriculum" id="curriculum" className="mt-1" disabled />
                  <div>
                    <Label htmlFor="curriculum" className="flex items-center cursor-pointer text-muted-foreground">
                      Curriculum
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Build your content</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="captions" id="captions" className="mt-1" disabled />
                  <div>
                    <Label htmlFor="captions" className="flex items-center cursor-pointer text-muted-foreground">
                      Captions (optional)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Add video subtitles</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="accessibility" id="accessibility" className="mt-1" disabled />
                  <div>
                    <Label htmlFor="accessibility" className="flex items-center cursor-pointer text-muted-foreground">
                      Accessibility (optional)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Make your content accessible</p>
                  </div>
                </div>
              </RadioGroup>
              
              <h3 className="font-medium text-lg mt-6 mb-4">Publish your course</h3>
              <RadioGroup defaultValue="" className="space-y-3">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="course_landing_page" id="course_landing_page" className="mt-1" disabled />
                  <div>
                    <Label htmlFor="course_landing_page" className="flex items-center cursor-pointer text-muted-foreground">
                      Course landing page
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Create your sales page</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="pricing" id="pricing" className="mt-1" disabled />
                  <div>
                    <Label htmlFor="pricing" className="flex items-center cursor-pointer text-muted-foreground">
                      Pricing
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Set your course price</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="promotions" id="promotions" className="mt-1" disabled />
                  <div>
                    <Label htmlFor="promotions" className="flex items-center cursor-pointer text-muted-foreground">
                      Promotions
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Market your course</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="course_messages" id="course_messages" className="mt-1" disabled />
                  <div>
                    <Label htmlFor="course_messages" className="flex items-center cursor-pointer text-muted-foreground">
                      Course messages
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Communicate with students</p>
                  </div>
                </div>
              </RadioGroup>
              
              <Button 
                className="w-full mt-8" 
                variant="default"
                onClick={() => {
                  toast({
                    title: "Course submitted for review",
                    description: "We'll review your course and get back to you soon."
                  });
                  setTimeout(() => setLocation('/instructor/dashboard'), 2000);
                }}
                disabled
              >
                Submit for Review
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="md:w-3/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Course structure</CardTitle>
              <CardDescription>There's a course in you. Plan it out.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Planning your course carefully will create a clear learning path for students and help you once you film. 
                Think down to the details of each lecture including the skill you'll teach, estimated video length, 
                practical activities to include, and how you'll create introductions and summaries.
              </p>

              <div className="bg-slate-50 rounded-lg p-6 mb-6 flex items-start">
                <div className="mr-6">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Our library of resources</h3>
                  <p className="text-sm text-muted-foreground mb-3">Tips and guides to structuring a course students love</p>
                  <Button variant="outline" size="sm" onClick={() => window.open('/teaching-center', '_blank')}>
                    Teaching Center
                  </Button>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4">Tips</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Start with your goals.</h4>
                  <p className="text-sm text-muted-foreground">
                    Setting goals for what learners will accomplish in your course (also known as 
                    <a href="#" className="text-primary hover:underline mx-1">learning objectives</a>) 
                    at the beginning will help you determine what content to include in your course and 
                    how you will teach the content to help your learners achieve the goals.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Create an outline.</h4>
                  <p className="text-sm text-muted-foreground">
                    Decide what skills you'll teach and how you'll teach them. Group related lectures into sections. 
                    Each section should have at least 3 lectures, and include at least one assignment or practical activity. 
                    <a href="#" className="text-primary hover:underline ml-1">Learn more</a>.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Introduce yourself and create momentum.</h4>
                  <p className="text-sm text-muted-foreground">
                    People online want to start learning quickly. Make an introduction section that gives learners 
                    something to be excited about in the first 10 minutes.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-8 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Requirements</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>See the <a href="#" className="text-primary hover:underline">complete list</a> of course quality requirements.</li>
                    <li>Your course must have at least five lectures.</li>
                    <li>All lectures must add up to at least 30+ minutes of total video.</li>
                    <li>Your course is composed of valuable educational content and free of promotional or distracting materials.</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-medium mt-10 mb-6">Curriculum</h3>
              
              <div className="border rounded-lg p-6 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <FilePlus className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">Start building your course content</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add sections and lectures to build your course curriculum. You'll be able to add content like videos, 
                    quizzes, and assignments after you complete the course basics.
                  </p>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Curriculum editor will be available soon",
                        description: "Please complete all required course sections first."
                      });
                    }}
                  >
                    Create Your First Section
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between mt-10">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/instructor/intended-learners')}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  onClick={() => setLocation('/instructor/setup-test-video')}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}