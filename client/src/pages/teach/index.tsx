import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { DollarSign, Users, Star, Award, ArrowRight, CheckCircle } from 'lucide-react';

export default function TeachLanding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    if (user) {
      setLocation('/instructor/create-course');
    } else {
      setLocation('/login?redirect=/instructor/create-course');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Come teach with us
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Become an instructor and change lives — including your own. Start creating courses and help students achieve their career goals.
            </p>
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
              onClick={handleGetStarted}
            >
              Get started
            </Button>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://s.udemycdn.com/teaching/billboard-desktop-v4.jpg" 
              alt="Smiling instructor" 
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">So many reasons to start</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <img src="https://s.udemycdn.com/teaching/value-prop-teach-v3.jpg" alt="Teach your way" className="rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Teach your way</h3>
              <p className="text-gray-600">
                Publish the course you want, in the way you want, and always have control of your own content.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <img src="https://s.udemycdn.com/teaching/value-prop-inspire-v3.jpg" alt="Inspire learners" className="rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Inspire learners</h3>
              <p className="text-gray-600">
                Teach what you know and help learners explore their interests, gain new skills, and advance their careers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <img src="https://s.udemycdn.com/teaching/value-prop-get-rewarded-v3.jpg" alt="Get rewarded" className="rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get rewarded</h3>
              <p className="text-gray-600">
                Expand your professional network, build your expertise, and earn significant income through our educational platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Begin Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to begin</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Plan your curriculum</h3>
              <p className="text-gray-600">
                You start with your passion and knowledge. Then choose a promising topic with our Marketplace Insights tool.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Record your video</h3>
              <p className="text-gray-600">
                Use basic tools like a smartphone or a DSLR camera. Add a good microphone and you're ready to share your knowledge.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Launch your course</h3>
              <p className="text-gray-600">
                Gather your first ratings and reviews by promoting your course through our platform and your network.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
              onClick={() => window.open('/teaching-center', '_blank')}
            >
              Learn more about teaching
            </Button>
          </div>
        </div>
      </section>

      {/* Become an Instructor CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to share your knowledge?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Create an immersive learning experience and empower students worldwide with skills that will transform their careers.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg"
            onClick={handleGetStarted}
          >
            Start teaching today
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center">Instructor benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="flex">
              <div className="mr-4 text-purple-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Earn significant income</h3>
                <p className="text-gray-600">
                  Share your expertise and earn substantial revenue when students enroll in your courses.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 text-purple-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Inspire students globally</h3>
                <p className="text-gray-600">
                  Reach millions of students and help them achieve their goals through your valuable insights.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 text-purple-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get comprehensive support</h3>
                <p className="text-gray-600">
                  Access tools, resources, and a dedicated team to help you create exceptional courses.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 text-purple-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Join a thriving community</h3>
                <p className="text-gray-600">
                  Connect with fellow instructors for collaboration, support, and shared learning experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Become an instructor today</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of instructors who are building their reputation, advancing their careers, and helping students learn new skills.
          </p>
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
            onClick={handleGetStarted}
          >
            Get started now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}