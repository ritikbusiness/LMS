import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import CourseCard from "../../components/CourseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const MyCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("in-progress");

  // Fetch enrolled courses
  const { data: enrolledCourses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses/enrolled"],
  });

  // Filter courses based on search term and active tab
  const filteredCourses = enrolledCourses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "in-progress") {
      // Logic would be more complex based on course progress data
      return matchesSearch && true; // For now, assume all are in-progress
    } else if (activeTab === "completed") {
      return matchesSearch && false; // For now, assume none are completed
    }
    
    return matchesSearch;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <div className="w-64">
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="in-progress" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="in-progress">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 h-[300px] animate-pulse"></div>
              ))}
            </div>
          ) : filteredCourses?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} variant="progress" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-500">No courses in progress</h3>
              <p className="mt-2 text-gray-400">Explore and enroll in courses to start learning</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-500">You haven't completed any courses yet</h3>
            <p className="mt-2 text-gray-400">Keep learning to complete your courses</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyCourses;
