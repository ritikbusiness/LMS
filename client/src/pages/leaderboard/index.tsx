import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const Leaderboard = () => {
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState("weekly");
  const [selectedDomain, setSelectedDomain] = useState(user?.domain || "all");

  // Domain options
  const domains = [
    { value: "all", label: "All Domains" },
    { value: "DevOps", label: "DevOps" },
    { value: "MERN", label: "MERN Stack" },
    { value: "AI", label: "AI & ML" },
    { value: "CyberSecurity", label: "Cyber Security" },
  ];

  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard", timeFrame, selectedDomain],
  });

  // Find the user's ranking
  const userRanking = leaderboard?.userRanking;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>

      <div className="mb-6 max-w-sm">
        <Select value={selectedDomain} onValueChange={setSelectedDomain}>
          <SelectTrigger>
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            {domains.map((domain) => (
              <SelectItem key={domain.value} value={domain.value}>
                {domain.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={timeFrame} onValueChange={setTimeFrame}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="alltime">All Time</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
              <h3 className="font-bold text-lg">Weekly Top Learners</h3>
              <p className="text-sm opacity-90">{selectedDomain === 'all' ? 'All Domains' : selectedDomain}</p>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse space-y-4 p-4">
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : leaderboard?.rankings.length ? (
              <div className="divide-y">
                {leaderboard.rankings.map((entry, idx) => (
                  <div 
                    key={entry.userId} 
                    className={`p-4 flex items-center justify-between ${
                      entry.userId === user?.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 flex items-center justify-center ${
                        idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-gray-300' : idx === 2 ? 'bg-amber-700' : 'bg-gray-200'
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
                
                {/* Show user ranking if not in top list */}
                {userRanking && userRanking.rank > leaderboard.rankings.length && (
                  <>
                    <div className="p-2 bg-gray-100 text-center text-gray-500 text-sm">
                      • • •
                    </div>
                    <div className="p-4 bg-primary-50 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center bg-primary-500 text-white rounded-full font-bold">
                          {userRanking.rank}
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
                        <div className="text-xs text-gray-500">{userRanking.badgesCount} badges earned</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-500">No data available</h3>
                <p className="mt-2 text-gray-400">Start learning to appear on the leaderboard</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="monthly">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-500">Monthly Leaderboard</h3>
            <p className="mt-2 text-gray-400">Shows top performers over the last 30 days</p>
          </div>
        </TabsContent>
        
        <TabsContent value="alltime">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-500">All-Time Leaderboard</h3>
            <p className="mt-2 text-gray-400">Shows top performers since the beginning</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
