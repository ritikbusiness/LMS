import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import CourseForm from "@/components/CourseForm";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";

// Course Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
    published: "bg-green-100 text-green-800 border-green-200",
    archived: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const variant = status as keyof typeof variants;
  return (
    <Badge className={`${variants[variant]} border hover:${variants[variant]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Course Management Page
export default function ManageCourses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // Fetch instructor courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/instructor/courses'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/instructor/courses');
      return response.json();
    },
    enabled: !!user && (user.role === 'instructor' || user.role === 'admin')
  });

  // Handle course deletion
  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await apiRequest('DELETE', `/api/courses/${courseId}`);
      
      // Invalidate courses cache to refresh list
      queryClient.invalidateQueries({ queryKey: ['/api/instructor/courses'] });
      
      toast({
        title: 'Course deleted',
        description: 'The course has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the course. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Group courses by status
  const coursesByStatus = {
    draft: courses.filter((course: any) => course.status === 'draft'),
    published: courses.filter((course: any) => course.status === 'published'),
    archived: courses.filter((course: any) => course.status === 'archived'),
  };

  // Check if user is authorized
  if (user && user.role !== 'instructor' && user.role !== 'admin') {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>
              You need to be an instructor to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Courses</h1>
          <p className="text-gray-500 mt-1">Create, edit, and manage your courses</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new course.
              </DialogDescription>
            </DialogHeader>
            <CourseForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All Courses ({courses.length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({coursesByStatus.draft.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Published ({coursesByStatus.published.length})
            </TabsTrigger>
            <TabsTrigger value="archived">
              Archived ({coursesByStatus.archived.length})
            </TabsTrigger>
          </TabsList>

          {/* All Courses Tab */}
          <TabsContent value="all">
            <CourseGrid 
              courses={courses} 
              handleDeleteCourse={handleDeleteCourse}
              setEditingCourse={setEditingCourse}
            />
          </TabsContent>

          {/* Draft Courses Tab */}
          <TabsContent value="draft">
            <CourseGrid 
              courses={coursesByStatus.draft} 
              handleDeleteCourse={handleDeleteCourse}
              setEditingCourse={setEditingCourse}
            />
          </TabsContent>

          {/* Published Courses Tab */}
          <TabsContent value="published">
            <CourseGrid 
              courses={coursesByStatus.published} 
              handleDeleteCourse={handleDeleteCourse}
              setEditingCourse={setEditingCourse}
            />
          </TabsContent>

          {/* Archived Courses Tab */}
          <TabsContent value="archived">
            <CourseGrid 
              courses={coursesByStatus.archived}
              handleDeleteCourse={handleDeleteCourse}
              setEditingCourse={setEditingCourse}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Edit Course Dialog */}
      {editingCourse && (
        <Dialog 
          open={!!editingCourse} 
          onOpenChange={(open) => !open && setEditingCourse(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update your course information.
              </DialogDescription>
            </DialogHeader>
            <CourseForm 
              initialData={editingCourse}
              courseId={editingCourse.id}
              onSuccess={() => setEditingCourse(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Course Grid Component
function CourseGrid({ 
  courses, 
  handleDeleteCourse, 
  setEditingCourse 
}: { 
  courses: any[],
  handleDeleteCourse: (id: number) => void,
  setEditingCourse: (course: any) => void
}) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No courses found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <div className="h-40 bg-gray-200 relative">
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
            <div className="absolute top-2 right-2">
              <StatusBadge status={course.status} />
            </div>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-1">{course.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {course.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">{course.domain}</Badge>
              {course.price > 0 ? (
                <Badge variant="secondary">${course.price.toFixed(2)}</Badge>
              ) : (
                <Badge variant="secondary">Free</Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <a href={`/courses/${course.id}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-1" /> View
              </a>
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingCourse(course)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteCourse(course.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}