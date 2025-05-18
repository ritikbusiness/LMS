import { User } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
  user?: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [location] = useLocation();
  const { logout } = useAuth();

  // Define routes for sidebar navigation
  const navItems = [
    { path: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { path: "/courses", label: "My Courses", icon: "ri-book-open-line" },
    { path: "/explore", label: "Explore", icon: "ri-compass-3-line" },
    { path: "/forum", label: "Forum", icon: "ri-discuss-line" },
    { path: "/certificates", label: "Certificates", icon: "ri-file-certificate-line" },
    { path: "/leaderboard", label: "Leaderboard", icon: "ri-bar-chart-box-line" },
  ];

  // Learning paths 
  const learningPaths = [
    { id: "devops", label: "DevOps", color: "blue" },
    { id: "mern", label: "MERN Stack", color: "green" },
    { id: "ai", label: "AI & ML", color: "purple" },
    { id: "cyber", label: "Cyber Security", color: "red" },
  ];

  if (!user) return null;

  return (
    <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 border-r border-gray-200 bg-white z-10">
      <div className="p-4 flex items-center border-b border-gray-200">
        <Link href="/">
          <a className="text-xl font-bold text-primary-500">Kayago LMS</a>
        </Link>
      </div>
      
      <nav className="flex-1 pt-4 pb-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a 
              className={`flex items-center px-4 py-3 rounded-lg font-medium ${
                location === item.path 
                  ? "text-primary-500 bg-primary-50" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <i className={`${item.icon} mr-3 text-lg`}></i>
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
        
        <div className="pt-4 mt-4 border-t border-gray-200">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Learning Paths
          </h3>
          <div className="mt-2 space-y-1">
            {learningPaths.map((path) => (
              <Link key={path.id} href={`/paths/${path.id}`}>
                <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <span className={`w-2 h-2 rounded-full bg-${path.color}-500 mr-2`}></span>
                  {path.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <img 
            src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName)} 
            alt={user.fullName} 
            className="h-8 w-8 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium">{user.fullName}</p>
            <p className="text-xs text-gray-500">{user.branch}</p>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <i className="ri-logout-box-line mr-2"></i> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
