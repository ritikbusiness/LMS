import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { User, Course } from "@shared/schema";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { 
  BookOpen, Clock, Users, Star, FileCode, Code, TrendingUp, 
  Shield, Database, Briefcase, PlayCircle, Award, Trophy
} from "lucide-react";

// Domain icons mapping
const domainIcons: Record<string, any> = {
  "DevOps": <FileCode className="h-5 w-5 text-purple-500" />,
  "MERN": <Code className="h-5 w-5 text-blue-500" />,
  "AI": <TrendingUp className="h-5 w-5 text-green-500" />,
  "CyberSecurity": <Shield className="h-5 w-5 text-red-500" />,
  "BDE": <Database className="h-5 w-5 text-orange-500" />,
  "DigitalMarketing": <Briefcase className="h-5 w-5 text-pink-500" />,
};

// Featured courses showcased on homepage
const featuredCourses = [
  {
    id: 'featured-1',
    title: 'Open Source Models with Hugging Face',
    description: 'Learn how to build, fine-tune and deploy AI models using Hugging Face',
    domain: 'AI',
    type: 'Project',
    isFree: true,
    imageUrl: 'https://placehold.co/600x340/6f42c1/ffffff?text=AI+Models'
  },
  {
    id: 'featured-2',
    title: 'Introducing Multimodal LLMs',
    description: 'Explore the latest advances in multimodal large language models',
    domain: 'AI',
    type: 'Project',
    isFree: true,
    imageUrl: 'https://placehold.co/600x340/228be6/ffffff?text=Multimodal+LLMs'
  },
  {
    id: 'featured-3',
    title: 'Business Analytics with Excel',
    description: 'Master data analysis techniques using Microsoft Excel',
    domain: 'BDE',
    type: 'Course',
    isFree: true,
    imageUrl: 'https://placehold.co/600x340/40c057/ffffff?text=Excel+Analytics'
  },
  {
    id: 'featured-4',
    title: 'AI in Cybersecurity',
    description: 'Use AI to detect and prevent cyber attacks',
    domain: 'CyberSecurity',
    type: 'Course',
    isFree: true,
    imageUrl: 'https://placehold.co/600x340/fa5252/ffffff?text=Cyber+AI'
  }
];

// Technical skill categories
const skillCategories = [
  {
    title: "Technical Skills",
    skills: [
      { name: "Cloud", url: "/explore?domain=DevOps" },
      { name: "Coding", url: "/explore?domain=MERN" },
      { name: "Computer Science", url: "/explore?domain=MERN" },
      { name: "Cybersecurity", url: "/explore?domain=CyberSecurity" },
      { name: "DevOps", url: "/explore?domain=DevOps" },
      { name: "Ethical Hacking", url: "/explore?domain=CyberSecurity" },
      { name: "Generative AI", url: "/explore?domain=AI" },
      { name: "Java Programming", url: "/explore?domain=MERN" },
      { name: "Python", url: "/explore?domain=AI" },
      { name: "Web Development", url: "/explore?domain=MERN" },
    ]
  },
  {
    title: "Analytical Skills",
    skills: [
      { name: "Artificial Intelligence", url: "/explore?domain=AI" },
      { name: "Big Data", url: "/explore?domain=BDE" },
      { name: "Business Analysis", url: "/explore?domain=BDE" },
      { name: "Data Analytics", url: "/explore?domain=BDE" },
      { name: "Data Science", url: "/explore?domain=BDE" },
      { name: "Financial Modeling", url: "/explore?domain=BDE" },
      { name: "Machine Learning", url: "/explore?domain=AI" },
      { name: "Microsoft Excel", url: "/explore?domain=BDE" },
      { name: "Microsoft Power BI", url: "/explore?domain=BDE" },
      { name: "SQL", url: "/explore?domain=BDE" },
    ]
  },
  {
    title: "Business Skills",
    skills: [
      { name: "Digital Marketing", url: "/explore?domain=DigitalMarketing" },
      { name: "E-commerce", url: "/explore?domain=DigitalMarketing" },
      { name: "Finance", url: "/explore?skill=Finance" },
      { name: "Google", url: "/explore?domain=DigitalMarketing" },
      { name: "Graphic Design", url: "/explore?skill=GraphicDesign" },
      { name: "HR", url: "/explore?skill=HR" },
      { name: "Marketing", url: "/explore?domain=DigitalMarketing" },
      { name: "Project Management", url: "/explore?skill=ProjectManagement" },
      { name: "Social Media Marketing", url: "/explore?domain=DigitalMarketing" },
    ]
  },
  {
    title: "Career Resources",
    skills: [
      { name: "Essential IT Certifications", url: "/certifications" },
      { name: "High Income Skills to Learn", url: "/resources/high-income-skills" },
      { name: "How to Get a PHP Certification", url: "/resources/php-certification" },
      { name: "How to Learn Artificial Intelligence", url: "/resources/learn-ai" },
      { name: "Popular Cybersecurity Certifications", url: "/resources/cybersecurity-certifications" },
      { name: "Popular Data Analytics Certifications", url: "/resources/data-analytics-certifications" },
      { name: "What Does a Data Analyst Do?", url: "/resources/data-analyst-job" },
      { name: "Career Development Resources", url: "/resources" },
      { name: "Career Aptitude Test", url: "/resources/aptitude-test" },
      { name: "Share your Learning Story", url: "/community/stories" },
    ]
  }
];

// Degree program offerings
const degreePrograms = [
  {
    id: 1,
    name: "Computer Science",
    university: "California Institute of Technology",
    imageUrl: "https://placehold.co/600x340/228be6/ffffff?text=CalTech+CS"
  },
  {
    id: 2,
    name: "Data Science",
    university: "University of Michigan",
    imageUrl: "https://placehold.co/600x340/40c057/ffffff?text=UMich+DS"
  },
  {
    id: 3,
    name: "Business Administration",
    university: "University of Pennsylvania",
    imageUrl: "https://placehold.co/600x340/fa5252/ffffff?text=UPenn+BA" 
  },
  {
    id: 4,
    name: "Cybersecurity",
    university: "Georgia Tech",
    imageUrl: "https://placehold.co/600x340/fab005/ffffff?text=GTech+Security"
  }
];

// Popular career certification paths
const certificationPaths = [
  {
    id: 1,
    title: "Google Data Analytics",
    provider: "Google",
    skills: ["Data Cleaning", "Data Analysis", "R Programming", "Tableau"],
    imageUrl: "https://placehold.co/600x340/228be6/ffffff?text=Google+Analytics"
  },
  {
    id: 2,
    title: "IBM AI Engineering",
    provider: "IBM",
    skills: ["Machine Learning", "Deep Learning", "Python", "TensorFlow"],
    imageUrl: "https://placehold.co/600x340/40c057/ffffff?text=IBM+AI"
  },
  {
    id: 3,
    title: "Meta Front-End Developer",
    provider: "Meta",
    skills: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
    imageUrl: "https://placehold.co/600x340/fab005/ffffff?text=Meta+FrontEnd"
  }
];

// Partner companies/universities
const partners = [
  { id: 1, name: "Stanford", logo: "https://placehold.co/120x60?text=Stanford" },
  { id: 2, name: "MIT", logo: "https://placehold.co/120x60?text=MIT" },
  { id: 3, name: "Google", logo: "https://placehold.co/120x60?text=Google" },
  { id: 4, name: "IBM", logo: "https://placehold.co/120x60?text=IBM" },
  { id: 5, name: "Duke", logo: "https://placehold.co/120x60?text=Duke" },
  { id: 6, name: "Illinois", logo: "https://placehold.co/120x60?text=Illinois" },
  { id: 7, name: "Michigan", logo: "https://placehold.co/120x60?text=Michigan" },
  { id: 8, name: "Penn", logo: "https://placehold.co/120x60?text=Penn" },
];

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch courses the user is enrolled in
  const { data: enrolledCourses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses/enrolled"],
  });

  // Fetch recommended courses
  const { data: recommendedCourses, isLoading: recommendedLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses/recommended"],
  });

  // Fetch leaderboard data
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["/api/leaderboard/weekly"],
  });

  // User is logged in view
  const renderAuthenticatedDashboard = () => (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Banner for logged in users */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
            <p className="mb-4">Continue your learning journey and develop in-demand skills.</p>
            <Button className="bg-white text-blue-700 hover:bg-blue-50">
              <Link href="/courses">Resume Learning</Link>
            </Button>
          </div>
          <div className="mt-6 md:mt-0 bg-blue-500 bg-opacity-30 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold">72%</div>
            <div className="text-sm">Learning Path Progress</div>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Enrolled Courses</p>
              <p className="font-bold text-xl">{enrolledCourses?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Learning Hours</p>
              <p className="font-bold text-xl">24.5</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">XP Points</p>
              <p className="font-bold text-xl">{user?.xpPoints || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-amber-100 p-2 rounded-full mr-3">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Certificates</p>
              <p className="font-bold text-xl">3</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Instructor Tools - Only visible to instructors */}
      {user?.role === 'instructor' && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-purple-600" />
            Instructor Tools
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={() => window.location.href = '/instructor/create-course'}
            >
              Create a New Course
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/courses/manage'}
            >
              Manage Existing Courses
            </Button>
          </div>
        </div>
      )}
      
      {/* Continue Learning */}
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <PlayCircle className="mr-2 h-6 w-6 text-blue-600" />
        Continue Learning
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {coursesLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <CardHeader className="h-20 bg-gray-100"></CardHeader>
              <CardContent className="h-12 bg-gray-50"></CardContent>
            </Card>
          ))
        ) : enrolledCourses?.length ? (
          enrolledCourses.slice(0, 3).map(course => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200 relative">
                <img
                  src={course.thumbnailUrl || `https://placehold.co/600x340?text=${encodeURIComponent(course.title)}`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-blue-600">{course.domain}</Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="mr-3">8 weeks</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="ml-2">60%</span>
                  </div>
                </div>
              </CardHeader>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href={`/courses/${course.id}`}>Resume Course</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600 mb-4">You're not enrolled in any courses yet.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Link href="/explore">Explore Courses</Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Recommended For You */}
      <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {recommendedLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <CardHeader className="h-20 bg-gray-100"></CardHeader>
              <CardContent className="h-12 bg-gray-50"></CardContent>
            </Card>
          ))
        ) : recommendedCourses?.length ? (
          recommendedCourses.slice(0, 3).map(course => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200 relative">
                <img
                  src={course.thumbnailUrl || `https://placehold.co/600x340?text=${encodeURIComponent(course.title)}`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-blue-600">{course.domain}</Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href={`/courses/${course.id}`}>View Course</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">No recommendations available yet.</p>
          </div>
        )}
      </div>
      
      {/* Leaderboard */}
      <Card className="mb-12">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription className="text-blue-100">
            Top learners this week in {user?.domain || 'all domains'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboardLoading ? (
            <div className="animate-pulse space-y-4 py-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : leaderboard?.rankings ? (
            <div className="divide-y">
              {leaderboard.rankings.slice(0, 5).map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between py-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
                      idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-700' : 'bg-blue-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <img 
                      src={entry.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.fullName)}`} 
                      alt={entry.fullName} 
                      className="h-10 w-10 rounded-full ml-3"
                    />
                    <div className="ml-3">
                      <p className="font-medium">{entry.fullName}</p>
                      <p className="text-xs text-gray-500">{entry.badges || 0} badges earned</p>
                    </div>
                  </div>
                  <div className="font-bold text-blue-600">{entry.xpPoints || 0} XP</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">Leaderboard data not available.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t bg-gray-50">
          <Button variant="outline" className="w-full">
            <Link href="/leaderboard">View Full Leaderboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Public landing page (not logged in view)
  const renderPublicLandingPage = () => (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12 text-center py-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn without limits</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Start, switch, or advance your career with over 500 courses, Professional Certificates, and degrees from world-class universities and companies.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/login">Join For Free</Link>
          </Button>
          <Button size="lg" variant="outline">
            Try Kayago For Business
          </Button>
        </div>
      </div>

      {/* Partner Universities/Companies */}
      <div className="mb-12 text-center">
        <p className="text-gray-600 mb-6">We collaborate with 350+ leading universities and companies</p>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {partners.map(partner => (
            <div key={partner.id} className="grayscale hover:grayscale-0 transition-all">
              <img src={partner.logo} alt={partner.name} className="h-8" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Free Courses Section */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Start learning with free courses</h2>
          <p className="text-gray-600">Explore free online courses from the world's top universities and companies.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredCourses.map(course => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="w-full h-40 object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-blue-600">{course.domain}</Badge>
                {course.isFree && (
                  <Badge className="absolute top-2 left-2 bg-green-600">Free</Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="text-sm text-gray-500 mb-1">
                  {domainIcons[course.domain] || <BookOpen className="h-4 w-4 inline mr-1" />}
                  <span>{course.type}</span>
                </div>
                <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardFooter className="border-t pt-3">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href={`/login?redirect=/courses/${course.id}`}>Enroll For Free</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" className="gap-2">
            <span>Show 8 more</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <span>View all</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Button>
        </div>
      </div>
      
      {/* Get started with GenAI section */}
      <div className="mb-12 bg-blue-50 rounded-lg p-8">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-2">Get started with GenAI</h2>
            <p className="text-gray-600 mb-4">
              Identify, develop, and execute impactful GenAI business strategies.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 mb-2">
              <Link href="/explore?domain=AI">View all GenAI</Link>
            </Button>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="bg-white">
                <CardHeader className="pb-2">
                  <div className="text-sm text-gray-500 mb-1">
                    {item === 1 ? "Vanderbilt University" : item === 2 ? "Microsoft" : "IBM"}
                  </div>
                  <CardTitle className="text-base">
                    {item === 1 ? "Generative AI for Leaders" : 
                     item === 2 ? "Microsoft AI & ML Engineering" : 
                     "IBM Generative AI Engineering"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {item === 1 ? "Specialization" : "Professional Certificate"}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* New Courses Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">New on Kayago</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                <img 
                  src={`https://placehold.co/600x340/${item % 2 === 0 ? '228be6' : '40c057'}/ffffff?text=New+Course+${item}`} 
                  alt={`New Course ${item}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {item === 1 ? "AI Certificate" : 
                   item === 2 ? "Cloud Computing" : 
                   item === 3 ? "Python Programming" : 
                   "Digital Marketing"}
                </div>
                <CardTitle className="text-base line-clamp-1">
                  {item === 1 ? "AI for Business Innovation" : 
                   item === 2 ? "Cloud Architecture Fundamentals" : 
                   item === 3 ? "Advanced Python for Data Science" : 
                   "Digital Marketing Analytics"}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Browse by Category */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
        <Tabs defaultValue="technical">
          <TabsList className="mb-6">
            <TabsTrigger value="technical">Technical Skills</TabsTrigger>
            <TabsTrigger value="analytical">Analytical Skills</TabsTrigger>
            <TabsTrigger value="business">Business Skills</TabsTrigger>
            <TabsTrigger value="career">Career Resources</TabsTrigger>
          </TabsList>
          
          {skillCategories.map((category, idx) => (
            <TabsContent key={idx} value={["technical", "analytical", "business", "career"][idx]}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-2">
                {category.skills.map((skill, i) => (
                  <Link key={i} href={skill.url} className="text-blue-600 hover:underline py-1">
                    {skill.name}
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Degree Programs */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Get a head start on a degree today</h2>
          <p className="text-gray-600">
            With these programs, you can build valuable skills, earn career credentials, and make progress toward a degree before you even enroll.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {degreePrograms.map(program => (
            <Card key={program.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200">
                <img 
                  src={program.imageUrl} 
                  alt={program.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{program.name}</CardTitle>
                <CardDescription>{program.university}</CardDescription>
              </CardHeader>
              <CardFooter className="border-t pt-3">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/login">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">175+ million people have already joined Kayago</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <img 
              src="https://placehold.co/120x120/ddd/777?text=A" 
              alt="Profile" 
              className="mx-auto rounded-full mb-4"
            />
            <h3 className="font-bold text-xl mb-1">Aisha R.</h3>
            <p className="text-gray-600 mb-4">United States</p>
            <p className="text-gray-700">
              "Being a working mother means I'm constantly juggling my schedule. Kayago's flexible learning options allow me to study at my own pace and build my career skills."
            </p>
          </div>
          
          <div className="text-center">
            <img 
              src="https://placehold.co/120x120/ddd/777?text=B" 
              alt="Profile" 
              className="mx-auto rounded-full mb-4"
            />
            <h3 className="font-bold text-xl mb-1">Rahul M.</h3>
            <p className="text-gray-600 mb-4">India</p>
            <p className="text-gray-700">
              "From taking courses on Kayago, I gained a deep understanding of full-stack development. Now I feel prepared for entry-level jobs and have been able to work on multiple projects."
            </p>
          </div>
          
          <div className="text-center">
            <img 
              src="https://placehold.co/120x120/ddd/777?text=C" 
              alt="Profile" 
              className="mx-auto rounded-full mb-4"
            />
            <h3 className="font-bold text-xl mb-1">Carlos L.</h3>
            <p className="text-gray-600 mb-4">Brazil</p>
            <p className="text-gray-700">
              "The quizzes, videos, and hands-on labs provided helpful practical experience. Learning on Kayago has given me the confidence to excel in my cybersecurity career."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render authenticated dashboard or public landing page based on user state
  return user ? renderAuthenticatedDashboard() : renderPublicLandingPage();
};

export default Dashboard;
