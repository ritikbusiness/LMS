import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, X, Trophy, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './button';

export interface AchievementPopupProps {
  title: string;
  description: string;
  type: 'completion' | 'milestone' | 'badge' | 'certificate' | 'xp';
  points?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementPopup({
  title,
  description,
  type,
  points,
  isOpen,
  onClose
}: AchievementPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Launch confetti effect safely with requestAnimationFrame
  const safeConfetti = (options: any) => {
    try {
      confetti(options);
    } catch (error) {
      console.warn("Confetti animation error:", error);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti effect when popup opens
      setShowConfetti(true);
      
      // Confetti animation duration
      const duration = 2000;
      const end = Date.now() + duration;
      
      // Create confetti burst with animation loop
      let frameId: number;
      
      const launchConfetti = () => {
        safeConfetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFC107', '#2196F3', '#4CAF50', '#FF5722', '#9C27B0'],
          disableForReducedMotion: true
        });
        
        // Continue animation until duration ends
        if (Date.now() < end) {
          frameId = requestAnimationFrame(launchConfetti);
        }
      };
      
      // Delayed start to ensure popup is visible
      setTimeout(() => {
        launchConfetti();
      }, 100);
      
      // Clean up confetti and animation frame
      const timer = setTimeout(() => {
        setShowConfetti(false);
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
        // Reset confetti
        try {
          confetti.reset();
        } catch (e) {
          // Silent catch for older browsers
        }
      }, duration + 200);
      
      return () => {
        clearTimeout(timer);
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
        // Reset confetti
        try {
          confetti.reset();
        } catch (e) {
          // Silent catch for older browsers
        }
      };
    }
  }, [isOpen]);
  
  // Define icon based on achievement type
  const getAchievementIcon = () => {
    switch (type) {
      case 'completion':
        return <Trophy className="h-12 w-12 text-yellow-500" />;
      case 'milestone':
        return <Star className="h-12 w-12 text-blue-500" />;
      case 'badge':
        return <Medal className="h-12 w-12 text-purple-500" />;
      case 'certificate':
        return <Award className="h-12 w-12 text-green-500" />;
      case 'xp':
        return (
          <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
            XP
          </div>
        );
      default:
        return <Award className="h-12 w-12 text-blue-500" />;
    }
  };
  
  // Define animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const popupVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.3 
      }
    }
  };
  
  const iconVariants = {
    initial: { scale: 0.5, rotate: -20, opacity: 0 },
    animate: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: { 
        delay: 0.3,
        duration: 0.5,
        type: "spring", 
        stiffness: 300
      }
    }
  };
  
  const pointsVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.5,
        duration: 0.5
      }
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header with close button */}
            <div className="relative p-1">
              <Button 
                onClick={onClose} 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2 z-10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Main content */}
            <div className="p-6 pt-0 flex flex-col items-center text-center">
              <div className="mb-2 text-sm uppercase tracking-wider text-blue-600 font-semibold">
                Achievement Unlocked!
              </div>
              
              {/* Icon with animation */}
              <motion.div 
                className="rounded-full p-4 mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100"
                variants={iconVariants}
                initial="initial"
                animate="animate"
              >
                {getAchievementIcon()}
              </motion.div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
              <p className="text-gray-600 mb-4">{description}</p>
              
              {/* Points display if applicable */}
              {points && (
                <motion.div 
                  className="bg-blue-50 py-2 px-6 rounded-full text-blue-800 font-bold mb-4"
                  variants={pointsVariants}
                  initial="initial"
                  animate="animate"
                >
                  +{points} XP
                </motion.div>
              )}
              
              <Button onClick={onClose} className="mt-2 w-full">
                Continue Learning
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}