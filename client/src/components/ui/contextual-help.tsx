import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContextualHelpProps {
  tips: {
    id: string;
    title: string;
    content: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
  }[];
  onComplete?: () => void;
}

export function ContextualHelp({ tips, onComplete }: ContextualHelpProps) {
  const [seenTips, setSeenTips] = useState<Record<string, boolean>>({});
  const [activeTip, setActiveTip] = useState<string | null>(null);
  
  useEffect(() => {
    // Check local storage for previously seen tips
    const storedSeenTips = localStorage.getItem('seenTips');
    if (storedSeenTips) {
      setSeenTips(JSON.parse(storedSeenTips));
    }
    
    // Show first unseen tip after a delay
    const timer = setTimeout(() => {
      const firstUnseenTip = tips.find(tip => !seenTips[tip.id]);
      if (firstUnseenTip) {
        setActiveTip(firstUnseenTip.id);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [tips]);
  
  const markTipAsSeen = (tipId: string) => {
    const updatedSeenTips = { ...seenTips, [tipId]: true };
    setSeenTips(updatedSeenTips);
    localStorage.setItem('seenTips', JSON.stringify(updatedSeenTips));
    setActiveTip(null);
    
    // Check if all tips have been seen
    const allTipsSeen = tips.every(tip => updatedSeenTips[tip.id]);
    if (allTipsSeen && onComplete) {
      onComplete();
    }
    
    // Find next unseen tip
    const nextUnseenTip = tips.find(tip => !updatedSeenTips[tip.id]);
    if (nextUnseenTip) {
      setTimeout(() => {
        setActiveTip(nextUnseenTip.id);
      }, 3000);
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <TooltipProvider>
        {tips.map((tip) => (
          <Tooltip key={tip.id} open={activeTip === tip.id}>
            <TooltipTrigger asChild>
              <span className="sr-only">{tip.title}</span>
            </TooltipTrigger>
            <TooltipContent 
              side={tip.position || 'right'} 
              className="w-80 p-4 bg-blue-50 border border-blue-100 shadow-lg rounded-lg"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-800">{tip.title}</h3>
                    <p className="text-blue-700 mt-1">{tip.content}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs bg-white hover:bg-blue-50"
                    onClick={() => markTipAsSeen(tip.id)}
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
      
      <Button 
        size="sm" 
        variant="ghost" 
        className="bg-blue-50 hover:bg-blue-100 p-2 h-auto rounded-full"
        onClick={() => {
          const firstTip = tips[0];
          if (firstTip) {
            setActiveTip(firstTip.id);
          }
        }}
      >
        <HelpCircle className="h-5 w-5 text-blue-500" />
      </Button>
    </div>
  );
}

// Helper component for individual tooltips attached to specific elements
export function FeatureTooltip({ 
  children, 
  title, 
  content,
  position = 'top',
  showIcon = true,
  className = ""
}: { 
  children: React.ReactNode; 
  title: string; 
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  showIcon?: boolean;
  className?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative inline-block">
            {children}
            {showIcon && (
              <div className="absolute -top-1 -right-1 bg-blue-100 rounded-full p-0.5">
                <Info className="h-3 w-3 text-blue-500" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side={position} className={`p-3 max-w-xs bg-blue-50 ${className}`}>
          <div className="flex flex-col gap-1">
            <h4 className="font-medium text-blue-800">{title}</h4>
            <p className="text-sm text-blue-700">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}