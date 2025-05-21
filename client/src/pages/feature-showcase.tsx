import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ContextualHelp, FeatureTooltip } from '@/components/ui/contextual-help';
import { ProgressRing, CourseProgressBar, ModuleProgress } from '@/components/ui/progress-ring';
import { CourseCard } from '@/components/ui/course-card';
import { 
  AnimatedButton, 
  AnimatedVideoControls, 
  AnimatedCourseExploration,
  AnimatedInteractionButtons
} from '@/components/ui/micro-interactions';
import { 
  GamificationBadge, 
  BadgeGrid, 
  Leaderboard, 
  XPProgress 
} from '@/components/ui/gamification';
import { AnalyticsDashboard } from '@/components/ui/analytics-dashboard';
import { SubjectiveAssessment } from '@/components/ui/subjective-assessment';
import { SecureVideoPlayer } from '@/components/ui/secure-video-player';
import { BookOpen, Star, Shield, Video, Trophy, BarChart, Code, MessageSquare } from 'lucide-react';

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState('ui');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  
  // Sample data for showcasing components
  const sampleCourses = [
    {
      id: 1,
      title: "Advanced Full-Stack JavaScript Development",
      description: "Master modern web development with React, Node.js, and MongoDB",
      domain: "Software_Development",
      subDomain: "FullStack",
      thumbnailUrl: "https://placehold.co/600x340/3b82f6/ffffff?text=JavaScript+Development",
      instructorName: "Sarah Johnson",
      rating: 4.8,
      studentsCount: 3452,
      duration: 3600 * 24, // 24 hours of content
      difficultyLevel: "advanced",
      isNew: true,
      price: 99.99
    },
    {
      id: 2,
      title: "Data Analytics Master Class: From Beginner to Professional",
      description: "Comprehensive training in data analysis, visualization, and interpretation",
      domain: "Data_Analytics",
      subDomain: "Data_Analyst",
      thumbnailUrl: "https://placehold.co/600x340/8b5cf6/ffffff?text=Data+Analytics",
      instructorName: "Michael Chen",
      rating: 4.9,
      studentsCount: 2891,
      duration: 3600 * 28, // 28 hours of content
      difficultyLevel: "intermediate",
      isFeatured: true,
      price: 129.99
    },
    {
      id: 3,
      title: "Practical Machine Learning and AI: From Theory to Deployment",
      description: "Build real-world AI solutions with Python and TensorFlow",
      domain: "AI_ML",
      subDomain: "Machine_Learning",
      thumbnailUrl: "https://placehold.co/600x340/10b981/ffffff?text=AI+and+ML",
      instructorName: "Dr. Emma Rivera",
      rating: 4.7,
      studentsCount: 5127,
      duration: 3600 * 32, // 32 hours of content
      difficultyLevel: "advanced",
      isTrending: true,
      price: 149.99,
      salePrice: 119.99
    }
  ];
  
  const sampleBadges = [
    {
      id: 1,
      title: "First Course Completed",
      description: "Successfully finished your first course",
      type: "achievement",
      earned: true
    },
    {
      id: 2,
      title: "Python Master",
      description: "Completed all Python programming courses",
      type: "skill",
      earned: false,
      progress: 65
    },
    {
      id: 3,
      title: "Streak Warrior",
      description: "Maintained a 30-day learning streak",
      type: "streak",
      earned: true
    },
    {
      id: 4,
      title: "Perfect Score",
      description: "Achieved 100% on a course assessment",
      type: "excellence",
      earned: false,
      progress: 30
    }
  ];
  
  const leaderboardEntries = [
    { id: 1, rank: 1, name: "Alex Morgan", avatarUrl: "https://placehold.co/100/3b82f6/ffffff?text=AM", score: 9850, level: 24, badge: "Champion" },
    { id: 2, rank: 2, name: "Jamie Chen", avatarUrl: "https://placehold.co/100/10b981/ffffff?text=JC", score: 9340, level: 22, change: 1 },
    { id: 3, rank: 3, name: "Taylor Smith", avatarUrl: "https://placehold.co/100/f97316/ffffff?text=TS", score: 8790, level: 21, change: -1 },
    { id: 4, rank: 4, name: "Riley Johnson", avatarUrl: "https://placehold.co/100/8b5cf6/ffffff?text=RJ", score: 7680, level: 19 },
    { id: 5, rank: 5, name: "You", avatarUrl: "https://placehold.co/100/ec4899/ffffff?text=YOU", score: 6540, level: 17, isCurrentUser: true, change: 2 }
  ];
  
  const assessmentQuestions = [
    {
      id: 1,
      text: "Explain the concept of closures in JavaScript and provide a practical example of their use.",
      type: "subjective",
      points: 15,
      guidelines: "Your answer should include both a theoretical explanation and a code example."
    },
    {
      id: 2,
      text: "Analyze the effectiveness of transfer learning in computer vision applications.",
      type: "subjective",
      points: 20,
      guidelines: "Discuss at least two specific examples where transfer learning has been successfully applied."
    }
  ];
  
  const assessmentSubmissions = [
    {
      id: 101,
      questionId: 1,
      answer: "A closure in JavaScript is when a function retains access to its lexical scope even when the function is executed outside that scope. This creates a 'closed-over' variable environment.\n\nExample:\n```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n```\n\nIn this example, the inner function maintains access to the `count` variable even after `createCounter` has finished executing.",
      status: "reviewed",
      feedback: "Excellent explanation with a clear, practical example. You've demonstrated a solid understanding of closures and their implementation.",
      score: 14,
      submittedAt: "2023-05-15T14:30:00Z",
      reviewedAt: "2023-05-16T09:15:00Z",
      reviewer: {
        id: 5,
        name: "Professor Williams"
      }
    }
  ];
  
  const analyticsData = {
    overview: {
      totalStudents: 12547,
      activeStudents: 8932,
      completionRate: 72,
      avgEngagement: 35,
      totalCourses: 87,
      newEnrollments: 342,
      enrollmentTrend: 12
    },
    coursePerformance: [
      { id: 1, title: "Python for Data Science", enrollments: 1243, completionRate: 78, avgRating: 4.7, trend: 5 },
      { id: 2, title: "Full-Stack Web Development", enrollments: 976, completionRate: 65, avgRating: 4.5, trend: 8 },
      { id: 3, title: "Machine Learning Fundamentals", enrollments: 1542, completionRate: 81, avgRating: 4.9, trend: 12 }
    ],
    timeline: [
      { label: "Jan", enrollments: 850, completions: 320 },
      { label: "Feb", enrollments: 940, completions: 410 },
      { label: "Mar", enrollments: 1120, completions: 520 },
      { label: "Apr", enrollments: 980, completions: 490 },
      { label: "May", enrollments: 1260, completions: 580 },
      { label: "Jun", enrollments: 1340, completions: 610 }
    ],
    domainDistribution: [
      { domain: "Software Dev", count: 3245, percentage: 28 },
      { domain: "Data Science", count: 2987, percentage: 24 },
      { domain: "AI/ML", count: 1876, percentage: 15 },
      { domain: "Cloud Computing", count: 1524, percentage: 12 },
      { domain: "Security", count: 1123, percentage: 9 },
      { domain: "Other", count: 1792, percentage: 14 }
    ],
    studentEngagement: [
      { time: "8 AM", count: 245 },
      { time: "10 AM", count: 456 },
      { time: "12 PM", count: 765 },
      { time: "2 PM", count: 897 },
      { time: "4 PM", count: 1234 },
      { time: "6 PM", count: 1567 },
      { time: "8 PM", count: 1890 },
      { time: "10 PM", count: 1245 }
    ]
  };
  
  const videoSources = [
    {
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: "video/mp4",
      quality: "720p"
    },
    {
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: "video/mp4",
      quality: "480p"
    }
  ];
  
  const courseExplorationCards = [
    {
      id: 1,
      title: "Master Python Programming: Complete Developer Course",
      description: "Learn Python from scratch and build real-world applications",
      image: "https://placehold.co/1200x600/3b82f6/ffffff?text=Python+Programming"
    },
    {
      id: 2,
      title: "Data Science Bootcamp: Python, Pandas, NumPy, Matplotlib",
      description: "Comprehensive training to become a data scientist",
      image: "https://placehold.co/1200x600/8b5cf6/ffffff?text=Data+Science"
    },
    {
      id: 3,
      title: "Machine Learning A-Z: Hands-On Python & R",
      description: "Learn to create machine learning algorithms",
      image: "https://placehold.co/1200x600/10b981/ffffff?text=Machine+Learning"
    }
  ];
  
  // Sample contextual help tips
  const helpTips = [
    {
      id: 'course-card-tip',
      title: 'Intuitive Course Cards',
      content: 'Our redesigned course cards show the most important information at a glance with clear visual hierarchy.',
      position: 'right' as const
    },
    {
      id: 'progress-ring-tip',
      title: 'Interactive Progress Tracking',
      content: 'Monitor your learning progress with our visual progress indicators that update in real-time.',
      position: 'bottom' as const
    },
    {
      id: 'gamification-tip',
      title: 'Enhanced Gamification',
      content: 'Earn badges, track your position on the leaderboard, and watch your XP grow as you complete courses.',
      position: 'left' as const
    }
  ];
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <ContextualHelp tips={helpTips} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Desired Career Academy: UI Showcase</h1>
        <p className="text-gray-600 max-w-3xl">
          Explore our beautiful, modern UI components designed for an enterprise-grade Learning Management System.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="ui">
            <BookOpen className="mr-2 h-4 w-4" />
            UI Elements
          </TabsTrigger>
          <TabsTrigger value="gamification">
            <Trophy className="mr-2 h-4 w-4" />
            Gamification
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="mr-2 h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="assessments">
            <Code className="mr-2 h-4 w-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ui" className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
              Course Cards
            </h2>
            <p className="text-gray-600 mb-6">
              Modern, engaging course cards with visual hierarchy and intuitive design.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {sampleCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CourseCard course={sampleCourses[0]} variant="horizontal" />
              <CourseCard course={sampleCourses[2]} variant="featured" />
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Star className="mr-2 h-5 w-5 text-amber-500" />
              Progress Tracking
            </h2>
            <p className="text-gray-600 mb-6">
              Interactive course progress visualization with visually engaging elements.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Rings</CardTitle>
                  <CardDescription>
                    Visual indicators for course completion status
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-around">
                  <ProgressRing progress={25} color="primary" />
                  <ProgressRing progress={50} color="secondary" />
                  <ProgressRing progress={75} color="success" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Module Progress</CardTitle>
                  <CardDescription>
                    Track completion across course modules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ModuleProgress 
                    title="Module 1: Introduction" 
                    completedLessons={4} 
                    totalLessons={4} 
                  />
                  <ModuleProgress 
                    title="Module 2: Fundamentals" 
                    completedLessons={3} 
                    totalLessons={5} 
                    isCurrentModule={true}
                  />
                  <ModuleProgress 
                    title="Module 3: Advanced Topics" 
                    completedLessons={0} 
                    totalLessons={6}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Course Progress</CardTitle>
                  <CardDescription>
                    Overall dashboard for course progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Overall Completion</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Video Lectures</span>
                        <span className="text-sm">8/12</span>
                      </div>
                      <CourseProgressBar 
                        segments={Array(12).fill(0).map((_, i) => ({ completed: i < 8, current: i === 8 }))}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Quizzes</span>
                        <span className="text-sm">4/6</span>
                      </div>
                      <CourseProgressBar 
                        segments={Array(6).fill(0).map((_, i) => ({ completed: i < 4, current: i === 4 }))}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Assignments</span>
                        <span className="text-sm">2/4</span>
                      </div>
                      <CourseProgressBar 
                        segments={Array(4).fill(0).map((_, i) => ({ completed: i < 2, current: i === 2 }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-purple-500" />
              Micro-interactions
            </h2>
            <p className="text-gray-600 mb-6">
              Animated micro-interactions for course exploration and better engagement.
            </p>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Interactive Elements</CardTitle>
                <CardDescription>
                  Subtle animations enhance the user experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-8">
                  <AnimatedButton 
                    label="Start Course" 
                    icon={<BookOpen className="h-4 w-4" />}
                    showSparkle
                  />
                  
                  <AnimatedButton 
                    label="Play Video" 
                    icon={<Video className="h-4 w-4" />}
                    variant="outline"
                  />
                  
                  <AnimatedButton 
                    label="Add to Favorites" 
                    icon={<Star className="h-4 w-4" />}
                    variant="secondary"
                  />
                </div>
                
                <Separator className="mb-6" />
                
                <div className="mb-8">
                  <h4 className="font-medium mb-3">Video Controls with Micro-animations</h4>
                  <AnimatedVideoControls
                    isPlaying={videoIsPlaying}
                    onPlayPause={() => setVideoIsPlaying(!videoIsPlaying)}
                    onSeek={() => {}}
                    onRestart={() => {}}
                    progress={45}
                    duration={600}
                  />
                </div>
                
                <Separator className="mb-6" />
                
                <div className="mb-4">
                  <h4 className="font-medium mb-3">Social Interaction Elements</h4>
                  <AnimatedInteractionButtons
                    likeCount={24}
                    bookmarkCount={12}
                    shareCount={5}
                    isLiked={isLiked}
                    isBookmarked={isBookmarked}
                    onLike={() => setIsLiked(!isLiked)}
                    onBookmark={() => setIsBookmarked(!isBookmarked)}
                    onShare={() => {}}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Animated Course Exploration</CardTitle>
                <CardDescription>
                  Rich, engaging course carousel with animated transitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatedCourseExploration 
                  cards={courseExplorationCards}
                  onSelect={() => {}}
                />
              </CardContent>
            </Card>
          </section>
        </TabsContent>
        
        <TabsContent value="gamification" className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-amber-500" />
              Achievement Badges
            </h2>
            <p className="text-gray-600 mb-6">
              Enhanced gamification with badges, achievements, and visual progress indicators.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievement Badges</CardTitle>
                  <CardDescription>
                    Earn badges by completing courses and activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BadgeGrid badges={sampleBadges} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Badge Showcase</CardTitle>
                  <CardDescription>
                    Different badge styles and states
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <GamificationBadge
                      title="Course Champion"
                      description="Completed all courses in a learning path"
                      type="milestone"
                      earned={true}
                    />
                    
                    <GamificationBadge
                      title="Perfect Attendance"
                      description="Logged in for 30 consecutive days"
                      type="streak"
                      earned={false}
                      progress={65}
                    />
                    
                    <div className="flex gap-4 justify-around">
                      <GamificationBadge
                        title="Quick Learner"
                        description="Finished course ahead of schedule"
                        type="achievement"
                        earned={true}
                        variant="compact"
                      />
                      
                      <GamificationBadge
                        title="Knowledge Seeker"
                        description="Read all course materials"
                        type="knowledge"
                        earned={false}
                        progress={45}
                        variant="compact"
                      />
                      
                      <GamificationBadge
                        title="Code Master"
                        description="Submitted all coding assignments"
                        type="skill"
                        earned={true}
                        variant="compact"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Leaderboard</CardTitle>
                  <CardDescription>
                    Top performers this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Leaderboard 
                    entries={leaderboardEntries}
                    timeframe="weekly"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>
                    XP points and level progression
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <XPProgress
                    currentXP={6540}
                    levelXP={6000}
                    nextLevelXP={8000}
                    level={17}
                  />
                </CardContent>
              </Card>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Shield className="mr-2 h-5 w-5 text-red-500" />
              Secure Video Streaming
            </h2>
            <p className="text-gray-600 mb-6">
              Secure video streaming via AWS S3 and CloudFront with DRM protection.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Video Player with Security Features</CardTitle>
                <CardDescription>
                  Protected streaming with quality selection and interactive controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SecureVideoPlayer
                  sources={videoSources}
                  title="Introduction to Machine Learning: Fundamentals and Applications"
                  poster="https://placehold.co/1280x720/3b82f6/ffffff?text=ML+Introduction"
                  drmProtected={true}
                  courseId={123}
                  lessonId={456}
                />
              </CardContent>
            </Card>
          </section>
        </TabsContent>
        
        <TabsContent value="assessments" className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Code className="mr-2 h-5 w-5 text-green-500" />
              Subjective Assessment
            </h2>
            <p className="text-gray-600 mb-6">
              Rich subjective assessments with instructor review capabilities.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Advanced Programming Concepts Assessment</CardTitle>
                <CardDescription>
                  Submit thoughtful answers for instructor review and feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">About Subjective Assessments</h3>
                    <p className="text-blue-700">
                      These assessments allow instructors to evaluate your understanding through written responses. Your answers will be reviewed by a course instructor who will provide personalized feedback.
                    </p>
                  </div>
                </div>
                
                <SubjectiveAssessment
                  title="JavaScript Advanced Concepts"
                  description="Demonstrate your understanding of advanced JavaScript programming concepts"
                  questions={assessmentQuestions}
                  submissions={assessmentSubmissions}
                  isInstructor={false}
                />
              </CardContent>
            </Card>
          </section>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-purple-500" />
              Advanced Analytics Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              Comprehensive analytics with visualizations for instructors and administrators.
            </p>
            
            <Card>
              <CardContent className="p-6">
                <AnalyticsDashboard
                  data={analyticsData}
                  timeframe="monthly"
                />
              </CardContent>
            </Card>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}