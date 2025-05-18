import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ForumThread from "../../components/ForumThread";

const Forum = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isNewThreadOpen, setIsNewThreadOpen] = useState(false);

  // Fetch all forum threads
  const { data: threads, isLoading } = useQuery({
    queryKey: ["/api/forum/threads"],
  });

  // Fetch user's courses for the dropdown
  const { data: courses } = useQuery({
    queryKey: ["/api/courses/enrolled"],
  });

  // Filter threads based on search term, selected course, and tag
  const filteredThreads = threads?.filter(thread => {
    const matchesSearch = 
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "all" || thread.courseId.toString() === selectedCourse;
    const matchesTag = selectedTag === "all" || thread.status === selectedTag;
    return matchesSearch && matchesCourse && matchesTag;
  });

  // Tag options for filtering
  const tags = [
    { value: "all", label: "All Tags" },
    { value: "open", label: "Open" },
    { value: "solved", label: "Solved" },
    { value: "closed", label: "Closed" },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Discussion Forum</h1>
        
        <Dialog open={isNewThreadOpen} onOpenChange={setIsNewThreadOpen}>
          <DialogTrigger asChild>
            <Button>
              <i className="ri-add-line mr-2"></i>
              New Thread
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Thread</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map(course => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Thread Title</label>
                <Input placeholder="Enter a descriptive title" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <Textarea 
                  placeholder="Describe your question or discussion topic in detail..." 
                  rows={5}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewThreadOpen(false)}>Cancel</Button>
                <Button type="submit">Post Thread</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Input
            placeholder="Search threads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses?.map(course => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag.value} value={tag.value}>
                  {tag.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="latest">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="my-threads">My Threads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="latest">
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4 animate-pulse h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : filteredThreads?.length ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
              {filteredThreads.map(thread => (
                <ForumThread key={thread.id} thread={thread} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-500">No threads found</h3>
              <p className="mt-2 text-gray-400">Be the first to start a discussion!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="popular">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-500">Popular threads will appear here</h3>
            <p className="mt-2 text-gray-400">Threads with the most votes and replies will be shown</p>
          </div>
        </TabsContent>
        
        <TabsContent value="my-threads">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-500">Your threads will appear here</h3>
            <p className="mt-2 text-gray-400">Start a discussion to see your threads</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Forum;
