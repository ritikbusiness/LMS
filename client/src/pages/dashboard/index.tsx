import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { User, Course } from "@shared/schema";
import { useAuth } from "../../hooks/useAuth";
import CourseCard from "../../components/CourseCard";
import LearningPathTimeline from "../../components/LearningPathTimeline";
import ForumThread from "../../components/ForumThread";

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch courses the user is enrolled in
  const { data: enrolledCourses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses/enrolled"],
  });

  // Fetch recommended courses
  const { data: recommendedCourses, isLoading: recommendedLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses/recommended"],
  });

  // Fetch forum threads
  const { data: forumThreads, isLoading: forumLoading } = useQuery({
    queryKey: ["/api/forum/recent"],
  });

  // Fetch learning path for user's domain
  const { data: learningPath, isLoading: pathLoading } = useQuery({
    queryKey: ["/api/learning-paths", user?.domain],
  });

  // Fetch leaderboard data
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["/api/leaderboard/weekly"],
  });

  // Quick stats for the user
  const userStats = user ? {
    courses: enrolledCourses?.length || 0,
    hours: 26.5, // This would come from backend calculation
    xpPoints: user.xpPoints || 0,
    certificates: 2, // This would come from backend calculation
  } : null;

  // For learning path progress - would be calculated on the backend
  const pathProgress = 78;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName.split(' ')[0]}!</h2>
            <p className="opacity-90">Continue your journey in {user?.domain} learning path.</p>
            <div className="mt-4 flex">
              <Link href="/courses">
                <a className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium text-sm shadow-sm hover:bg-gray-100">
                  Resume Learning
                </a>
              </Link>
              <Link href={`/paths/${user?.domain?.toLowerCase()}`}>
                <a className="ml-3 bg-primary-400 bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-opacity-40">
                  View Path
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold">{pathProgress}%</div>
                <div className="text-xs mt-1">Path Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="ri-book-open-line text-xl text-blue-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">Courses</p>
              <p className="font-semibold text-xl">{userStats?.courses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="ri-time-line text-xl text-green-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">Hours</p>
              <p className="font-semibold text-xl">{userStats?.hours}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <i className="ri-medal-line text-xl text-amber-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">XP Points</p>
              <p className="font-semibold text-xl">{userStats?.xpPoints}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <i className="ri-file-certificate-line text-xl text-purple-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">Certificates</p>
              <p className="font-semibold text-xl">{userStats?.certificates}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Continue Learning</h2>
          <Link href="/courses">
            <a className="text-primary-500 text-sm font-medium hover:underline">View All</a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {coursesLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 h-[300px] animate-pulse"></div>
            ))
          ) : enrolledCourses?.length ? (
            enrolledCourses.slice(0, 3).map(course => (
              <CourseCard key={course.id} course={course} variant="progress" />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">You're not enrolled in any courses yet.</p>
              <Link href="/explore">
                <a className="mt-4 inline-block bg-primary-500 text-white px-4 py-2 rounded-lg">
                  Explore Courses
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Learning Path Progress */}
      {user?.domain && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">{user.domain} Learning Path</h2>
            <span className="text-sm font-medium text-primary-500">{pathProgress}% Complete</span>
          </div>
          
          {pathLoading ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-[400px] animate-pulse"></div>
          ) : (
            <LearningPathTimeline path={learningPath} progress={pathProgress} />
          )}
        </div>
      )}

      {/* Forum Activity */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Recent Forum Activity</h2>
          <Link href="/forum">
            <a className="text-primary-500 text-sm font-medium hover:underline">View All</a>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
          {forumLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 animate-pulse h-24"></div>
            ))
          ) : forumThreads?.length ? (
            forumThreads.slice(0, 3).map(thread => (
              <ForumThread key={thread.id} thread={thread} />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No forum activity yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Recommended Courses</h2>
          <Link href="/explore">
            <a className="text-primary-500 text-sm font-medium hover:underline">Explore All</a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recommendedLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 h-[300px] animate-pulse"></div>
            ))
          ) : recommendedCourses?.length ? (
            recommendedCourses.slice(0, 3).map(course => (
              <CourseCard key={course.id} course={course} variant="purchase" />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">No recommendations available yet.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Leaderboard Snippet */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Leaderboard</h2>
          <Link href="/leaderboard">
            <a className="text-primary-500 text-sm font-medium hover:underline">View Full Ranking</a>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
            <h3 className="font-bold text-lg">Weekly Top Learners</h3>
            <p className="text-sm opacity-90">{user?.domain} Track</p>
          </div>
          
          {leaderboardLoading ? (
            <div className="animate-pulse space-y-4 p-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : leaderboard?.rankings ? (
            <div className="divide-y">
              {leaderboard.rankings.slice(0, 3).map((entry, idx) => (
                <div key={entry.userId} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 flex items-center justify-center ${
                      idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-gray-300' : 'bg-amber-700'
                    } text-white rounded-full font-bold`}>
                      {idx + 1}
                    </div>
                    <img 
                      src={entry.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.fullName)}`} 
                      alt={entry.fullName} 
                      className="h-8 w-8 rounded-full ml-3"
                    />
                    <div className="ml-3">
                      <p className="font-medium">{entry.fullName}</p>
                      <p className="text-xs text-gray-500">{entry.branch}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-500">{entry.xpPoints} XP</div>
                    <div className="text-xs text-gray-500">{entry.badgesCount} badges earned</div>
                  </div>
                </div>
              ))}
              
              {/* Current user ranking */}
              {leaderboard.userRanking && (
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary-500 text-white rounded-full font-bold">
                      {leaderboard.userRanking.rank}
                    </div>
                    <img 
                      src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || '')}`} 
                      alt="Your profile" 
                      className="h-8 w-8 rounded-full ml-3"
                    />
                    <div className="ml-3">
                      <p className="font-medium">You</p>
                      <p className="text-xs text-gray-500">{user?.branch}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-500">{user?.xpPoints} XP</div>
                    <div className="text-xs text-gray-500">{leaderboard.userRanking.badgesCount} badges earned</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Leaderboard data not available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
