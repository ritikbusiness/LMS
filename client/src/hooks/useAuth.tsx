import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  // Fetch current user data
  const { 
    data: user, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    enabled: isAuthInitialized,
    retry: false,
    // onError is automatically handled by our custom fetcher in queryClient.ts
  });

  // Initialize auth state on app load with persisted authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for persisted login in localStorage
        const persistedUser = localStorage.getItem('persistedUser');
        
        if (persistedUser) {
          // If we have a persisted user, set it immediately to prevent flashing
          try {
            const user = JSON.parse(persistedUser);
            queryClient.setQueryData(["/api/auth/me"], user);
          } catch (e) {
            console.error("Error parsing persisted user:", e);
            localStorage.removeItem('persistedUser');
          }
        }
        
        // Then initialize auth system with a slight delay for better UX
        setTimeout(() => {
          setIsAuthInitialized(true);
        }, 300);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setIsAuthInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: () => apiRequest("GET", "/api/auth/google"),
    onSuccess: () => {
      // Redirect to Google OAuth page
      window.location.href = "/api/auth/google";
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      // Clear persisted user from localStorage
      localStorage.removeItem('persistedUser');
      
      // Clear user from cache
      queryClient.setQueryData(["/api/auth/me"], null);
      
      // Redirect to login page
      window.location.href = "/login";
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error) => {
      // Even if server logout fails, clear local storage
      localStorage.removeItem('persistedUser');
      
      // Attempt to clear cache and redirect
      queryClient.setQueryData(["/api/auth/me"], null);
      window.location.href = "/login";
      
      toast({
        title: "Logout Failed",
        description: error.message || "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Login with Google
  const loginWithGoogle = async () => {
    loginMutation.mutate();
  };

  // Logout
  const logout = async () => {
    logoutMutation.mutate();
  };

  // Refresh user data
  const refreshUser = async () => {
    await refetch();
  };

  // Set user directly (for test login) and persist
  const setUser = (newUser: User) => {
    // Persist user in localStorage to prevent flashing on refresh
    localStorage.setItem('persistedUser', JSON.stringify(newUser));
    
    // Update query cache
    queryClient.setQueryData(["/api/auth/me"], newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: isLoading || loginMutation.isPending || !isAuthInitialized,
        error: error || null,
        loginWithGoogle,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
