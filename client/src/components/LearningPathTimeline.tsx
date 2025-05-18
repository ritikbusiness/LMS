import { LearningPath } from "@shared/schema";
import { Link } from "wouter";

interface LearningPathTimelineProps {
  path: LearningPath;
  progress: number;
}

const LearningPathTimeline: React.FC<LearningPathTimelineProps> = ({ path, progress }) => {
  // This would come from the backend in a real app
  const steps = [
    { id: 1, title: "Linux Basics", status: "completed", date: "Oct 15, 2023", courseId: "101" },
    { id: 2, title: "Git & GitHub", status: "completed", date: "Nov 2, 2023", courseId: "102" },
    { id: 3, title: "Docker Fundamentals", status: "in-progress", progress: 50, courseId: "103" },
    { id: 4, title: "Kubernetes Essentials", status: "locked", courseId: "104" },
    { id: 5, title: "AWS Cloud Services", status: "locked", courseId: "105" },
    { id: 6, title: "CI/CD Pipelines", status: "locked", courseId: "106" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Timeline items */}
        <div className="space-y-8 relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex">
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                  step.status === "completed"
                    ? "bg-primary-500"
                    : step.status === "in-progress"
                    ? "bg-primary-500"
                    : "bg-gray-300"
                }`}
              >
                {step.status === "completed" ? (
                  <i className="ri-check-line text-white"></i>
                ) : step.status === "in-progress" ? (
                  <i className="ri-arrow-right-line text-white"></i>
                ) : (
                  <span className="text-white">{index + 1}</span>
                )}
              </div>
              <div className="ml-4">
                <h4 className={`text-lg font-medium ${
                  step.status === "locked" ? "text-gray-500" : "text-gray-900"
                }`}>
                  {step.title}
                </h4>
                
                {step.status === "completed" && (
                  <p className="text-sm text-gray-500">Completed on {step.date}</p>
                )}
                
                {step.status === "in-progress" && (
                  <>
                    <p className="text-sm text-gray-500">In progress - {step.progress}% complete</p>
                    <Link href={`/courses/${step.courseId}`}>
                      <a className="text-sm font-medium text-primary-500 hover:underline mt-1 inline-block">
                        Continue Learning →
                      </a>
                    </Link>
                  </>
                )}
                
                {step.status === "locked" && (
                  <p className="text-sm text-gray-500">
                    {index > 0 
                      ? `Unlocks after ${steps[index - 1].title}` 
                      : "Not started"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPathTimeline;
