import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && user && window.location.pathname !== "/onboarding") {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-primary-500">Kayago LMS</h1>
          <p className="mt-2 text-gray-600">Your path to career success</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
