import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ChevronLeft, ChevronRight, Video, Camera, Mic, Film, 
  AlertCircle, PlayCircle, VideoIcon, Check as CheckCircle
} from 'lucide-react';

export default function SetupTestVideo() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [videoStarted, setVideoStarted] = useState(false);
  
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
              <RadioGroup defaultValue="setup_test_video" className="space-y-3">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="intended_learners" id="intended_learners" className="mt-1" />
                  <div>
                    <Label htmlFor="intended_learners" className="flex items-center cursor-pointer">
                      Intended learners
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Who this course is for</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="course_structure" id="course_structure" className="mt-1" />
                  <div>
                    <Label htmlFor="course_structure" className="flex items-center cursor-pointer">
                      Course structure
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Plan your curriculum</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border-l-2 border-primary pl-3 ml-2">
                  <RadioGroupItem value="setup_test_video" id="setup_test_video" className="mt-1" />
                  <div>
                    <Label htmlFor="setup_test_video" className="flex items-center cursor-pointer font-medium">
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
              <CardTitle className="text-2xl font-serif">Setup & test video</CardTitle>
              <CardDescription>Arrange your ideal studio and get early feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="default" className="mb-6 border-purple-200 bg-purple-50">
                <AlertCircle className="h-4 w-4 text-purple-500" />
                <AlertTitle className="text-purple-800 font-medium">Please be advised we are currently receiving an extremely high volume of support requests.</AlertTitle>
                <AlertDescription className="text-purple-800">
                  Test Video feedback will be significantly delayed and may take beyond 24 hours. We are working diligently to resolve these 
                  issues and apologize for the inconvenience.
                </AlertDescription>
                <Button variant="outline" size="sm" className="mt-2 border-purple-200 text-purple-600 hover:text-purple-700 hover:bg-purple-100">
                  Dismiss
                </Button>
              </Alert>

              <p className="mb-6">
                It's important to get your audio and video set up correctly now, because it's much more difficult to fix your videos after you've recorded. 
                There are many creative ways to use what you have to create professional looking video.
              </p>

              <div className="rounded-lg border overflow-hidden mb-8">
                <div className="bg-slate-800 relative aspect-video flex items-center justify-center">
                  {!videoStarted ? (
                    <div 
                      className="flex items-center justify-center flex-col cursor-pointer"
                      onClick={() => setVideoStarted(true)}
                    >
                      <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                        <PlayCircle className="h-10 w-10 text-white" />
                      </div>
                      <span className="text-white text-sm">Click to play video</span>
                    </div>
                  ) : (
                    <video 
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      src="https://player.vimeo.com/progressive_redirect/playback/563078045/rendition/720p/file.mp4?loc=external"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between bg-slate-100">
                  <div className="flex items-center">
                    <div className="bg-slate-200 w-12 h-8 rounded flex items-center justify-center mr-2">
                      <span className="text-xs">0:00</span>
                    </div>
                    <div className="h-1 w-32 bg-slate-300 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                      <VideoIcon className="h-3 w-3 text-slate-600" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                      <Mic className="h-3 w-3 text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-10">
                <div className="md:w-2/3">
                  <h2 className="text-xl font-medium mb-4">We check production so you can focus on instruction</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    You don't have to be an audio/video expert to teach what you know. By submitting a two-minute test video, you can:
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Fine-tune your audio/video setup with personalized feedback</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Make sure your audio and video meet our technical standards</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Practice your delivery before you record your course</span>
                    </li>
                  </ul>
                  <p className="text-sm mb-4">
                    Remember to use the same setup, including camera, microphone, and recording environment, that you will use for your course.
                  </p>
                  <p className="text-sm mb-6">
                    Also, if you change any part of your setup, submit a new test video for an up-to-date review.
                  </p>
                </div>
                <div className="md:w-1/3 flex items-center justify-center">
                  <div className="h-64 w-full max-w-xs relative">
                    <img 
                      src="https://s.udemycdn.com/instructor/dashboard/test-video-img-v2.jpg" 
                      alt="Instructor recording a video" 
                      className="object-cover h-full w-full rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Button variant="outline" className="justify-center">
                  I need equipment advice
                </Button>
                <Button className="justify-center">
                  I have my equipment
                </Button>
              </div>

              <h3 className="text-lg font-medium mt-10 mb-4">Tips</h3>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="font-medium mb-2">Equipment can be easy.</h4>
                  <p className="text-sm text-muted-foreground">
                    You don't need to buy fancy equipment. Most smartphone cameras can capture video in HD, and you can record 
                    audio on another phone or external microphone.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Students need to hear you.</h4>
                  <p className="text-sm text-muted-foreground">
                    A good microphone is the most important piece of equipment you will choose. There are lot of affordable 
                    options. Make sure it's correctly plugged in and 6-12 inches (15-30 cm) from you.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Make a studio.</h4>
                  <p className="text-sm text-muted-foreground">
                    Clean up your background and arrange props. Almost any small space can be transformed with a backdrop made 
                    of colored paper or an ironed bed sheet.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between mt-10">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/instructor/course-structure')}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  onClick={() => {
                    toast({
                      title: "Coming soon",
                      description: "The film & edit section will be available soon"
                    });
                    setTimeout(() => setLocation('/instructor/dashboard'), 2000);
                  }}
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