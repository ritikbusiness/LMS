import React from 'react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Book, Clock, Award, Play, Star, Users } from 'lucide-react';
import { FeatureTooltip } from '@/components/ui/contextual-help';

// Domain color mapping for visual distinction
const domainColors = {
  'Software_Development': 'bg-blue-500 text-white',
  'Data_Analytics': 'bg-purple-500 text-white',
  'Cloud_DevOps': 'bg-indigo-500 text-white',
  'Networking_Security': 'bg-red-500 text-white',
  'AI_ML': 'bg-green-500 text-white',
  'Database_Management': 'bg-orange-500 text-white',
  'Web_Development': 'bg-cyan-500 text-white',
  'IT_Support': 'bg-gray-500 text-white',
  'Software_Testing': 'bg-pink-500 text-white',
  'Hardware_Embedded': 'bg-amber-500 text-white',
  'Blockchain': 'bg-violet-500 text-white',
  'Research_Development': 'bg-lime-500 text-white',
  'Project_Management': 'bg-teal-500 text-white',
  'Sales_Marketing': 'bg-rose-500 text-white',
  'Education_Training': 'bg-emerald-500 text-white',
  'All_Domains': 'bg-slate-700 text-white',
};

// Level badges styling
const levelStyles = {
  'beginner': 'bg-green-100 text-green-800 border-green-200',
  'intermediate': 'bg-blue-100 text-blue-800 border-blue-200',
  'advanced': 'bg-purple-100 text-purple-800 border-purple-200',
  'expert': 'bg-red-100 text-red-800 border-red-200',
};

interface CourseCardProps {
  course: {
    id: number | string;
    title: string;
    domain: string;
    subDomain?: string;
    description?: string;
    instructorName?: string;
    thumbnailUrl?: string;
    duration?: number;
    progress?: number;
    rating?: number;
    studentsCount?: number;
    difficultyLevel?: string;
    isNew?: boolean;
    isPopular?: boolean;
    isTrending?: boolean;
    isFeatured?: boolean;
    isFree?: boolean;
    price?: number;
    salePrice?: number;
  };
  variant?: 'default' | 'compact' | 'horizontal' | 'featured';
  className?: string;
  isEnrolled?: boolean;
}

export function CourseCard({
  course,
  variant = 'default',
  className = '',
  isEnrolled = false,
}: CourseCardProps) {
  // Format the duration nicely (e.g., "2h 30m")
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Self-paced';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Calculate star rating display
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Get domain color class
  const getDomainColorClass = (domain: string) => {
    return domainColors[domain as keyof typeof domainColors] || 'bg-gray-500 text-white';
  };

  // Format price display
  const renderPrice = () => {
    if (course.isFree) return <span className="text-green-600 font-medium">Free</span>;
    if (course.salePrice) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-500 line-through text-sm">${course.price}</span>
          <span className="text-green-600 font-medium">${course.salePrice}</span>
        </div>
      );
    }
    return <span className="font-medium">${course.price || 0}</span>;
  };

  // Handle horizontal card layout
  if (variant === 'horizontal') {
    return (
      <Card className={cn("flex overflow-hidden", className)}>
        <div className="relative w-1/3 min-w-[180px]">
          <img
            src={course.thumbnailUrl || `https://placehold.co/600x400?text=${encodeURIComponent(course.title)}`}
            alt={course.title}
            className="object-cover w-full h-full"
          />
          {course.isNew && (
            <Badge className="absolute top-2 left-2 bg-blue-500">New</Badge>
          )}
          {course.isTrending && (
            <Badge className="absolute top-2 left-2 bg-orange-500">Trending</Badge>
          )}
        </div>
        
        <div className="flex flex-col flex-1 p-4">
          <div className="mb-2 flex justify-between">
            <Badge className={cn("font-normal", getDomainColorClass(course.domain))}>
              {course.domain.replace(/_/g, ' ')}
            </Badge>
            {course.difficultyLevel && (
              <Badge variant="outline" className={cn("font-normal", levelStyles[course.difficultyLevel as keyof typeof levelStyles] || '')}>
                {course.difficultyLevel}
              </Badge>
            )}
          </div>
          
          <h3 className="text-lg font-semibold mb-1 line-clamp-1">{course.title}</h3>
          
          {course.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
          )}
          
          <div className="flex items-center text-sm text-gray-500 mt-auto gap-4">
            {course.duration && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatDuration(course.duration)}</span>
              </div>
            )}
            
            {course.studentsCount && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{course.studentsCount.toLocaleString()}</span>
              </div>
            )}
            
            {renderStars(course.rating)}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            {isEnrolled ? (
              <Button asChild>
                <Link href={`/courses/${course.id}`}>
                  <Play className="mr-1 h-4 w-4" /> Continue
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href={`/courses/${course.id}`}>View Course</Link>
              </Button>
            )}
            
            {!isEnrolled && renderPrice()}
          </div>
        </div>
      </Card>
    );
  }

  // Featured card with large image and accent color
  if (variant === 'featured') {
    return (
      <Card className={cn("overflow-hidden group relative", className)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 z-10" />
        
        <img
          src={course.thumbnailUrl || `https://placehold.co/600x400?text=${encodeURIComponent(course.title)}`}
          alt={course.title}
          className="object-cover w-full h-56 group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <Badge className={cn("font-normal", getDomainColorClass(course.domain))}>
            {course.domain.replace(/_/g, ' ')}
          </Badge>
          
          {course.isNew && (
            <Badge className="font-normal bg-blue-500">New</Badge>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
          <h3 className="text-xl font-bold mb-2">{course.title}</h3>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {course.duration && (
                <div className="flex items-center text-white/80">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
              )}
              
              {renderStars(course.rating)}
            </div>
            
            <Button 
              size="sm" 
              className="bg-white text-blue-700 hover:bg-blue-50"
              asChild
            >
              <Link href={`/courses/${course.id}`}>
                {isEnrolled ? "Continue" : "Explore"}
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Compact card with minimal info
  if (variant === 'compact') {
    return (
      <Card className={cn("overflow-hidden group", className)}>
        <div className="relative h-32 bg-gray-100">
          <img
            src={course.thumbnailUrl || `https://placehold.co/600x400?text=${encodeURIComponent(course.title)}`}
            alt={course.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className={cn("absolute top-2 left-2 font-normal", getDomainColorClass(course.domain))}>
            {course.domain.replace(/_/g, ' ')}
          </Badge>
        </div>
        
        <CardContent className="p-3">
          <h3 className="font-medium line-clamp-2 min-h-[40px]">{course.title}</h3>
          
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
            {course.duration && (
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{formatDuration(course.duration)}</span>
              </div>
            )}
            
            {course.rating && (
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 mr-1 text-yellow-400 fill-yellow-400" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-3 pt-0">
          <Button 
            variant="ghost" 
            className="w-full justify-start p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
            asChild
          >
            <Link href={`/courses/${course.id}`}>
              View details
              <span className="ml-1 group-hover:ml-2 transition-all">→</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Default card variant
  return (
    <FeatureTooltip
      title="Intuitive Course Card"
      content="Our redesigned course cards show you the most important information at a glance with clear visual hierarchy."
      showIcon={false}
    >
      <Card className={cn("overflow-hidden group hover:shadow-md transition-shadow", className)}>
        <div className="relative">
          <img
            src={course.thumbnailUrl || `https://placehold.co/600x340?text=${encodeURIComponent(course.title)}`}
            alt={course.title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Course progress indicator for enrolled courses */}
          {isEnrolled && course.progress !== undefined && (
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
              <ProgressRing 
                progress={course.progress}
                size={42}
                strokeWidth={4}
                className="bg-white rounded-full border-2 border-white shadow-sm"
              />
            </div>
          )}
          
          {/* Badges for category and status */}
          <div className="absolute top-2 left-2">
            <Badge className={cn("font-normal", getDomainColorClass(course.domain))}>
              {course.domain.replace(/_/g, ' ')}
            </Badge>
          </div>
          
          <div className="absolute top-2 right-2 flex gap-1">
            {course.isNew && (
              <Badge className="bg-blue-500">New</Badge>
            )}
            {course.isFeatured && (
              <Badge className="bg-purple-500">Featured</Badge>
            )}
            {course.isFree && (
              <Badge className="bg-green-500">Free</Badge>
            )}
          </div>
        </div>
        
        <CardContent className={cn("p-4", isEnrolled && course.progress !== undefined && "pt-6")}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-2 min-h-[56px]">{course.title}</h3>
          
          {course.instructorName && (
            <p className="text-sm text-gray-600 mb-2">{course.instructorName}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            {course.duration && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatDuration(course.duration)}</span>
              </div>
            )}
            
            {course.difficultyLevel && (
              <Badge variant="outline" className={cn("font-normal", levelStyles[course.difficultyLevel as keyof typeof levelStyles] || '')}>
                {course.difficultyLevel}
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            {renderStars(course.rating)}
            
            {!isEnrolled && renderPrice()}
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-3 pt-0 border-t bg-gray-50">
          <Button 
            className={cn("w-full", isEnrolled ? "bg-blue-600 hover:bg-blue-700" : "")}
            variant={isEnrolled ? "default" : "outline"}
            asChild
          >
            <Link href={`/courses/${course.id}`}>
              {isEnrolled ? (
                <>
                  <Play className="mr-2 h-4 w-4" /> Continue Learning
                </>
              ) : (
                "View Course"
              )}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </FeatureTooltip>
  );
}