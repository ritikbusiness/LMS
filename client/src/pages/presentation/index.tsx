import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, Mic, Upload, FileVideo, Calendar, Clock, Users, 
  BarChart2, Award, PlayCircle, Eye, VolumeX, Smile, 
  CheckCircle, AlertCircle, Clock4, UserCheck, Clipboard, 
  Briefcase, BookOpen
} from "lucide-react";

const PresentationPage = () => {
  const { toast } = useToast();
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePresentation, setActivePresentation] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Sample upcoming presentations data
  const upcomingPresentations = [
    {
      id: "pres-1",
      title: "DevOps CI/CD Pipeline Implementation",
      courseTitle: "Advanced DevOps Practices",
      date: "May 25, 2025",
      time: "14:00 - 14:30",
      participants: 4
    },
    {
      id: "pres-2",
      title: "Machine Learning Model Deployment",
      courseTitle: "Production ML Systems",
      date: "May 27, 2025",
      time: "11:00 - 11:30",
      participants: 3
    }
  ];

  // Sample past presentations data
  const pastPresentations = [
    {
      id: "past-1",
      title: "Cloud Architecture Design",
      courseTitle: "Enterprise Cloud Solutions",
      date: "May 15, 2025",
      score: 87,
      feedback: "Excellent technical depth, could improve eye contact"
    },
    {
      id: "past-2",
      title: "Network Security Implementation",
      courseTitle: "Advanced Cybersecurity",
      date: "May 10, 2025",
      score: 92,
      feedback: "Great presentation flow and confident delivery"
    }
  ];

  // Sample evaluation scores
  const evaluationScores = {
    eyeContact: 68,
    voiceModulation: 85,
    contentQuality: 92,
    slideDesign: 78,
    timeManagement: 95,
    fillerWords: 64,
    bodyLanguage: 72,
    answering: 88
  };

  // Sample filler words data
  const fillerWordsData = [
    { word: "Um", count: 14 },
    { word: "Like", count: 12 },
    { word: "You know", count: 8 },
    { word: "Actually", count: 6 },
    { word: "So", count: 18 }
  ];

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedVideo(files[0]);
      toast({
        title: "Video uploaded successfully",
        description: `File: ${files[0].name} (${Math.round(files[0].size/1024/1024)}MB)`,
      });
    }
  };

  // Handle analysis start
  const handleAnalyzeVideo = () => {
    if (!uploadedVideo) {
      toast({
        title: "No video selected",
        description: "Please upload a video to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    toast({
      title: "Analysis started",
      description: "Your presentation is being analyzed. This may take a few minutes.",
    });

    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      toast({
        title: "Analysis complete",
        description: "Your presentation analysis is ready to view",
      });
    }, 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Presentation Evaluator</h1>
          <p className="text-gray-600 max-w-2xl">
            Use AI-powered analysis to improve your presentation skills. Upload a video of your practice presentation or join a scheduled presentation session for real-time feedback.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Practice Session
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="upload" className="text-sm md:text-base">
            <Upload className="h-4 w-4 mr-2" />
            Upload & Analyze
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-sm md:text-base">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Presentations
          </TabsTrigger>
          <TabsTrigger value="past" className="text-sm md:text-base">
            <BarChart2 className="h-4 w-4 mr-2" />
            Past Evaluations
          </TabsTrigger>
        </TabsList>

        {/* Upload & Analyze Tab */}
        <TabsContent value="upload" className="space-y-6">
          {!showResults ? (
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Presentation Video</CardTitle>
                <CardDescription>
                  Upload a video of your presentation for AI analysis on delivery, content, and style.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <FileVideo className="h-12 w-12 text-blue-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {uploadedVideo ? uploadedVideo.name : "Drag & drop or click to upload"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {uploadedVideo 
                        ? `${Math.round(uploadedVideo.size/1024/1024 * 10) / 10} MB` 
                        : "MP4, WebM or MOV up to 500MB (5-15 minutes recommended)"}
                    </p>
                    <Input 
                      type="file" 
                      accept="video/*" 
                      className="hidden"
                      id="video-upload"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="video-upload">
                      <Button 
                        variant={uploadedVideo ? "outline" : "default"}
                        className={uploadedVideo ? "border-blue-500 text-blue-600" : "bg-blue-600"}
                      >
                        {uploadedVideo ? "Change Video" : "Select Video"}
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Presentation Title</label>
                    <Input placeholder="Enter the title of your presentation" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Course</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="devops">Advanced DevOps Practices</SelectItem>
                          <SelectItem value="ml">Machine Learning Systems</SelectItem>
                          <SelectItem value="cloud">Enterprise Cloud Solutions</SelectItem>
                          <SelectItem value="security">Advanced Cybersecurity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Presentation Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Presentation</SelectItem>
                          <SelectItem value="project">Project Demo</SelectItem>
                          <SelectItem value="case-study">Case Study</SelectItem>
                          <SelectItem value="practice">Practice Run</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Additional Notes</label>
                    <Textarea 
                      placeholder="Any specific aspects you'd like feedback on?"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleAnalyzeVideo}
                  disabled={!uploadedVideo || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                      Analyzing Video...
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-4 w-4" />
                      Analyze Presentation
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Presentation Analysis Results</CardTitle>
                      <CardDescription className="text-blue-100">
                        AI-powered evaluation of your presentation skills
                      </CardDescription>
                    </div>
                    <div className="bg-white text-blue-700 rounded-full p-3 font-bold text-xl">
                      83%
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Eye Contact</span>
                            <span className="text-sm font-medium">{evaluationScores.eyeContact}%</span>
                          </div>
                          <Progress value={evaluationScores.eyeContact} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Voice Modulation</span>
                            <span className="text-sm font-medium">{evaluationScores.voiceModulation}%</span>
                          </div>
                          <Progress value={evaluationScores.voiceModulation} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Content Quality</span>
                            <span className="text-sm font-medium">{evaluationScores.contentQuality}%</span>
                          </div>
                          <Progress value={evaluationScores.contentQuality} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Slide Design</span>
                            <span className="text-sm font-medium">{evaluationScores.slideDesign}%</span>
                          </div>
                          <Progress value={evaluationScores.slideDesign} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Time Management</span>
                            <span className="text-sm font-medium">{evaluationScores.timeManagement}%</span>
                          </div>
                          <Progress value={evaluationScores.timeManagement} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Filler Words</span>
                            <span className="text-sm font-medium">{evaluationScores.fillerWords}%</span>
                          </div>
                          <Progress value={evaluationScores.fillerWords} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Body Language</span>
                            <span className="text-sm font-medium">{evaluationScores.bodyLanguage}%</span>
                          </div>
                          <Progress value={evaluationScores.bodyLanguage} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Q&A Handling</span>
                            <span className="text-sm font-medium">{evaluationScores.answering}%</span>
                          </div>
                          <Progress value={evaluationScores.answering} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <p className="text-sm">Excellent technical content and subject matter expertise</p>
                            </div>
                            <div className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <p className="text-sm">Strong time management and pacing throughout</p>
                            </div>
                            <div className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                              <p className="text-sm">Reduce filler words - "um" appeared 14 times</p>
                            </div>
                            <div className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                              <p className="text-sm">Increase eye contact with audience rather than slides</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Filler Words Analysis</h3>
                          <div className="space-y-2">
                            {fillerWordsData.map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <VolumeX className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm font-medium">{item.word}</span>
                                </div>
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  {item.count} times
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">AI Feedback Summary</h3>
                          <p className="text-sm text-gray-700 mb-4">
                            Your presentation demonstrates strong technical knowledge and well-structured content. The slides are professional, though could use more visual aids. Your pacing was excellent, but delivery could be improved by reducing filler words and increasing eye contact with the audience. The Q&A handling showed confidence in your expertise.
                          </p>
                          <Button variant="outline" className="w-full border-blue-200 text-blue-700">
                            <Clipboard className="mr-2 h-4 w-4" />
                            View Full Transcript with Annotations
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    <Video className="mr-2 h-4 w-4" />
                    Schedule Practice with Instructor
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Watch Annotated Playback
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowResults(false)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Another Video
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Skills Development Plan</CardTitle>
                  <CardDescription>
                    Personalized recommendations to improve your presentation skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Eye className="h-5 w-5 text-blue-700" />
                        </div>
                        <h3 className="font-semibold">Eye Contact & Body Language</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Practice maintaining eye contact with different sections of your audience and use purposeful gestures.
                      </p>
                      <Button variant="link" className="text-blue-600 p-0 h-auto">
                        View Recommended Course →
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <Mic className="h-5 w-5 text-purple-700" />
                        </div>
                        <h3 className="font-semibold">Vocal Delivery</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Work on eliminating filler words and varying your tone to emphasize key points.
                      </p>
                      <Button variant="link" className="text-blue-600 p-0 h-auto">
                        View Practice Exercises →
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <UserCheck className="h-5 w-5 text-green-700" />
                        </div>
                        <h3 className="font-semibold">Audience Engagement</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Incorporate storytelling techniques and interactive elements to increase audience engagement.
                      </p>
                      <Button variant="link" className="text-blue-600 p-0 h-auto">
                        View Techniques →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Upcoming Presentations Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Presentations</CardTitle>
              <CardDescription>
                Scheduled presentations for your courses that require preparation and participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingPresentations.length > 0 ? (
                <div className="space-y-4">
                  {upcomingPresentations.map((presentation) => (
                    <div 
                      key={presentation.id} 
                      className={`border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer ${
                        activePresentation === presentation.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setActivePresentation(presentation.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{presentation.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{presentation.courseTitle}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {presentation.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {presentation.time}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              {presentation.participants} participants
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-0 flex items-center">
                          <Button className="bg-blue-600 hover:bg-blue-700 mr-2">
                            Join Session
                          </Button>
                          <Button variant="outline">Prepare</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No upcoming presentations</h3>
                  <p className="text-gray-500 mb-4">You don't have any scheduled presentations coming up.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Presentation Resources</CardTitle>
              <CardDescription>
                Tools and guidelines to help you prepare for your presentations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <BookOpen className="h-5 w-5 text-blue-700" />
                    </div>
                    <h3 className="font-semibold">Presentation Guidelines</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Review our comprehensive guide to delivering effective technical presentations.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <Briefcase className="h-5 w-5 text-purple-700" />
                    </div>
                    <h3 className="font-semibold">Slide Templates</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Access professionally designed slide templates for different presentation types.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Video className="h-5 w-5 text-green-700" />
                    </div>
                    <h3 className="font-semibold">Expert Examples</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Watch example presentations from top professionals and instructors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Past Evaluations Tab */}
        <TabsContent value="past" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Past Presentation Evaluations</CardTitle>
              <CardDescription>
                Review your previous presentations and track your progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pastPresentations.length > 0 ? (
                <div className="space-y-4">
                  {pastPresentations.map((presentation) => (
                    <div key={presentation.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="font-semibold text-lg">{presentation.title}</h3>
                            <Badge className="ml-3 bg-blue-100 text-blue-800 hover:bg-blue-200">
                              {presentation.score}% Score
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{presentation.courseTitle}</p>
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <Calendar className="h-4 w-4 mr-1" />
                            {presentation.date}
                          </div>
                          <p className="text-sm italic text-gray-600">"{presentation.feedback}"</p>
                        </div>
                        <div className="mt-3 md:mt-0 flex items-center">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No past evaluations</h3>
                  <p className="text-gray-500 mb-4">You haven't completed any presentations that have been evaluated.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Skills Progression</CardTitle>
              <CardDescription>
                Track how your presentation skills have improved over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Overall Presentation Skills</h3>
                <Badge className="bg-green-100 text-green-800">
                  +17% Improvement
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div>April 2025 (First Evaluation)</div>
                    <div>70%</div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-gray-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div>May 2025 (Latest Evaluation)</div>
                    <div>87%</div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="border rounded-lg p-3 text-center">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Eye Contact</h4>
                  <div className="text-xl font-bold text-green-600">+22%</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Voice Clarity</h4>
                  <div className="text-xl font-bold text-green-600">+15%</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Filler Words</h4>
                  <div className="text-xl font-bold text-green-600">-32%</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Structure</h4>
                  <div className="text-xl font-bold text-green-600">+18%</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <BarChart2 className="mr-2 h-4 w-4" />
                View Detailed Analytics
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PresentationPage;