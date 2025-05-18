import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { BookOpen, Clock, Users, Star } from "lucide-react";

export default function ExplorePage() {
  const { user } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState<string | undefined>(
    user?.domain || undefined
  );

  // Update selected domain when user data is loaded
  useEffect(() => {
    if (user?.domain) {
      setSelectedDomain(user.domain);
    }
  }, [user]);

  // Fetch courses based on selected domain
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses', selectedDomain],
    queryFn: async () => {
      const url = selectedDomain
        ? `/api/courses?domain=${selectedDomain}&status=published`
        : '/api/courses?status=published';
      const response = await apiRequest('GET', url);
      return response.json();
    }
  });

  const domainOptions = [
    { value: undefined, label: "All Domains" },
    { value: "DevOps", label: "DevOps" },
    { value: "MERN", label: "MERN Stack" },
    { value: "AI", label: "Artificial Intelligence" },
    { value: "CyberSecurity", label: "Cyber Security" },
    { value: "BDE", label: "Big Data Engineering" },
    { value: "DigitalMarketing", label: "Digital Marketing" },
  ];

  const handleDomainChange = (value: string) => {
    setSelectedDomain(value === "All Domains" ? undefined : value);
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Explore Courses</h1>
          <p className="text-gray-500 mt-1">Discover courses based on your interests</p>
        </div>
        <div className="w-full md:w-64">
          <Select 
            value={selectedDomain} 
            onValueChange={handleDomainChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Domain" />
            </SelectTrigger>
            <SelectContent>
              {domainOptions.map((option) => (
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

      {/* Learning Roadmap */}
      {selectedDomain && (
        <Card className="mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              {selectedDomain} Learning Roadmap
            </CardTitle>
            <CardDescription>
              {getDomainRoadmapSubtitle(selectedDomain)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-primary/20"></div>
              <ol className="relative space-y-4">
                {getRoadmapSteps(selectedDomain).map((step, index) => (
                  <li key={index} className="ml-6">
                    <div className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">
                      {index + 1}
                    </div>
                    <h3 className="font-medium">{step}</h3>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

// Course Card Component
function CourseCard({ course }: { course: any }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
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
        <Badge className="absolute top-2 right-2 bg-primary">{course.domain}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>8 Weeks</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            <span>42 Students</span>
          </div>
          <div className="flex items-center col-span-2">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            <span>4.8 Rating (24 reviews)</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 pt-4">
        <div className="w-full flex justify-between items-center">
          <div>
            {course.price > 0 ? (
              <div className="font-bold text-lg">${course.price.toFixed(2)}</div>
            ) : (
              <div className="font-bold text-lg text-green-600">Free</div>
            )}
          </div>
          <Button asChild>
            <a href={`/courses/${course.id}`}>View Course</a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}