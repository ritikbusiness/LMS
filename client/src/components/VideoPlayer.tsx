import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "../lib/queryClient";

interface VideoPlayerProps {
  lessonId: string;
  courseId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ lessonId, courseId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch lesson details
  const { data: lesson, isLoading } = useQuery({
    queryKey: ["/api/lessons", lessonId],
  });

  // Fetch lesson materials
  const { data: materials } = useQuery({
    queryKey: ["/api/lessons", lessonId, "materials"],
  });

  // Track progress mutation
  const trackProgressMutation = useMutation({
    mutationFn: (data: { watchTime: number; completed: boolean }) => 
      apiRequest("POST", `/api/lessons/${lessonId}/progress`, data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/courses", courseId, "progress"] });
    },
  });

  // Simulate watching progress
  useEffect(() => {
    if (isPlaying && duration > 0) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            // Mark as completed when reached the end
            trackProgressMutation.mutate({ watchTime: duration, completed: true });
            return duration;
          }
          // Update progress every 5 seconds
          if (Math.floor(prev) % 5 === 0) {
            trackProgressMutation.mutate({ watchTime: Math.floor(prev), completed: false });
          }
          return prev + 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration, trackProgressMutation]);

  // Format time (seconds) to MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 animate-pulse aspect-video rounded-t-lg"></div>
    );
  }

  return (
    <div className="bg-gray-900 text-white rounded-t-lg overflow-hidden">
      {/* Video display area */}
      <div className="aspect-video flex items-center justify-center bg-black relative">
        {!isPlaying ? (
          <button 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="h-20 w-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <i className="ri-play-fill text-4xl"></i>
            </div>
          </button>
        ) : null}
        
        {/* Video placeholder */}
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          {lesson?.videoUrl ? (
            <iframe 
              src={`${lesson.videoUrl}?autoplay=${isPlaying ? 1 : 0}`} 
              className="w-full h-full" 
              allowFullScreen
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          ) : (
            <div className="text-center">
              <i className="ri-file-video-line text-6xl mb-4 text-gray-400"></i>
              <p>Video unavailable</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Video controls */}
      <div className="p-4 bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-medium truncate">{lesson?.title}</div>
          <div className="text-sm">{lesson?.moduleTitle}</div>
        </div>
        
        <div className="w-full bg-gray-600 rounded-full h-1.5 mb-4 cursor-pointer">
          <div 
            className="bg-primary-500 h-1.5 rounded-full" 
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="text-2xl" onClick={togglePlay}>
              <i className={`ri-${isPlaying ? 'pause' : 'play'}-line`}></i>
            </button>
            <button className="text-xl relative group">
              <i className="ri-volume-up-line"></i>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume} 
                  onChange={e => setVolume(parseInt(e.target.value))} 
                  className="w-24"
                />
              </div>
            </button>
            <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration || 0)}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-xl">
              <i className="ri-settings-3-line"></i>
            </button>
            <button className="text-xl" onClick={toggleFullscreen}>
              <i className={`ri-${isFullscreen ? 'fullscreen-exit' : 'fullscreen'}-line`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Lesson description and materials */}
      <div className="p-6 bg-white text-gray-800">
        <h3 className="text-lg font-bold mb-4">Lesson Description</h3>
        <p className="text-gray-700 mb-6">{lesson?.description}</p>
        
        {materials?.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4">Materials</h3>
            <div className="space-y-2">
              {materials.map((material: any) => (
                <a 
                  key={material.id}
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <i className="ri-file-download-line text-lg text-primary-500 mr-3"></i>
                  <div>
                    <div className="font-medium">{material.title}</div>
                    <div className="text-xs text-gray-500">{material.type} • {material.size}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-between">
          <Button variant="outline">
            <i className="ri-arrow-left-s-line mr-2"></i>
            Previous Lesson
          </Button>
          <Button>
            Next Lesson
            <i className="ri-arrow-right-s-line ml-2"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
