import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "../../components/CourseCard";

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity");

  // Fetch all available courses
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses/all"],
  });

  // Domain options
  const domains = [
    { value: "all", label: "All Domains" },
    { value: "DevOps", label: "DevOps" },
    { value: "MERN", label: "MERN Stack" },
    { value: "AI", label: "AI & ML" },
    { value: "CyberSecurity", label: "Cyber Security" },
    { value: "BDE", label: "Big Data Engineering" },
    { value: "DigitalMarketing", label: "Digital Marketing" },
  ];

  // Filter courses based on search term and selected domain
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === "all" || course.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  // Sort courses based on selected sorting option
  const sortedCourses = filteredCourses?.slice().sort((a, b) => {
    if (sortBy === "price-low") {
      return (a.price || 0) - (b.price || 0);
    } else if (sortBy === "price-high") {
      return (b.price || 0) - (a.price || 0);
    } else if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Default sort by popularity (which could be based on enrollments or ratings)
    return 0; // Placeholder for now
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Explore Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger>
              <SelectValue placeholder="Select Domain" />
            </SelectTrigger>
            <SelectContent>
              {domains.map((domain) => (
                <SelectItem key={domain.value} value={domain.value}>
                  {domain.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="courses">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="courses">All Courses</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 h-[300px] animate-pulse"></div>
              ))}
            </div>
          ) : sortedCourses?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedCourses.map(course => (
                <CourseCard key={course.id} course={course} variant="purchase" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-500">No courses found</h3>
              <p className="mt-2 text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="paths">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-500">Learning Paths Coming Soon</h3>
            <p className="mt-2 text-gray-400">We're working on structured learning paths for your career goals</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
