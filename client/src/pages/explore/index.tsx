import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { BookOpen, Clock, Users, Star, Briefcase, Shield, Database, FileCode, Code, TrendingUp } from "lucide-react";

const domainIcons: Record<string, any> = {
  "DevOps": <FileCode className="h-5 w-5 text-purple-500" />,
  "MERN": <Code className="h-5 w-5 text-blue-500" />,
  "AI": <TrendingUp className="h-5 w-5 text-green-500" />,
  "CyberSecurity": <Shield className="h-5 w-5 text-red-500" />,
  "BDE": <Database className="h-5 w-5 text-orange-500" />,
  "DigitalMarketing": <Briefcase className="h-5 w-5 text-pink-500" />,
};

export default function ExplorePage() {
  const { user } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState<string | undefined>(
    user?.domain || undefined
  );
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  // Update selected domain when user data is loaded
  useEffect(() => {
    if (user?.domain) {
      setSelectedDomain(user.domain);
    }
  }, [user]);

  // Fetch courses based on selected domain
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses', selectedDomain, selectedLevel],
    queryFn: async () => {
      let url = '/api/courses?status=published';
      
      if (selectedDomain) {
        url += `&domain=${selectedDomain}`;
      }
      
      // In a real app, you would add level filtering parameter here
      
      const response = await apiRequest('GET', url);
      return response.json();
    }
  });

  // Fetch university partners
  const { data: partners = [] } = useQuery({
    queryKey: ['/api/partners'],
    queryFn: async () => {
      return [
        { id: 1, name: "Stanford", logo: "https://placehold.co/80x40?text=Stanford" },
        { id: 2, name: "MIT", logo: "https://placehold.co/80x40?text=MIT" },
        { id: 3, name: "Harvard", logo: "https://placehold.co/80x40?text=Harvard" },
        { id: 4, name: "Google", logo: "https://placehold.co/80x40?text=Google" },
        { id: 5, name: "IBM", logo: "https://placehold.co/80x40?text=IBM" },
        { id: 6, name: "Microsoft", logo: "https://placehold.co/80x40?text=MS" },
      ];
    }
  });

  const domainOptions = [
    { value: undefined, label: "All Domains" },
    { value: "DevOps", label: "DevOps" },
    { value: "MERN", label: "Web Development" },
    { value: "AI", label: "Artificial Intelligence" },
    { value: "CyberSecurity", label: "Cyber Security" },
    { value: "BDE", label: "Big Data Engineering" },
    { value: "DigitalMarketing", label: "Digital Marketing" },
  ];

  const levelOptions = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ];

  const handleDomainChange = (value: string) => {
    setSelectedDomain(value === "All Domains" ? undefined : value);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
  };

  // Get roadmap subtitle based on selected domain
  const getDomainRoadmapSubtitle = (domain?: string) => {
    switch (domain) {
      case "DevOps":
        return "Learn automation, deployment, infrastructure, and CI/CD pipelines";
      case "MERN":
        return "Master MongoDB, Express, React, and Node.js stack development";
      case "AI":
        return "Explore machine learning, neural networks, and advanced algorithms";
      case "CyberSecurity":
        return "Study defense strategies, ethical hacking, and security protocols";
      case "BDE":
        return "Handle large-scale data processing, analytics, and visualization";
      case "DigitalMarketing":
        return "Develop SEO, social media, content marketing, and analytics skills";
      default:
        return "Select a domain to see a personalized learning roadmap";
    }
  };

  // Generate roadmap steps based on domain
  const getRoadmapSteps = (domain?: string) => {
    if (!domain) return [];

    const roadmaps: Record<string, string[]> = {
      "DevOps": [
        "Linux Fundamentals",
        "Networking & Security Basics",
        "Git & Version Control",
        "Containerization (Docker)",
        "Orchestration (Kubernetes)",
        "CI/CD Pipelines",
        "Infrastructure as Code",
        "Monitoring & Logging"
      ],
      "MERN": [
        "HTML, CSS & JavaScript",
        "React Fundamentals",
        "NodeJS & Express",
        "MongoDB",
        "RESTful API Design",
        "Authentication & Authorization",
        "State Management",
        "Deployment & DevOps"
      ],
      "AI": [
        "Python Programming",
        "Math & Statistics",
        "Data Processing & Visualization",
        "Machine Learning Fundamentals",
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Deployment & Production"
      ],
      "CyberSecurity": [
        "Networking Fundamentals",
        "Operating Systems Security",
        "Cryptography",
        "Security Protocols",
        "Vulnerability Assessment",
        "Penetration Testing",
        "Incident Response",
        "Security Frameworks & Compliance"
      ],
      "BDE": [
        "SQL & Database Concepts",
        "Python/Java Programming",
        "Data Structures & Algorithms",
        "Hadoop Ecosystem",
        "Apache Spark",
        "NoSQL Databases",
        "ETL Pipelines",
        "Data Visualization"
      ],
      "DigitalMarketing": [
        "Marketing Fundamentals",
        "SEO & Web Analytics",
        "Content Marketing",
        "Social Media Strategy",
        "Email Marketing",
        "PPC & Ads",
        "Conversion Optimization",
        "Marketing Analytics"
      ]
    };

    return roadmaps[domain] || [];
  };

  // Career roles associated with each domain
  const domainRoles: Record<string, any[]> = {
    "DevOps": [
      { 
        title: "DevOps Engineer", 
        description: "Build, test, and maintain infrastructure and tools for software development", 
        salary: "$95,000", 
        jobsAvailable: "4,500+"
      },
      { 
        title: "Site Reliability Engineer", 
        description: "Ensure that systems are reliable, scalable, and efficient",
        salary: "$110,000", 
        jobsAvailable: "2,800+"
      }
    ],
    "MERN": [
      { 
        title: "Full-Stack Developer", 
        description: "Build and maintain both client and server-side applications", 
        salary: "$85,000", 
        jobsAvailable: "8,200+"
      },
      { 
        title: "Frontend React Developer", 
        description: "Create responsive and interactive user interfaces with React",
        salary: "$92,000", 
        jobsAvailable: "6,400+"
      }
    ],
    "AI": [
      { 
        title: "Machine Learning Engineer", 
        description: "Design and implement machine learning models and systems", 
        salary: "$120,000", 
        jobsAvailable: "3,600+"
      },
      { 
        title: "Data Scientist", 
        description: "Extract insights and build predictive models from complex data",
        salary: "$105,000", 
        jobsAvailable: "5,100+"
      }
    ],
    "CyberSecurity": [
      { 
        title: "Security Analyst", 
        description: "Monitor and protect systems from cyber threats and attacks", 
        salary: "$92,000", 
        jobsAvailable: "7,300+"
      },
      { 
        title: "Penetration Tester", 
        description: "Identify and exploit vulnerabilities in systems and networks",
        salary: "$98,000", 
        jobsAvailable: "2,200+"
      }
    ],
    "BDE": [
      { 
        title: "Big Data Engineer", 
        description: "Design and build systems for processing and analyzing large datasets", 
        salary: "$115,000", 
        jobsAvailable: "3,800+"
      },
      { 
        title: "Data Architect", 
        description: "Design and implement data management solutions",
        salary: "$125,000", 
        jobsAvailable: "1,900+"
      }
    ],
    "DigitalMarketing": [
      { 
        title: "Digital Marketing Specialist", 
        description: "Develop and implement online marketing strategies", 
        salary: "$75,000", 
        jobsAvailable: "9,600+"
      },
      { 
        title: "SEO Manager", 
        description: "Optimize website content to increase organic traffic",
        salary: "$85,000", 
        jobsAvailable: "3,700+"
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="mb-12 text-center py-14 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn without limits</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Start, switch, or advance your career with over 500 courses, Professional Certificates, and degrees from world-class universities and companies.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Join For Free
          </Button>
          <Button size="lg" variant="outline">
            Try Enterprise Plan
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

      {/* Filter Section */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold">Choose your role</h2>
            <p className="text-gray-500">Gain the knowledge and skills you need to advance</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Select 
              value={selectedLevel} 
              onValueChange={handleLevelChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={selectedDomain} 
              onValueChange={handleDomainChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Domain" />
              </SelectTrigger>
              <SelectContent>
                {domainOptions.map(option => (
                  <SelectItem 
                    key={option.label} 
                    value={option.value || "All Domains"}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Domain Pill Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {domainOptions.slice(1).map(domain => (
            <Button 
              key={domain.value} 
              variant={selectedDomain === domain.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDomain(domain.value)}
              className="rounded-full"
            >
              {domain.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Learning Roadmap + Careers Section */}
      {selectedDomain && (
        <div className="mb-12 grid md:grid-cols-2 gap-8">
          {/* Learning Roadmap */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                {selectedDomain} Learning Roadmap
              </CardTitle>
              <CardDescription>
                {getDomainRoadmapSubtitle(selectedDomain)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                <ol className="relative space-y-4">
                  {getRoadmapSteps(selectedDomain).map((step, index) => (
                    <li key={index} className="ml-6">
                      <div className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">
                        {index + 1}
                      </div>
                      <h3 className="font-medium">{step}</h3>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Career Roles */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-xl">Career Opportunities</CardTitle>
              <CardDescription>
                Jobs available after completing the {selectedDomain} track
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {domainRoles[selectedDomain]?.map((role, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-blue-700">{role.title}</h3>
                  <p className="text-gray-600 mt-1 text-sm">{role.description}</p>
                  <div className="mt-3 flex justify-between text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Median Salary:</span>
                      <span className="ml-1 font-bold">{role.salary}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Jobs:</span>
                      <span className="ml-1 font-bold">{role.jobsAvailable}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Course List */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Explore {selectedDomain || 'All'} Courses</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-500">
              {selectedDomain
                ? `There are currently no published courses in the ${selectedDomain} domain.`
                : "There are currently no published courses."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
      
      {/* Testimonials Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">175+ million people have already joined Kayago</h2>
        
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
}

// Course Card Component
function CourseCard({ course }: { course: any }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No thumbnail
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-blue-600">{course.domain}</Badge>
        {course.price === 0 && (
          <Badge className="absolute top-2 left-2 bg-green-600">Free</Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="text-sm text-gray-500 mb-1">
          {domainIcons[course.domain] || <BookOpen className="h-4 w-4 inline mr-1" />}
          <span className="ml-1">{course.domain}</span>
        </div>
        <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <CardDescription className="line-clamp-2 mb-3">{course.description}</CardDescription>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>8 weeks</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>Beginner Level</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-3 border-t">
        <div className="w-full flex justify-between items-center">
          <div>
            {course.price > 0 ? (
              <div className="font-bold">${course.price.toFixed(2)}</div>
            ) : (
              <div className="font-bold text-green-600">Free</div>
            )}
          </div>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/courses/${course.id}`}>View Course</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}