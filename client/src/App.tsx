import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./hooks/useAuth";
import { useState, useEffect } from "react";

// Layouts
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import Dashboard from "./pages/dashboard";
import Login from "./pages/auth/Login";
import Onboarding from "./pages/auth/Onboarding";
import MyCourses from "./pages/courses";
import ManageCourses from "./pages/courses/manage";
import CourseDetail from "./pages/courses/[id]";
import Explore from "./pages/explore";
import Forum from "./pages/forum";
import Certificates from "./pages/certificates";
import Leaderboard from "./pages/leaderboard";
import PresentationPage from "./pages/presentation";
import CareerRoadmapPage from "./pages/career-roadmap";
import NotFound from "@/pages/not-found";
import TeachLanding from "./pages/teach";
import AchievementDemo from "./pages/achievement-demo";

// Instructor Course Creation Pages (Udemy-Style)
import CourseCreation from "./pages/instructor/CourseCreation";
import CourseStructure from "./pages/instructor/CourseStructure";
import SetupTestVideo from "./pages/instructor/SetupTestVideo";

function Router() {
  return (
    <Switch>
      {/* Auth Pages */}
      <Route path="/login">
        <AuthLayout>
          <Login />
        </AuthLayout>
      </Route>
      <Route path="/onboarding">
        <AuthLayout>
          <Onboarding />
        </AuthLayout>
      </Route>

      {/* App Pages */}
      <Route path="/">
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </Route>
      <Route path="/courses/manage">
        <AppLayout>
          <ManageCourses />
        </AppLayout>
      </Route>
      <Route path="/courses/:id">
        {(params) => (
          <AppLayout>
            <CourseDetail id={params.id} />
          </AppLayout>
        )}
      </Route>
      <Route path="/courses">
        <AppLayout>
          <MyCourses />
        </AppLayout>
      </Route>
      <Route path="/explore">
        <AppLayout>
          <Explore />
        </AppLayout>
      </Route>
      <Route path="/forum">
        <AppLayout>
          <Forum />
        </AppLayout>
      </Route>
      <Route path="/certificates">
        <AppLayout>
          <Certificates />
        </AppLayout>
      </Route>
      <Route path="/leaderboard">
        <AppLayout>
          <Leaderboard />
        </AppLayout>
      </Route>
      <Route path="/presentation">
        <AppLayout>
          <PresentationPage />
        </AppLayout>
      </Route>
      <Route path="/career-roadmap">
        <AppLayout>
          <CareerRoadmapPage />
        </AppLayout>
      </Route>
      
      {/* Achievement Demo */}
      <Route path="/achievement-demo">
        <AppLayout>
          <AchievementDemo />
        </AppLayout>
      </Route>
      
      {/* Teach Pages */}
      <Route path="/teach">
        <AppLayout hideNav={true}>
          <TeachLanding />
        </AppLayout>
      </Route>

      {/* Instructor Course Creation Flow (Udemy-Style) */}
      <Route path="/instructor/create-course">
        <CourseCreation />
      </Route>
      <Route path="/instructor/course-structure">
        <AppLayout>
          <CourseStructure />
        </AppLayout>
      </Route>
      <Route path="/instructor/setup-test-video">
        <AppLayout>
          <SetupTestVideo />
        </AppLayout>
      </Route>

      {/* Fallback to 404 */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  // Add hydration control for the entire application
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Add a short delay to ensure styles are fully loaded before showing content
    const timer = setTimeout(() => {
      setIsMounted(true);
      
      // Hide the loader once app is mounted
      const loader = document.getElementById('app-loader');
      if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 300);
      }
      
      // Fix for stylesheet purging issues - force classes to be retained
      const styleFixElement = document.createElement('div');
      styleFixElement.style.display = 'none';
      styleFixElement.className = 
        'text-primary bg-primary text-secondary bg-secondary ' +
        'text-accent bg-accent border-primary border-secondary border-accent ' +
        'shadow-sm shadow shadow-md shadow-lg rounded rounded-md rounded-lg ' +
        'p-1 p-2 p-3 p-4 m-1 m-2 m-3 m-4 text-xs text-sm text-base text-lg text-xl';
      document.body.appendChild(styleFixElement);
      
      // Force a repaint to fix any remaining style issues
      document.body.style.display = 'none';
      document.body.offsetHeight; // This line forces a repaint
      document.body.style.display = '';
      
    }, 200); // Small delay for styles to stabilize
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            {/* Render content only after hydration is complete */}
            {isMounted ? (
              <Router />
            ) : (
              <div className="min-h-screen flex items-center justify-center bg-background" style={{opacity: 1}}>
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-foreground font-medium">Loading Desired Career Academy...</p>
                </div>
              </div>
            )}
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
