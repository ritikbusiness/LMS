import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, Medal, Award, Star, Zap, Target, 
  Brain, BookOpen, BarChart2, Flame, Gift
} from 'lucide-react';

// Badge types with different visual styles
const badgeTypes = {
  achievement: { icon: Trophy, color: 'bg-amber-500' },
  completion: { icon: Medal, color: 'bg-blue-500' },
  milestone: { icon: Award, color: 'bg-purple-500' },
  skill: { icon: Zap, color: 'bg-green-500' },
  excellence: { icon: Star, color: 'bg-red-500' },
  participation: { icon: Target, color: 'bg-cyan-500' },
  knowledge: { icon: Brain, color: 'bg-indigo-500' },
  learning: { icon: BookOpen, color: 'bg-teal-500' },
  analytics: { icon: BarChart2, color: 'bg-pink-500' },
  streak: { icon: Flame, color: 'bg-orange-500' },
  special: { icon: Gift, color: 'bg-violet-500' },
};

type BadgeType = keyof typeof badgeTypes;

interface GamificationBadgeProps {
  title: string;
  description: string;
  type: BadgeType;
  earned?: boolean;
  progress?: number; // 0-100
  variant?: 'default' | 'large' | 'compact';
  className?: string;
  onClick?: () => void;
}

export function GamificationBadge({
  title,
  description,
  type,
  earned = false,
  progress = 0,
  variant = 'default',
  className,
  onClick,
}: GamificationBadgeProps) {
  const BadgeIcon = badgeTypes[type]?.icon || Trophy;
  const badgeColor = badgeTypes[type]?.color || 'bg-gray-500';
  
  // Compact badge variant
  if (variant === 'compact') {
    return (
      <div 
        className={cn(
          "relative inline-flex flex-col items-center justify-center p-2 cursor-pointer transition-transform hover:scale-105",
          className
        )}
        onClick={onClick}
      >
        <div className={cn(
          "relative w-12 h-12 rounded-full flex items-center justify-center mb-1",
          earned ? badgeColor : "bg-gray-200"
        )}>
          <BadgeIcon className={cn(
            "w-6 h-6",
            earned ? "text-white" : "text-gray-400"
          )} />
          
          {!earned && progress > 0 && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke={badgeColor.replace('bg-', 'text-')}
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - progress / 100)}
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        
        <span className="text-xs font-medium text-center truncate max-w-[90px]">{title}</span>
      </div>
    );
  }
  
  // Large badge variant
  if (variant === 'large') {
    return (
      <motion.div 
        className={cn(
          "flex flex-col items-center text-center p-4 rounded-xl",
          earned ? "bg-gradient-to-br from-white to-gray-100" : "bg-gray-50",
          className
        )}
        whileHover={{ y: -5 }}
        onClick={onClick}
      >
        <div className={cn(
          "relative w-20 h-20 rounded-full flex items-center justify-center mb-3",
          earned ? badgeColor : "bg-gray-200"
        )}>
          {earned && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ boxShadow: `0 0 0 0 ${badgeColor.replace('bg-', 'rgba(')}` }}
              animate={{ 
                boxShadow: [
                  `0 0 0 0 ${badgeColor.replace('bg-', 'rgba(')}`,
                  `0 0 20px 5px ${badgeColor.replace('bg-', 'rgba(')}`,
                  `0 0 0 0 ${badgeColor.replace('bg-', 'rgba(')}`,
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
          
          <BadgeIcon className={cn(
            "w-10 h-10",
            earned ? "text-white" : "text-gray-400"
          )} />
          
          {!earned && progress > 0 && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="38"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="4"
              />
              <circle
                cx="40"
                cy="40"
                r="38"
                fill="none"
                stroke={badgeColor.replace('bg-', 'text-')}
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={2 * Math.PI * 38 * (1 - progress / 100)}
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        
        {!earned && (
          <div className="mt-3">
            <Badge variant="outline" className="text-xs">
              {progress}% Completed
            </Badge>
          </div>
        )}
      </motion.div>
    );
  }
  
  // Default badge variant
  return (
    <motion.div 
      className={cn(
        "flex items-center p-3 rounded-lg cursor-pointer",
        earned ? "bg-gradient-to-r from-white to-gray-50 hover:shadow-md" : "bg-gray-50",
        className
      )}
      whileHover={{ x: 4 }}
      onClick={onClick}
    >
      <div className={cn(
        "relative w-12 h-12 rounded-full flex items-center justify-center mr-3",
        earned ? badgeColor : "bg-gray-200"
      )}>
        <BadgeIcon className={cn(
          "w-6 h-6",
          earned ? "text-white" : "text-gray-400"
        )} />
        
        {!earned && progress > 0 && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="4"
            />
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke={badgeColor.replace('bg-', 'text-')}
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 22}
              strokeDashoffset={2 * Math.PI * 22 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      {!earned && progress > 0 && (
        <div className="ml-4">
          <Badge variant="outline">
            {progress}%
          </Badge>
        </div>
      )}
    </motion.div>
  );
}

// Badge grid for displaying collections of badges
interface BadgeGridProps {
  badges: {
    id: string | number;
    title: string;
    description: string;
    type: BadgeType;
    earned: boolean;
    progress?: number;
  }[];
  variant?: 'default' | 'large' | 'compact';
  onBadgeClick?: (id: string | number) => void;
}

export function BadgeGrid({ badges, variant = 'default', onBadgeClick }: BadgeGridProps) {
  return (
    <div className={cn(
      "grid gap-4",
      variant === 'compact' ? "grid-cols-4 sm:grid-cols-6 md:grid-cols-8" :
      variant === 'large' ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" :
      "grid-cols-1 md:grid-cols-2"
    )}>
      {badges.map((badge) => (
        <GamificationBadge
          key={badge.id}
          title={badge.title}
          description={badge.description}
          type={badge.type}
          earned={badge.earned}
          progress={badge.progress}
          variant={variant}
          onClick={() => onBadgeClick?.(badge.id)}
        />
      ))}
    </div>
  );
}

// Leaderboard component
interface LeaderboardProps {
  entries: {
    id: string | number;
    rank: number;
    name: string;
    avatarUrl?: string;
    score: number;
    change?: number; // positive for up, negative for down, 0 for no change
    isCurrentUser?: boolean;
    level?: number;
    badge?: string;
  }[];
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  onUserClick?: (id: string | number) => void;
}

export function Leaderboard({ 
  entries, 
  timeframe = 'weekly',
  onUserClick 
}: LeaderboardProps) {
  // Function to render the rank change indicator
  const renderRankChange = (change: number = 0) => {
    if (change === 0) return null;
    
    return (
      <div className={cn(
        "flex items-center text-xs font-medium",
        change > 0 ? "text-green-600" : "text-red-600"
      )}>
        {change > 0 ? '↑' : '↓'} {Math.abs(change)}
      </div>
    );
  };
  
  // Function to render the medal for top 3 positions
  const renderMedal = (rank: number) => {
    if (rank > 3) return null;
    
    const medals = [
      { color: 'text-amber-400', icon: '🥇' },
      { color: 'text-gray-400', icon: '🥈' },
      { color: 'text-amber-700', icon: '🥉' },
    ];
    
    return (
      <div className={`w-6 h-6 flex items-center justify-center text-lg ${medals[rank-1].color}`}>
        {medals[rank-1].icon}
      </div>
    );
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 text-amber-500 mr-2" />
            Leaderboard
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            {timeframe === 'daily' ? 'Today' :
             timeframe === 'weekly' ? 'This Week' :
             timeframe === 'monthly' ? 'This Month' : 'All Time'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              className={cn(
                "flex items-center p-4 transition-colors",
                entry.isCurrentUser ? "bg-blue-50" : "hover:bg-gray-50",
                onUserClick && "cursor-pointer"
              )}
              whileHover={{ x: 4 }}
              onClick={() => onUserClick?.(entry.id)}
            >
              <div className="flex items-center justify-center w-8">
                {renderMedal(entry.rank) || (
                  <span className="text-sm font-semibold text-gray-600">
                    {entry.rank}
                  </span>
                )}
              </div>
              
              <div className="relative w-10 h-10 rounded-full overflow-hidden mx-3">
                <img 
                  src={entry.avatarUrl || `https://placehold.co/100?text=${entry.name.charAt(0)}`} 
                  alt={entry.name}
                  className="w-full h-full object-cover"
                />
                {entry.level && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {entry.level}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <span className={cn(
                    "font-medium",
                    entry.isCurrentUser && "text-blue-700"
                  )}>
                    {entry.name}
                  </span>
                  
                  {entry.isCurrentUser && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">You</Badge>
                  )}
                  
                  {entry.badge && (
                    <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs">
                      {entry.badge}
                    </Badge>
                  )}
                </div>
                
                {renderRankChange(entry.change)}
              </div>
              
              <div className="text-right">
                <div className="font-semibold">{entry.score}</div>
                <div className="text-xs text-gray-500">XP</div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// XP level progress indicator
interface XPProgressProps {
  currentXP: number;
  levelXP: number;
  nextLevelXP: number;
  level: number;
  className?: string;
}

export function XPProgress({ 
  currentXP, 
  levelXP, 
  nextLevelXP,
  level,
  className 
}: XPProgressProps) {
  // Calculate progress percentage
  const progress = Math.min(100, Math.max(0, 
    ((currentXP - levelXP) / (nextLevelXP - levelXP)) * 100
  ));
  
  return (
    <div className={cn("p-4 rounded-lg bg-blue-50", className)}>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm mr-2">
            {level}
          </div>
          <span className="font-medium">Level {level}</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold text-sm mr-2">
            {level + 1}
          </div>
          <span className="font-medium">Level {level + 1}</span>
        </div>
      </div>
      
      <div className="h-2.5 bg-blue-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-1 text-sm">
        <span>{currentXP - levelXP} XP</span>
        <span>{nextLevelXP - levelXP} XP</span>
      </div>
      
      <div className="mt-2 text-center text-sm text-blue-700">
        {nextLevelXP - currentXP} XP needed for Level {level + 1}
      </div>
    </div>
  );
}