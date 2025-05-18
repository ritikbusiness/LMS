import { Link, useLocation } from "wouter";

const MobileNavigation = () => {
  const [location] = useLocation();

  // Define routes for mobile navigation
  const navItems = [
    { path: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { path: "/courses", label: "Courses", icon: "ri-book-open-line" },
    { path: "/explore", label: "Explore", icon: "ri-compass-3-line" },
    { path: "/forum", label: "Forum", icon: "ri-discuss-line" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a 
              className={`flex flex-col items-center py-3 ${
                location === item.path 
                  ? "text-primary-500" 
                  : "text-gray-600"
              }`}
            >
              <i className={`${item.icon} text-xl mb-1`}></i>
              <span className="text-xs">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
