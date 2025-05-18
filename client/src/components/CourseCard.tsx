import { Link } from "wouter";
import { Course } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "../lib/queryClient";

interface CourseCardProps {
  course: Course;
  variant: "progress" | "purchase"; // progress for enrolled courses, purchase for store
}

const CourseCard: React.FC<CourseCardProps> = ({ course, variant }) => {
  const { toast } = useToast();

  // Example progress data - in a real app, this would come from the enrollment record
  const progress = variant === "progress" ? {
    completedModules: 4,
    totalModules: 8,
    percentage: 50
  } : null;

  const handleEnroll = async () => {
    try {
      await apiRequest("POST", `/api/courses/${course.id}/enroll`, {});
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/courses/enrolled"] });
      
      toast({
        title: "Enrolled Successfully",
        description: `You are now enrolled in "${course.title}"`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Enrollment Failed",
        description: "There was an error enrolling in this course. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Course thumbnail */}
      <img 
        src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80"} 
        alt={course.title} 
        className="w-full h-40 object-cover"
      />
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              {course.domain}
            </span>
            <h3 className="mt-2 text-lg font-bold line-clamp-1">{course.title}</h3>
          </div>
          
          {variant === "progress" && progress && (
            <div className="bg-primary-50 text-primary-500 font-semibold text-xs px-2 py-1 rounded">
              {progress.completedModules}/{progress.totalModules} Modules
            </div>
          )}

          {variant === "purchase" && (
            <div className="bg-amber-50 text-amber-500 font-semibold text-xs px-2 py-1 rounded">
              New
            </div>
          )}
        </div>
        
        {variant === "progress" && progress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progress.percentage}%</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>
        )}

        {variant === "purchase" && (
          <>
            <div className="mt-3 flex items-center">
              <div className="flex text-amber-400">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-half-fill"></i>
              </div>
              <span className="ml-2 text-sm text-gray-600">4.5 (234 reviews)</span>
            </div>
            
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
              {course.description}
            </p>
          </>
        )}
        
        <div className="mt-5">
          {variant === "progress" ? (
            <Link href={`/courses/${course.id}`}>
              <a className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium flex items-center justify-center">
                Continue
              </a>
            </Link>
          ) : (
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">${course.price.toFixed(2)}</span>
              <Button onClick={handleEnroll}>
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
