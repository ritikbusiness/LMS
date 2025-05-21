import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  children?: React.ReactNode;
}

const colorClasses = {
  primary: 'text-blue-500 stroke-blue-500',
  secondary: 'text-purple-500 stroke-purple-500',
  success: 'text-green-500 stroke-green-500',
  warning: 'text-amber-500 stroke-amber-500',
  danger: 'text-red-500 stroke-red-500',
};

export function ProgressRing({
  progress,
  size = 64,
  strokeWidth = 4,
  className,
  color = 'primary',
  showPercentage = true,
  children,
}: ProgressRingProps) {
  // Ensure progress is between 0-100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Calculate circle parameters
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedProgress / 100) * circumference;
  
  // Calculate center position
  const center = size / 2;
  
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={colorClasses[color]}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      
      {/* Content in the center of the ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children ? (
          children
        ) : (
          showPercentage && (
            <span className={`text-sm font-medium ${colorClasses[color]}`}>
              {Math.round(normalizedProgress)}%
            </span>
          )
        )}
      </div>
    </div>
  );
}

// Module progress bar that shows multiple segments
interface CourseProgressBarProps {
  segments: {
    completed: boolean;
    current?: boolean;
  }[];
  className?: string;
}

export function CourseProgressBar({ segments, className }: CourseProgressBarProps) {
  return (
    <div className={cn("flex w-full gap-1", className)}>
      {segments.map((segment, i) => (
        <div 
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-all duration-300",
            segment.completed ? "bg-green-500" : 
              segment.current ? "bg-blue-500" : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
}

// Course module progress visualization with combined segments and text
interface ModuleProgressProps {
  title: string;
  completedLessons: number;
  totalLessons: number;
  isCurrentModule?: boolean;
  onClick?: () => void;
}

export function ModuleProgress({ 
  title, 
  completedLessons, 
  totalLessons,
  isCurrentModule,
  onClick
}: ModuleProgressProps) {
  const progress = Math.round((completedLessons / totalLessons) * 100);
  
  // Create segments for each lesson
  const segments = Array(totalLessons).fill(0).map((_, i) => ({
    completed: i < completedLessons,
    current: i === completedLessons && isCurrentModule
  }));
  
  return (
    <div 
      className={cn(
        "p-3 rounded-lg transition-all", 
        isCurrentModule ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className={cn(
          "font-medium text-sm",
          isCurrentModule ? "text-blue-700" : "text-gray-700"
        )}>
          {title}
        </h4>
        <span className="text-xs font-medium text-gray-500">
          {completedLessons}/{totalLessons} lessons
        </span>
      </div>
      
      <CourseProgressBar segments={segments} />
    </div>
  );
}