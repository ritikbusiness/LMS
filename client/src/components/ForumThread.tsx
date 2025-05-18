import { ForumThread as ThreadType } from "@shared/schema";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "../lib/queryClient";

interface ForumThreadProps {
  thread: ThreadType;
  showActions?: boolean;
}

const ForumThread: React.FC<ForumThreadProps> = ({ thread, showActions = true }) => {
  const { toast } = useToast();

  // Tag styles based on status
  const getTagStyle = (status: string) => {
    switch (status) {
      case 'solved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Format tag label
  const getTagLabel = (status: string) => {
    switch (status) {
      case 'solved':
        return 'Solved';
      case 'closed':
        return 'Closed';
      default:
        return 'Help Needed';
    }
  };

  const handleVote = async (direction: 'up' | 'down') => {
    try {
      await apiRequest("POST", `/api/forum/threads/${thread.id}/vote`, { direction });
      
      // Invalidate queries that might include this thread
      queryClient.invalidateQueries({ queryKey: ["/api/forum/threads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/recent"] });
      
      toast({
        title: "Vote Recorded",
        description: `Your ${direction}-vote has been recorded.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Vote Failed",
        description: "There was an error recording your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start space-x-3">
        {showActions && (
          <div className="flex flex-col items-center space-y-1">
            <button 
              className="text-gray-400 hover:text-primary-500"
              onClick={() => handleVote('up')}
            >
              <i className="ri-arrow-up-s-line text-xl"></i>
            </button>
            <span className="font-medium text-gray-700">{thread.votes}</span>
            <button 
              className="text-gray-400 hover:text-gray-500"
              onClick={() => handleVote('down')}
            >
              <i className="ri-arrow-down-s-line text-xl"></i>
            </button>
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`${getTagStyle(thread.status)} text-xs px-2 py-0.5 rounded-full`}>
              {getTagLabel(thread.status)}
            </span>
            <Link href={`/forum/threads/${thread.id}`}>
              <a className="text-base font-medium hover:text-primary-500">{thread.title}</a>
            </Link>
          </div>
          
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {thread.content}
          </p>
          
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span>Posted in <a href={`/courses/${thread.courseId}`} className="text-primary-500 hover:underline">{thread.courseName}</a></span>
            <span className="mx-2">•</span>
            <span>{thread.replyCount} replies</span>
            <span className="mx-2">•</span>
            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumThread;
