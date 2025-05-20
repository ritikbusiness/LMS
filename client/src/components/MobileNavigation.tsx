import { Link, useLocation } from "wouter";
import { Home, BookOpen, Compass, MessageSquare, User } from "lucide-react";

const MobileNavigation = () => {
  const [location] = useLocation();

  // Define routes for mobile navigation
  const navItems = [
    { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { path: "/courses", label: "My Learning", icon: <BookOpen className="h-5 w-5" /> },
    { path: "/explore", label: "Explore", icon: <Compass className="h-5 w-5" /> },
    { path: "/forum", label: "Community", icon: <MessageSquare className="h-5 w-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a 
              className={`flex flex-col items-center py-3 ${
                location === item.path 
                  ? "text-blue-600" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <div className={`p-1 rounded-full ${location === item.path ? 'bg-blue-50' : ''}`}>
                {item.icon}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
