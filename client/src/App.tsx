import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./hooks/useAuth";

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
import NotFound from "@/pages/not-found";

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
      <Route path="/courses">
        <AppLayout>
          <MyCourses />
        </AppLayout>
      </Route>
      <Route path="/courses/manage">
        <AppLayout>
          <dynamic import from "./pages/courses/manage" />
        </AppLayout>
      </Route>
      <Route path="/courses/:id">
        {(params) => (
          <AppLayout>
            <CourseDetail id={params.id} />
          </AppLayout>
        )}
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

      {/* Fallback to 404 */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
