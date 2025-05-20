import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../../hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

const Login = () => {
  const { loginWithGoogle, isLoading, setUser } = useAuth();
  const { toast } = useToast();
  const [isTestLoginLoading, setIsTestLoginLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error(error);
      toast({
        title: "Login Failed",
        description: "Please make sure you're using your college email address.",
        variant: "destructive",
      });
    }
  };
  
  // Test login functionality for development
  const handleTestLogin = async (role: 'student' | 'instructor' | 'premium') => {
    try {
      setIsTestLoginLoading(true);
      
      // Clear any existing user data first to prevent state conflicts
      localStorage.removeItem('persistedUser');
      
      const response = await apiRequest('POST', '/api/auth/test-login', { role });
      const data = await response.json();
      
      if (data.user) {
        // First store user in localStorage to ensure persistence
        localStorage.setItem('persistedUser', JSON.stringify(data.user));
        
        // Then update auth context with user
        setUser(data.user);
        
        // Custom message for premium
        let description = '';
        if (role === 'premium') {
          description = 'Logged in with Premium Access - All Courses Unlocked';
        } else {
          description = `Logged in as Test ${role.charAt(0).toUpperCase() + role.slice(1)}`;
        }
        
        // Show success message
        toast({
          title: "Login Successful",
          description: description,
        });
        
        // Use a small delay before redirecting to ensure state is properly saved
        setTimeout(() => {
          // Use navigate instead of direct location change to maintain React context
          window.location.href = "/";
        }, 100);
      }
    } catch (error) {
      console.error("Test login error:", error);
      toast({
        title: "Login Failed",
        description: "Could not log in with test account",
        variant: "destructive",
      });
    } finally {
      setIsTestLoginLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Desired Career Academy</h2>
          <p className="mt-2 text-gray-600">Sign in to access our world-class learning platform</p>
        </div>
        
        <Button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          variant="outline" 
          className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 mb-4"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-5 h-5 mr-3"
          />
          Continue with Google
          {isLoading && (
            <div className="ml-2 animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
          )}
        </Button>
        
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Test Accounts (Development Only)</span>
          </div>
        </div>
        
        <Button 
          onClick={() => handleTestLogin('premium')}
          disabled={isTestLoginLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium py-3 mb-4 hover:from-blue-700 hover:to-blue-900"
        >
          Premium Access - Explore All Courses
          {isTestLoginLoading && (
            <div className="ml-2 animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
          )}
        </Button>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Button 
            onClick={() => handleTestLogin('student')}
            disabled={isTestLoginLoading}
            variant="secondary"
            className="flex items-center justify-center"
          >
            Login as Student
            {isTestLoginLoading && (
              <div className="ml-2 animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            )}
          </Button>
          
          <Button 
            onClick={() => handleTestLogin('instructor')}
            disabled={isTestLoginLoading}
            variant="secondary"
            className="flex items-center justify-center"
          >
            Login as Instructor
            {isTestLoginLoading && (
              <div className="ml-2 animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            )}
          </Button>
        </div>
        
        <div className="text-sm text-center text-gray-500 mt-6">
          Only emails from verified educational institutions (@college.edu) are accepted.
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            By continuing, you agree to our
            <a href="#" className="text-primary-500 hover:underline ml-1">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Login;
