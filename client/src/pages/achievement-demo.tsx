import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AchievementPopup } from '@/components/ui/achievement-popup';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AchievementDemo() {
  const [achievementState, setAchievementState] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'milestone' as 'completion' | 'milestone' | 'badge' | 'certificate' | 'xp',
    points: 0
  });
  
  const showAchievement = (
    title: string, 
    description: string, 
    type: 'completion' | 'milestone' | 'badge' | 'certificate' | 'xp', 
    points: number
  ) => {
    setAchievementState({
      isOpen: true,
      title,
      description,
      type,
      points
    });
  };
  
  const closeAchievement = () => {
    setAchievementState(prev => ({ ...prev, isOpen: false }));
  };
  
  const achievements = [
    {
      title: 'Module Completed!',
      description: 'You\'ve completed the Introduction to React module. Keep up the great work!',
      type: 'completion' as const,
      points: 50
    },
    {
      title: 'Halfway Milestone!',
      description: 'You\'re halfway through the course. You\'re making excellent progress!',
      type: 'milestone' as const,
      points: 100
    },
    {
      title: 'Code Master Badge',
      description: 'You\'ve earned the Code Master badge by completing all coding challenges.',
      type: 'badge' as const,
      points: 150
    },
    {
      title: 'Course Certificate',
      description: 'Congratulations! You\'ve earned a certificate in Advanced Web Development.',
      type: 'certificate' as const,
      points: 500
    },
    {
      title: 'Daily Streak!',
      description: 'You\'ve maintained a 7-day learning streak. Your consistency is paying off!',
      type: 'xp' as const,
      points: 70
    }
  ];
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Achievement Celebration Demo</h1>
      <p className="text-center mb-8 text-gray-600">
        Click on any achievement below to see the celebration popup in action!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{achievement.title}</CardTitle>
              <CardDescription>{achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)} Achievement</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{achievement.description}</p>
            </CardContent>
            <CardFooter className="bg-gray-50 flex justify-between items-center">
              <div className="text-blue-600 font-semibold">+{achievement.points} XP</div>
              <Button onClick={() => showAchievement(
                achievement.title,
                achievement.description,
                achievement.type,
                achievement.points
              )}>
                Trigger Achievement
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <AchievementPopup
        isOpen={achievementState.isOpen}
        onClose={closeAchievement}
        title={achievementState.title}
        description={achievementState.description}
        type={achievementState.type}
        points={achievementState.points}
      />
    </div>
  );
}