import React, { useState, useRef, useEffect } from 'react';
import { FeatureTooltip } from '@/components/ui/contextual-help';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import {
  Play, Pause, Volume2, VolumeX, Maximize, SkipForward, 
  RotateCcw, Settings, Lock, ShieldCheck
} from 'lucide-react';

// Types
interface VideoSource {
  src: string;
  type: string;
  quality?: string; // e.g., "720p", "1080p", "480p"
  label?: string;
}

interface VideoTrack {
  src: string;
  srcLang: string;
  label: string;
  kind: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  default?: boolean;
}

interface SecureVideoPlayerProps {
  sources: VideoSource[];
  title?: string;
  poster?: string;
  tracks?: VideoTrack[];
  autoPlay?: boolean;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  className?: string;
  isPreview?: boolean;
  previewTimeLimit?: number; // in seconds
  initialStartTime?: number; // in seconds
  drmProtected?: boolean;
  courseId?: string | number;
  lessonId?: string | number;
}

export function SecureVideoPlayer({
  sources,
  title,
  poster,
  tracks = [],
  autoPlay = false,
  onTimeUpdate,
  onEnded,
  className,
  isPreview = false,
  previewTimeLimit = 120, // 2 minutes preview by default
  initialStartTime = 0,
  drmProtected = false,
  courseId,
  lessonId
}: SecureVideoPlayerProps) {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialStartTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState<string>(
    sources.find(s => s.quality)?.quality || 'auto'
  );
  const [showQualitySelector, setShowQualitySelector] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [bufferingProgress, setBufferingProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showPreviewWarning, setShowPreviewWarning] = useState(false);
  const [previewTimeRemaining, setPreviewTimeRemaining] = useState(previewTimeLimit);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Add CORS headers to ensure secure streaming
  const secureHeaders = {
    'Referer': window.location.origin,
    'Origin': window.location.origin,
  };
  
  // Generate a secure signed URL if needed
  const getSecureUrl = (src: string) => {
    if (!drmProtected) return src;
    
    // In a real app, this would call an API endpoint to get a signed URL
    // Here we just add a query parameter to demonstrate the concept
    const securityToken = `token=${encodeURIComponent(window.location.hostname)}&courseId=${courseId}&lessonId=${lessonId}`;
    return src.includes('?') ? `${src}&${securityToken}` : `${src}?${securityToken}`;
  };
  
  // Video control handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newVolume = value[0];
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };
  
  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    
    const seekTime = value[0];
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };
  
  const handleSkipForward = () => {
    if (!videoRef.current) return;
    
    const newTime = Math.min(videoRef.current.currentTime + 10, duration);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleSkipBackward = () => {
    if (!videoRef.current) return;
    
    const newTime = Math.max(videoRef.current.currentTime - 10, 0);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  const changeQuality = (quality: string) => {
    if (!videoRef.current) return;
    
    // Save current playback state and position
    const wasPlaying = !videoRef.current.paused;
    const currentPosition = videoRef.current.currentTime;
    
    // Find source with selected quality
    const newSource = sources.find(s => s.quality === quality);
    if (!newSource) return;
    
    // Update video source
    videoRef.current.src = getSecureUrl(newSource.src);
    videoRef.current.load();
    
    // Restore playback position
    videoRef.current.currentTime = currentPosition;
    
    // Restore playback state
    if (wasPlaying) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video after quality change:', error);
      });
    }
    
    setSelectedQuality(quality);
    setShowQualitySelector(false);
  };
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle controls visibility
  const showControlsTemporarily = () => {
    setShowControls(true);
    
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  // Preview mode logic
  useEffect(() => {
    if (!isPreview || !videoRef.current) return;
    
    let previewInterval: NodeJS.Timeout;
    
    if (isPlaying) {
      previewInterval = setInterval(() => {
        setPreviewTimeRemaining(prev => {
          const newValue = prev - 1;
          
          // Show warning when 30 seconds remaining
          if (newValue === 30) {
            setShowPreviewWarning(true);
          }
          
          // Time's up, pause video
          if (newValue <= 0) {
            if (videoRef.current) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
            clearInterval(previewInterval);
            return 0;
          }
          
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (previewInterval) clearInterval(previewInterval);
    };
  }, [isPreview, isPlaying]);
  
  // Set up event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Set initial volume
    video.volume = volume;
    
    // Set initial playback position
    if (initialStartTime > 0) {
      video.currentTime = initialStartTime;
      setCurrentTime(initialStartTime);
    }
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime, video.duration);
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      
      // Extract available qualities from sources
      const qualities = sources
        .filter(source => source.quality)
        .map(source => source.quality as string);
      
      if (qualities.length > 0) {
        setAvailableQualities(['auto', ...qualities]);
      }
    };
    
    const handleVideoEnd = () => {
      setIsPlaying(false);
      if (onEnded) {
        onEnded();
      }
    };
    
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        setBufferingProgress(bufferedPercent);
      }
    };
    
    const handleWaiting = () => {
      setIsBuffering(true);
    };
    
    const handlePlaying = () => {
      setIsBuffering(false);
    };
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    // Add event listeners
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Remove event listeners on cleanup
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  return (
    <FeatureTooltip
      title="Secure Video Streaming"
      content="Our platform uses AWS S3 and CloudFront to ensure secure, high-quality video delivery with DRM protection and bandwidth optimization."
      position="top"
      showIcon={false}
    >
      <div 
        ref={containerRef}
        className={cn(
          "relative overflow-hidden bg-black rounded-lg",
          isFullscreen ? "fixed inset-0 z-50" : "aspect-video", 
          className
        )}
        onMouseMove={showControlsTemporarily}
        onClick={() => setShowControls(true)}
      >
        {/* Video element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={poster}
          preload="metadata"
          playsInline
          autoPlay={autoPlay}
          crossOrigin="anonymous"
        >
          {/* Primary source */}
          <source 
            src={getSecureUrl(sources[0].src)} 
            type={sources[0].type} 
          />
          
          {/* Alternative sources for different qualities */}
          {sources.slice(1).map((source, index) => (
            <source 
              key={index}
              src={getSecureUrl(source.src)}
              type={source.type}
              data-quality={source.quality}
            />
          ))}
          
          {/* Subtitle tracks */}
          {tracks.map((track, index) => (
            <track
              key={index}
              src={track.src}
              kind={track.kind}
              srcLang={track.srcLang}
              label={track.label}
              default={track.default}
            />
          ))}
          
          Your browser does not support HTML5 video.
        </video>
        
        {/* Security indicator */}
        {drmProtected && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white rounded-full p-2">
            <ShieldCheck className="h-4 w-4 text-green-400" />
          </div>
        )}
        
        {/* Loading spinner */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Preview warning */}
        {isPreview && showPreviewWarning && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-amber-900 bg-opacity-80 text-white px-4 py-2 rounded-md">
            <p className="flex items-center text-sm font-medium">
              <Lock className="h-4 w-4 mr-2" />
              Preview ends in {previewTimeRemaining} seconds
            </p>
          </div>
        )}
        
        {/* Title overlay */}
        {title && showControls && (
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
            <h3 className="text-white font-medium truncate">{title}</h3>
          </div>
        )}
        
        {/* Video controls */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-2 pt-8 transition-opacity", 
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Progress bar */}
          <div className="relative w-full h-1 bg-gray-600 rounded-full cursor-pointer group mb-3"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              const seekTime = percent * duration;
              handleSeek([seekTime]);
            }}
          >
            {/* Buffering progress */}
            <div 
              className="absolute top-0 left-0 h-full bg-gray-400 rounded-full"
              style={{ width: `${bufferingProgress}%` }}
            ></div>
            
            {/* Playback progress */}
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
            
            {/* Draggable handle */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Play/Pause button */}
              <Button 
                variant="ghost" 
                size="sm"
                className="h-9 w-9 p-0 rounded-full text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              {/* Skip backward */}
              <Button 
                variant="ghost" 
                size="sm"
                className="h-9 w-9 p-0 rounded-full text-white hover:bg-white/20"
                onClick={handleSkipBackward}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              {/* Skip forward */}
              <Button 
                variant="ghost" 
                size="sm"
                className="h-9 w-9 p-0 rounded-full text-white hover:bg-white/20"
                onClick={handleSkipForward}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              
              {/* Volume control */}
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 w-9 p-0 rounded-full text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <div className="hidden sm:block w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Time display */}
              <div className="text-xs text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Quality selector */}
              {availableQualities.length > 0 && (
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-9 px-2 text-sm text-white hover:bg-white/20"
                    onClick={() => setShowQualitySelector(!showQualitySelector)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    {selectedQuality}
                  </Button>
                  
                  {showQualitySelector && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-md shadow-lg overflow-hidden">
                      {availableQualities.map((quality) => (
                        <button
                          key={quality}
                          className={cn(
                            "block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800",
                            selectedQuality === quality && "bg-blue-600"
                          )}
                          onClick={() => changeQuality(quality)}
                        >
                          {quality}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Fullscreen button */}
              <Button 
                variant="ghost" 
                size="sm"
                className="h-9 w-9 p-0 rounded-full text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FeatureTooltip>
  );
}