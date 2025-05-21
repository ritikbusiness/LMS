import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Heart, Award, Flag } from 'lucide-react';

// Animated button that shows a micro-interaction when clicked
interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showSparkle?: boolean;
}

export function AnimatedButton({
  icon,
  activeIcon,
  label,
  variant = 'default',
  size = 'default',
  showSparkle = false,
  className,
  ...props
}: AnimatedButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [sparkleVisible, setSparkleVisible] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsActive(true);
    if (showSparkle) {
      setSparkleVisible(true);
      setTimeout(() => setSparkleVisible(false), 700);
    }
    setTimeout(() => setIsActive(false), 300);
    props.onClick?.(e);
  };

  return (
    <div className="relative">
      <Button
        variant={variant as any}
        size={size as any}
        className={cn("transition-all", className)}
        onClick={handleClick}
        {...props}
      >
        <motion.div
          animate={isActive ? { scale: 0.9 } : { scale: 1 }}
          transition={{ duration: 0.15 }}
          className="flex items-center"
        >
          {icon && (
            <motion.span 
              className="mr-2"
              animate={isActive ? { rotate: 10 } : { rotate: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isActive && activeIcon ? activeIcon : icon}
            </motion.span>
          )}
          {label}
        </motion.div>
      </Button>

      {sparkleVisible && (
        <AnimatePresence>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
                initial={{ 
                  opacity: 1, 
                  x: "50%", 
                  y: "50%", 
                  scale: 0 
                }}
                animate={{ 
                  opacity: 0,
                  x: `calc(50% + ${Math.cos(i * (Math.PI / 4)) * 40}px)`,
                  y: `calc(50% + ${Math.sin(i * (Math.PI / 4)) * 40}px)`,
                  scale: 1
                }}
                transition={{ duration: 0.6 }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// Video player controls with animated interactions
interface VideoControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
  onRestart: () => void;
  progress: number; // 0-100
  duration: number; // in seconds
}

export function AnimatedVideoControls({
  isPlaying,
  onPlayPause,
  onSeek,
  onRestart,
  progress,
  duration
}: VideoControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * duration;

  return (
    <div className="flex flex-col gap-2 rounded-lg p-3 bg-gray-800 bg-opacity-90 text-white">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-gray-600 rounded-full cursor-pointer" 
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const position = (e.clientX - rect.left) / rect.width;
          onSeek(position * duration);
        }}
      >
        <motion.div 
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", damping: 15 }}
        />
        <motion.div 
          className="absolute top-0 w-3 h-3 -mt-0.75 -ml-1.5 bg-white rounded-full shadow-md"
          style={{ left: `${progress}%` }}
          animate={{ left: `${progress}%` }}
          whileTap={{ scale: 1.3 }}
          transition={{ type: "spring", damping: 15 }}
        />
      </div>
      
      {/* Controls and time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AnimatedButton
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            icon={isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            label=""
            onClick={onPlayPause}
          />
          
          <AnimatedButton
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            icon={<SkipForward className="h-4 w-4" />}
            label=""
            onClick={() => onSeek(currentTime + 10)}
          />
          
          <AnimatedButton
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            icon={<RotateCcw className="h-4 w-4" />}
            label=""
            onClick={onRestart}
          />
        </div>
        
        <div className="text-sm font-medium">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}

// Interactive course exploration animation
interface CourseExplorationProps {
  cards: {
    id: string | number;
    title: string;
    description: string;
    image?: string;
  }[];
  onSelect: (id: string | number) => void;
}

export function AnimatedCourseExploration({ cards, onSelect }: CourseExplorationProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="relative overflow-hidden rounded-xl w-full max-w-3xl mx-auto">
      <div className="absolute inset-x-0 top-1/2 flex justify-between px-4 z-10 -translate-y-1/2">
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-full h-10 w-10 p-0 bg-white bg-opacity-70 hover:bg-opacity-100"
          onClick={handlePrev}
        >
          ←
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-full h-10 w-10 p-0 bg-white bg-opacity-70 hover:bg-opacity-100"
          onClick={handleNext}
        >
          →
        </Button>
      </div>

      <div className="relative h-96">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            className="absolute inset-0"
            initial={{ 
              opacity: 0,
              x: direction * 100 + '%' 
            }}
            animate={{ 
              opacity: 1,
              x: 0 
            }}
            exit={{ 
              opacity: 0,
              x: direction * -100 + '%' 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="relative w-full h-full bg-blue-900">
              <img 
                src={cards[activeIndex].image || `https://placehold.co/1200x600?text=${encodeURIComponent(cards[activeIndex].title)}`}
                alt={cards[activeIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                <motion.h3 
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {cards[activeIndex].title}
                </motion.h3>
                <motion.p 
                  className="text-white/80 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {cards[activeIndex].description}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <AnimatedButton
                    label="Explore Course"
                    icon={<Sparkles className="h-4 w-4" />}
                    showSparkle={true}
                    className="bg-white text-blue-800 hover:bg-blue-50"
                    onClick={() => onSelect(cards[activeIndex].id)}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {cards.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              index === activeIndex ? "bg-blue-600 w-6" : "bg-gray-300 hover:bg-gray-400"
            )}
            onClick={() => {
              setDirection(index > activeIndex ? 1 : -1);
              setActiveIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Social interaction buttons with animations for course interaction
interface InteractionButtonsProps {
  likeCount?: number;
  bookmarkCount?: number;
  shareCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
}

export function AnimatedInteractionButtons({
  likeCount = 0,
  bookmarkCount = 0,
  shareCount = 0,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onBookmark,
  onShare
}: InteractionButtonsProps) {
  return (
    <div className="flex gap-4">
      <button 
        className="flex items-center gap-1 text-sm"
        onClick={onLike}
      >
        <motion.div
          whileTap={{ scale: 1.2 }}
          animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-colors", 
              isLiked ? "fill-red-500 text-red-500" : "text-gray-500"
            )} 
          />
        </motion.div>
        <span className={isLiked ? "text-red-500" : "text-gray-600"}>
          {likeCount > 0 ? likeCount : "Like"}
        </span>
      </button>
      
      <button 
        className="flex items-center gap-1 text-sm"
        onClick={onBookmark}
      >
        <motion.div
          whileTap={{ scale: 1.2 }}
          animate={isBookmarked ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Award 
            className={cn(
              "h-5 w-5 transition-colors", 
              isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-500"
            )} 
          />
        </motion.div>
        <span className={isBookmarked ? "text-blue-500" : "text-gray-600"}>
          {bookmarkCount > 0 ? bookmarkCount : "Save"}
        </span>
      </button>
      
      <button 
        className="flex items-center gap-1 text-sm text-gray-600"
        onClick={onShare}
      >
        <motion.div whileTap={{ scale: 1.2 }}>
          <Flag className="h-5 w-5 text-gray-500" />
        </motion.div>
        <span>{shareCount > 0 ? shareCount : "Report"}</span>
      </button>
    </div>
  );
}