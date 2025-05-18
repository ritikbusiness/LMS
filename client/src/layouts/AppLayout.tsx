import { ReactNode, useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "../components/Sidebar";
import MobileNavigation from "../components/MobileNavigation";
import { useAuth } from "../hooks/useAuth";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, isLoading, logout } = useAuth();

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800">
      {/* Sidebar - Hidden on mobile */}
      <Sidebar user={user} />

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 fixed top-0 inset-x-0 z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-primary-500">Kayago LMS</h1>
          <button 
            type="button" 
            className="text-gray-500 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
          </button>
        </div>
        
        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="bg-white border-b border-gray-200 py-2">
            <a href="/" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <i className="ri-dashboard-line mr-3 text-lg"></i>
              <span>Dashboard</span>
            </a>
            <a href="/courses" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <i className="ri-book-open-line mr-3 text-lg"></i>
              <span>My Courses</span>
            </a>
            <a href="/explore" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <i className="ri-compass-3-line mr-3 text-lg"></i>
              <span>Explore</span>
            </a>
            <a href="/forum" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <i className="ri-discuss-line mr-3 text-lg"></i>
              <span>Forum</span>
            </a>
            <a href="/certificates" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <i className="ri-file-certificate-line mr-3 text-lg"></i>
              <span>Certificates</span>
            </a>
            <a href="/leaderboard" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <i className="ri-bar-chart-box-line mr-3 text-lg"></i>
              <span>Leaderboard</span>
            </a>
            
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => logout()}
              >
                <i className="ri-logout-box-line mr-3 text-lg"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-6 md:pt-0">
        <div className="px-4 sm:px-6 lg:px-8 mb-20 md:mb-10 mt-14 md:mt-6">
          {children}
        </div>
        
        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </main>
    </div>
  );
};

export default AppLayout;
