import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, Clock, ChevronRight, Award, Briefcase, CheckCircle2, 
  CircleDot, Code, Shield, Server, Database, BarChart, Command,
  Brain, FileCode, Activity, Globe, Monitor, Settings, Share2
} from "lucide-react";
import { Link } from "wouter";

// Types
interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  icon: React.ReactNode;
}

interface CareerPath {
  id: string;
  title: string;
  description: string;
  medianSalary: string;
  growthRate: string;
  skills: Skill[];
  requiredSkills: string[];
  backgroundImage: string;
  demandLevel: number;
  careerLevel: 'entry' | 'mid' | 'senior';
}

// Career paths data
const careerPaths: CareerPath[] = [
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    description: "Specialize in building automated CI/CD pipelines and implementing infrastructure as code to streamline software delivery.",
    medianSalary: "$115,000",
    growthRate: "22%",
    demandLevel: 85,
    careerLevel: 'mid',
    backgroundImage: "linear-gradient(to right, #6366f1, #a855f7)",
    requiredSkills: ["git", "docker", "kubernetes", "jenkins", "terraform", "aws", "monitoring"],
    skills: [
      {
        id: "git",
        name: "Git & Version Control",
        category: "DevOps",
        level: "beginner",
        durationWeeks: 2,
        icon: <Code className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "docker",
        name: "Docker Containerization",
        category: "DevOps",
        level: "intermediate",
        durationWeeks: 3,
        icon: <Server className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "kubernetes",
        name: "Kubernetes Orchestration",
        category: "DevOps",
        level: "advanced",
        durationWeeks: 6,
        icon: <Settings className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "jenkins",
        name: "CI/CD with Jenkins",
        category: "DevOps",
        level: "intermediate",
        durationWeeks: 4,
        icon: <Activity className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "terraform",
        name: "Infrastructure as Code with Terraform",
        category: "DevOps",
        level: "advanced",
        durationWeeks: 4,
        icon: <FileCode className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "aws",
        name: "AWS Cloud Services",
        category: "Cloud",
        level: "intermediate",
        durationWeeks: 6,
        icon: <Globe className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "monitoring",
        name: "Monitoring & Observability",
        category: "DevOps",
        level: "intermediate",
        durationWeeks: 3,
        icon: <Activity className="h-5 w-5 text-blue-500" />,
      }
    ]
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "Apply statistical analysis, machine learning, and data visualization to extract insights from complex datasets.",
    medianSalary: "$120,000",
    growthRate: "25%",
    demandLevel: 90,
    careerLevel: 'mid',
    backgroundImage: "linear-gradient(to right, #ec4899, #8b5cf6)",
    requiredSkills: ["python", "statistics", "ml-algorithms", "data-wrangling", "data-viz", "deep-learning", "big-data"],
    skills: [
      {
        id: "python",
        name: "Python Programming",
        category: "Programming",
        level: "intermediate",
        durationWeeks: 4,
        icon: <Code className="h-5 w-5 text-green-500" />,
      },
      {
        id: "statistics",
        name: "Statistical Analysis",
        category: "Mathematics",
        level: "advanced",
        durationWeeks: 5,
        icon: <BarChart className="h-5 w-5 text-green-500" />,
      },
      {
        id: "ml-algorithms",
        name: "Machine Learning Algorithms",
        category: "AI/ML",
        level: "advanced",
        durationWeeks: 8,
        icon: <Brain className="h-5 w-5 text-green-500" />,
      },
      {
        id: "data-wrangling",
        name: "Data Wrangling & Preprocessing",
        category: "Data",
        level: "intermediate",
        durationWeeks: 3,
        icon: <Database className="h-5 w-5 text-green-500" />,
      },
      {
        id: "data-viz",
        name: "Data Visualization",
        category: "Data",
        level: "intermediate",
        durationWeeks: 2,
        icon: <BarChart className="h-5 w-5 text-green-500" />,
      },
      {
        id: "deep-learning",
        name: "Deep Learning & Neural Networks",
        category: "AI/ML",
        level: "advanced",
        durationWeeks: 6,
        icon: <Brain className="h-5 w-5 text-green-500" />,
      },
      {
        id: "big-data",
        name: "Big Data Technologies",
        category: "Data",
        level: "intermediate",
        durationWeeks: 4,
        icon: <Database className="h-5 w-5 text-green-500" />,
      }
    ]
  },
  {
    id: "full-stack",
    title: "Full-Stack Developer",
    description: "Design and build complete web applications handling both frontend and backend responsibilities.",
    medianSalary: "$104,000",
    growthRate: "20%",
    demandLevel: 80,
    careerLevel: 'mid',
    backgroundImage: "linear-gradient(to right, #3b82f6, #14b8a6)",
    requiredSkills: ["html-css", "javascript", "react", "node", "express", "databases", "api-design"],
    skills: [
      {
        id: "html-css",
        name: "HTML & CSS Fundamentals",
        category: "Frontend",
        level: "beginner",
        durationWeeks: 3,
        icon: <Code className="h-5 w-5 text-orange-500" />,
      },
      {
        id: "javascript",
        name: "JavaScript & ES6+",
        category: "Frontend",
        level: "intermediate",
        durationWeeks: 4,
        icon: <Code className="h-5 w-5 text-orange-500" />,
      },
      {
        id: "react",
        name: "React & Component Architecture",
        category: "Frontend",
        level: "intermediate",
        durationWeeks: 5,
        icon: <Monitor className="h-5 w-5 text-orange-500" />,
      },
      {
        id: "node",
        name: "Node.js & Backend Architecture",
        category: "Backend",
        level: "intermediate",
        durationWeeks: 4,
        icon: <Server className="h-5 w-5 text-orange-500" />,
      },
      {
        id: "express",
        name: "Express.js Framework",
        category: "Backend",
        level: "intermediate",
        durationWeeks: 3,
        icon: <Server className="h-5 w-5 text-orange-500" />,
      },
      {
        id: "databases",
        name: "Database Design & SQL/NoSQL",
        category: "Backend",
        level: "intermediate",
        durationWeeks: 4,
        icon: <Database className="h-5 w-5 text-orange-500" />,
      },
      {
        id: "api-design",
        name: "API Design & Authentication",
        category: "Backend",
        level: "intermediate",
        durationWeeks: 3,
        icon: <Share2 className="h-5 w-5 text-orange-500" />,
      }
    ]
  },
  {
    id: "security-analyst",
    title: "Cybersecurity Analyst",
    description: "Protect digital assets by monitoring, detecting, investigating, analyzing, and responding to security threats.",
    medianSalary: "$99,000",
    growthRate: "32%",
    demandLevel: 95,
    careerLevel: 'mid',
    backgroundImage: "linear-gradient(to right, #ef4444, #f97316)",
    requiredSkills: ["security-fundamentals", "network-security", "pen-testing", "incident-response", "security-tools", "risk-assessment", "cryptography"],
    skills: [
      {
        id: "security-fundamentals",
        name: "Cybersecurity Fundamentals",
        category: "Security",
        level: "beginner",
        durationWeeks: 2,
        icon: <Shield className="h-5 w-5 text-red-500" />,
      },
      {
        id: "network-security",
        name: "Network Security & Architecture",
        category: "Security",
        level: "intermediate",
        durationWeeks: 4,
        icon: <Globe className="h-5 w-5 text-red-500" />,
      },
      {
        id: "pen-testing",
        name: "Penetration Testing & Vulnerability Assessment",
        category: "Security",
        level: "advanced",
        durationWeeks: 5,
        icon: <Shield className="h-5 w-5 text-red-500" />,
      },
      {
        id: "incident-response",
        name: "Incident Response & Threat Hunting",
        category: "Security",
        level: "advanced",
        durationWeeks: 4,
        icon: <Activity className="h-5 w-5 text-red-500" />,
      },
      {
        id: "security-tools",
        name: "Security Tools & SIEM Systems",
        category: "Security",
        level: "intermediate",
        durationWeeks: 3,
        icon: <Settings className="h-5 w-5 text-red-500" />,
      },
      {
        id: "risk-assessment",
        name: "Risk Assessment & Management",
        category: "Security",
        level: "intermediate",
        durationWeeks: 3,
        icon: <BarChart className="h-5 w-5 text-red-500" />,
      },
      {
        id: "cryptography",
        name: "Cryptography & Secure Communications",
        category: "Security",
        level: "intermediate",
        durationWeeks: 3,
        icon: <Command className="h-5 w-5 text-red-500" />,
      }
    ]
  }
];

// Skill level colors
const levelColors = {
  beginner: 'blue',
  intermediate: 'purple',
  advanced: 'orange'
};

// Component for displaying the roadmap timeline
const RoadmapTimeline = ({ skills }: { skills: Skill[] }) => {
  return (
    <div className="space-y-8 mt-8">
      {skills.map((skill, index) => (
        <div key={skill.id} className="relative">
          {/* Timeline connector */}
          {index < skills.length - 1 && (
            <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          )}
          
          <div className="flex items-start gap-4">
            {/* Timeline dot */}
            <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-${levelColors[skill.level]}-100 text-${levelColors[skill.level]}-600`}>
              {skill.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                <h3 className="text-lg font-semibold">{skill.name}</h3>
                <Badge className={`bg-${levelColors[skill.level]}-100 text-${levelColors[skill.level]}-800 whitespace-nowrap mt-1 md:mt-0`}>
                  {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-500 mb-2">
                <span className="inline-flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {skill.durationWeeks} {skill.durationWeeks === 1 ? 'week' : 'weeks'}
                </span>
                <span className="mx-2">•</span>
                <span>{skill.category}</span>
              </div>
              
              <Card className="bg-gray-50 dark:bg-gray-800 border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <Button>
                      <Link href={`/courses?skill=${skill.id}`}>
                        View Courses
                      </Link>
                    </Button>
                    <Button variant="outline">
                      <Link href={`/skills/${skill.id}`}>
                        Skill Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ))}
      
      {/* Final step - Career achievement */}
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
            <Award className="h-6 w-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Career Ready!</h3>
            <p className="text-sm text-gray-500 mb-3">
              You've completed the essential skills for this career path
            </p>
            
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Explore Job Opportunities</h4>
                    <p className="text-sm text-green-100">Find positions matching your new skills</p>
                  </div>
                  <Button className="mt-3 md:mt-0 bg-white text-green-600 hover:bg-green-50">
                    View Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ProgressTracker component
const ProgressTracker = ({ 
  totalSkills, 
  completedSkills 
}: { 
  totalSkills: number, 
  completedSkills: number 
}) => {
  const percentage = Math.round((completedSkills / totalSkills) * 100);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="font-semibold text-lg mb-2">Your Progress</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{completedSkills} of {totalSkills} skills completed</span>
          <span className="font-medium">{percentage}%</span>
        </div>
        <Progress value={percentage} className="h-2" />
        {percentage < 100 ? (
          <p className="text-sm text-gray-500 mt-2">
            Continue your journey to unlock career opportunities
          </p>
        ) : (
          <p className="text-sm text-green-600 mt-2 font-medium">
            Congratulations! You've completed this career path
          </p>
        )}
      </div>
    </div>
  );
};

// Skills Breakdown component
const SkillsBreakdown = ({ skills }: { skills: Skill[] }) => {
  const categories = [...new Set(skills.map(skill => skill.category))];
  
  const skillsByCategory = categories.map(category => ({
    category,
    count: skills.filter(skill => skill.category === category).length,
  }));
  
  const levelCounts = {
    beginner: skills.filter(skill => skill.level === 'beginner').length,
    intermediate: skills.filter(skill => skill.level === 'intermediate').length,
    advanced: skills.filter(skill => skill.level === 'advanced').length
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-3">Skills by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {skillsByCategory.map(item => (
            <div 
              key={item.category} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span>{item.category}</span>
              <Badge>{item.count}</Badge>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-lg mb-3">Skills by Difficulty</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-blue-700">Beginner</span>
            <Badge className="bg-blue-100 text-blue-800">{levelCounts.beginner}</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <span className="text-purple-700">Intermediate</span>
            <Badge className="bg-purple-100 text-purple-800">{levelCounts.intermediate}</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="text-orange-700">Advanced</span>
            <Badge className="bg-orange-100 text-orange-800">{levelCounts.advanced}</Badge>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-lg mb-3">Estimated Timeline</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Total Duration</span>
            <span className="font-semibold">
              {skills.reduce((acc, skill) => acc + skill.durationWeeks, 0)} weeks
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Based on recommended course durations with 10 hours/week
          </p>
        </div>
      </div>
    </div>
  );
};

// Related Jobs component
const RelatedJobs = ({ careerTitle }: { careerTitle: string }) => {
  const jobs = [
    {
      id: 'job1',
      title: `Senior ${careerTitle}`,
      company: 'TechCorp Global',
      location: 'Remote',
      salary: '$120,000 - $150,000',
      posted: '2 days ago',
      badges: ['Remote', 'Full-time', '5+ years exp']
    },
    {
      id: 'job2',
      title: `${careerTitle}`,
      company: 'InnovateTech',
      location: 'New York, NY',
      salary: '$95,000 - $115,000',
      posted: '1 week ago',
      badges: ['Hybrid', 'Full-time', '2+ years exp']
    },
    {
      id: 'job3',
      title: `Junior ${careerTitle}`,
      company: 'StartUp Inc',
      location: 'San Francisco, CA',
      salary: '$80,000 - $95,000',
      posted: '3 days ago',
      badges: ['On-site', 'Full-time', 'Entry level']
    }
  ];
  
  return (
    <div className="space-y-4">
      {jobs.map(job => (
        <Card key={job.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                <p className="text-sm font-medium mt-1">{job.salary}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.badges.map((badge, idx) => (
                    <Badge key={idx} variant="outline" className="bg-gray-100">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Apply Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-center">
        <Button variant="outline">
          View All Jobs
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Main Career Roadmap page
const CareerRoadmapPage = () => {
  const { toast } = useToast();
  const [selectedCareer, setSelectedCareer] = useState<string>(careerPaths[0].id);
  
  // Find the selected career path
  const careerPath = careerPaths.find(path => path.id === selectedCareer) || careerPaths[0];
  
  // Dummy user progress data
  const userProgress = {
    completedSkills: 2,
    inProgressSkills: 1,
    totalSkills: careerPath.skills.length
  };
  
  const handleGeneratePersonalizedPath = () => {
    toast({
      title: "Generating personalized roadmap",
      description: "Analyzing your skills and creating a custom learning path...",
    });
    
    // Simulate generation process
    setTimeout(() => {
      toast({
        title: "Roadmap generated!",
        description: "Your personalized learning path is ready to view.",
      });
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Roadmap Generator</h1>
          <p className="text-gray-600 max-w-2xl">
            Plan your learning journey with our AI-powered career roadmaps. Choose a career path below to see the skills, 
            courses, and timeline needed to succeed in your chosen field.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleGeneratePersonalizedPath}>
            <Brain className="mr-2 h-4 w-4" />
            Generate Personalized Path
          </Button>
        </div>
      </div>
      
      {/* Career selection */}
      <div className="mb-8">
        <div className="mb-3">
          <h2 className="text-xl font-semibold">Choose Your Career Path</h2>
          <p className="text-gray-500">Select a career to view the recommended learning roadmap</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {careerPaths.map(path => (
            <Card 
              key={path.id}
              className={`cursor-pointer hover:shadow-md transition-all ${
                selectedCareer === path.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCareer(path.id)}
            >
              <div 
                className="h-24 rounded-t-lg flex items-center justify-center"
                style={{ background: path.backgroundImage }}
              >
                <h3 className="text-xl font-bold text-white">{path.title}</h3>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {path.careerLevel === 'entry' ? 'Entry Level' : 
                     path.careerLevel === 'mid' ? 'Mid Level' : 'Senior Level'}
                  </Badge>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-600">{path.skills.length} skills</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Salary</span>
                    <span className="font-medium">{path.medianSalary}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Growth</span>
                    <span className="font-medium text-green-600">+{path.growthRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Demand</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${path.demandLevel}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Selected career roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Career header */}
          <Card className="mb-8">
            <div 
              className="h-32 rounded-t-lg flex items-center"
              style={{ background: careerPath.backgroundImage }}
            >
              <div className="px-6 text-white">
                <h2 className="text-2xl font-bold mb-1">{careerPath.title}</h2>
                <p>{careerPath.description}</p>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Median Salary</span>
                  <span className="text-xl font-bold">{careerPath.medianSalary}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Growth Rate</span>
                  <span className="text-xl font-bold text-green-600">+{careerPath.growthRate}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Time to Complete</span>
                  <span className="text-xl font-bold">
                    {careerPath.skills.reduce((acc, skill) => acc + skill.durationWeeks, 0)} weeks
                  </span>
                </div>
              </div>
              
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Career Description</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      A {careerPath.title} is responsible for {careerPath.description.toLowerCase()} This career path requires
                      technical expertise in {careerPath.requiredSkills.slice(0, 3).join(', ')}, and more.
                      With a projected growth rate of {careerPath.growthRate}, this is a high-demand career with excellent
                      long-term prospects.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Required Skills</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {careerPath.skills.map(skill => (
                        <div key={skill.id} className="flex items-center gap-2">
                          <CircleDot className="h-4 w-4 text-blue-500" />
                          <span>{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Job Outlook</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-2">
                      The job market for {careerPath.title}s is expected to grow by {careerPath.growthRate} over the next 
                      five years. Companies across various industries are actively hiring for these positions, with 
                      particularly strong demand in tech, finance, and healthcare sectors.
                    </p>
                    <p className="text-gray-700">
                      Entry-level positions typically require 1-2 years of experience, while senior roles may require
                      5+ years along with specialized expertise in specific technologies and methodologies.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          {/* Roadmap timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Roadmap</CardTitle>
              <CardDescription>
                Follow this step-by-step path to build the skills required for a {careerPath.title} career
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoadmapTimeline skills={careerPath.skills} />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          {/* Progress tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Track Your Progress</CardTitle>
              <CardDescription>
                Monitor your advancement through this career path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressTracker 
                totalSkills={userProgress.totalSkills} 
                completedSkills={userProgress.completedSkills}
              />
              
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Next Recommended Steps</h3>
                <ul className="space-y-3">
                  {careerPath.skills.slice(userProgress.completedSkills, userProgress.completedSkills + 2).map(skill => (
                    <li key={skill.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <CircleDot className="h-3 w-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                          Start Learning
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Skills breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Breakdown</CardTitle>
              <CardDescription>
                Analysis of skill types and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SkillsBreakdown skills={careerPath.skills} />
            </CardContent>
          </Card>
          
          {/* Related job opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Related Job Opportunities</CardTitle>
              <CardDescription>
                Jobs currently hiring for this role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RelatedJobs careerTitle={careerPath.title} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmapPage;