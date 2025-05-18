import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import VideoPlayer from "../../components/VideoPlayer";
import AssessmentQuiz from "../../components/AssessmentQuiz";
import ForumThread from "../../components/ForumThread";

interface CourseDetailProps {
  id: string;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ id }) => {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("content");

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["/api/courses", id],
  });

  // Fetch modules and lessons
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ["/api/courses", id, "modules"],
  });

  // Fetch forum threads for this course
  const { data: forumThreads, isLoading: forumLoading } = useQuery({
    queryKey: ["/api/courses", id, "forum"],
  });

  // Fetch progress for this course
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/courses", id, "progress"],
  });

  // Fetch assessments for this course
  const { data: assessments, isLoading: assessmentsLoading } = useQuery({
    queryKey: ["/api/courses", id, "assessments"],
  });

  const handleSelectLesson = (lessonId: string) => {
    setActiveLesson(lessonId);
    setActiveTab("content"); // Switch to content tab when selecting a lesson
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left sidebar - Course structure */}
      <div className="lg:w-72 flex-shrink-0">
        <Card>
          <CardContent className="p-4">
            {courseLoading || modulesLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <>
                <h2 className="font-bold text-lg mb-4">{course?.title}</h2>
                
                {!progressLoading && progress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{progress.percentage}%</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                  </div>
                )}
                
                <div className="space-y-2">
                  {modules?.map((module, moduleIndex) => (
                    <div key={module.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 px-3 py-2 font-medium">
                        {moduleIndex + 1}. {module.title}
                      </div>
                      <div className="p-2 space-y-1">
                        {module.lessons?.map((lesson, lessonIndex) => (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson.id)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center ${
                              activeLesson === lesson.id
                                ? "bg-primary-500 text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <div className="mr-2 flex-shrink-0">
                              {progress?.completedLessons?.includes(lesson.id) ? (
                                <i className="ri-checkbox-circle-fill text-green-500"></i>
                              ) : (
                                <i className="ri-play-circle-line"></i>
                              )}
                            </div>
                            <span className="truncate">{lessonIndex + 1}. {lesson.title}</span>
                          </button>
                        ))}
                        
                        {module.assessment && (
                          <button
                            onClick={() => {
                              setActiveLesson(module.assessment.id);
                              setActiveTab("assessments");
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center ${
                              activeLesson === module.assessment.id && activeTab === "assessments"
                                ? "bg-primary-500 text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <div className="mr-2 flex-shrink-0">
                              {progress?.completedAssessments?.includes(module.assessment.id) ? (
                                <i className="ri-checkbox-circle-fill text-green-500"></i>
                              ) : (
                                <i className="ri-file-list-line"></i>
                              )}
                            </div>
                            <span className="truncate">Assessment: {module.title}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Main content area */}
      <div className="flex-grow">
        {!activeLesson ? (
          // Course overview when no lesson is selected
          courseLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <div>
              {course?.thumbnailUrl && (
                <div className="rounded-lg overflow-hidden mb-6 h-64">
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h1 className="text-2xl font-bold mb-4">{course?.title}</h1>
              <div className="flex items-center mb-6">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {course?.domain}
                </span>
                <span className="ml-4 text-sm text-gray-500">
                  {modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0)} lessons
                </span>
              </div>
              
              <p className="text-gray-700 mb-6">{course?.description}</p>
              
              <Button 
                onClick={() => {
                  // Set the first lesson as active
                  if (modules && modules.length > 0 && modules[0].lessons && modules[0].lessons.length > 0) {
                    handleSelectLesson(modules[0].lessons[0].id);
                  }
                }}
                size="lg"
              >
                {progress && progress.percentage > 0 ? "Continue Learning" : "Start Learning"}
              </Button>
            </div>
          )
        ) : (
          // Lesson content when a lesson is selected
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="forum">Forum</TabsTrigger>
                <TabsTrigger value="assessments">Assessments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="p-0">
                <VideoPlayer 
                  lessonId={activeLesson} 
                  courseId={id} 
                />
              </TabsContent>
              
              <TabsContent value="forum">
                <CardContent>
                  <h2 className="text-xl font-bold mb-4">Discussion Forum</h2>
                  
                  <div className="space-y-4">
                    {forumLoading ? (
                      <div className="animate-pulse space-y-4">
                        {Array(3).fill(0).map((_, i) => (
                          <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    ) : forumThreads?.length ? (
                      forumThreads.map(thread => (
                        <ForumThread key={thread.id} thread={thread} />
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No discussions yet. Start a conversation!</p>
                        <Button className="mt-4">New Discussion</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="assessments">
                <CardContent>
                  <h2 className="text-xl font-bold mb-4">Assessments</h2>
                  
                  {assessmentsLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-40 bg-gray-200 rounded"></div>
                    </div>
                  ) : assessments?.length ? (
                    <AssessmentQuiz 
                      assessment={assessments.find(a => a.id === activeLesson) || assessments[0]} 
                      courseId={id} 
                    />
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No assessments available for this module.</p>
                    </div>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
