import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, LineChart, PieChart, DonutChart,
  AreaChart 
} from '@/components/ui/charts';
import { 
  Users, Award, BookOpen, Clock, Calendar, BarChart2, 
  TrendingUp, ArrowUp, ArrowDown, ArrowRight, Download 
} from 'lucide-react';

interface AnalyticsDashboardProps {
  data: {
    overview: {
      totalStudents: number;
      activeStudents: number;
      completionRate: number;
      avgEngagement: number;
      totalCourses: number;
      newEnrollments: number;
      enrollmentTrend: number; // percentage change
    };
    coursePerformance: {
      id: number;
      title: string;
      enrollments: number;
      completionRate: number;
      avgRating: number;
      trend: number; // percentage change
    }[];
    timeline: {
      label: string;
      enrollments: number;
      completions: number;
    }[];
    domainDistribution: {
      domain: string;
      count: number;
      percentage: number;
    }[];
    studentEngagement: {
      time: string;
      count: number;
    }[];
  };
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onTimeframeChange?: (timeframe: string) => void;
  onExport?: () => void;
}

export function AnalyticsDashboard({
  data,
  timeframe = 'monthly',
  onTimeframeChange,
  onExport
}: AnalyticsDashboardProps) {
  // Function to render trend indicators
  const renderTrend = (value: number) => {
    if (value === 0) return null;
    
    const Icon = value > 0 ? ArrowUp : value < 0 ? ArrowDown : ArrowRight;
    const color = value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
    
    return (
      <div className={`flex items-center ${color}`}>
        <Icon className="h-4 w-4 mr-1" />
        <span className="text-sm font-medium">{Math.abs(value)}%</span>
      </div>
    );
  };
  
  // Transform data for charts
  const timelineData = {
    labels: data.timeline.map(item => item.label),
    datasets: [
      {
        label: 'Enrollments',
        data: data.timeline.map(item => item.enrollments),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
      {
        label: 'Completions',
        data: data.timeline.map(item => item.completions),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      }
    ]
  };
  
  const domainData = {
    labels: data.domainDistribution.map(item => item.domain),
    datasets: [
      {
        data: data.domainDistribution.map(item => item.count),
        backgroundColor: [
          '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', 
          '#10b981', '#f59e0b', '#6366f1', '#ef4444'
        ],
      }
    ]
  };
  
  const engagementData = {
    labels: data.studentEngagement.map(item => item.time),
    datasets: [
      {
        label: 'Student Activity',
        data: data.studentEngagement.map(item => item.count),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        fill: true,
      }
    ]
  };
  
  const coursePerformanceData = {
    labels: data.coursePerformance.map(course => course.title),
    datasets: [
      {
        label: 'Enrollments',
        data: data.coursePerformance.map(course => course.enrollments),
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Completion Rate (%)',
        data: data.coursePerformance.map(course => course.completionRate),
        backgroundColor: '#10b981',
      }
    ]
  };
  
  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Analytics Dashboard</h1>
          <p className="text-gray-500">Comprehensive insights into your educational platform</p>
        </div>
        
        <div className="flex gap-2">
          <div className="bg-white border rounded-md overflow-hidden">
            <select 
              className="py-2 px-4 pr-8 outline-none"
              value={timeframe}
              onChange={(e) => onTimeframeChange?.(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <h3 className="text-2xl font-bold">{data.overview.totalStudents.toLocaleString()}</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              {renderTrend(data.overview.enrollmentTrend)}
              <span className="text-xs text-gray-500 ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <h3 className="text-2xl font-bold">{data.overview.completionRate}%</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <Award className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: `${data.overview.completionRate}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <h3 className="text-2xl font-bold">{data.overview.totalCourses}</h3>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {data.overview.activeStudents} active students
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Engagement</p>
                <h3 className="text-2xl font-bold">{data.overview.avgEngagement} min</h3>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Time spent per session
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Enrollment & Completion Trends</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  This Period
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Previous
                </Button>
              </div>
            </div>
            <CardDescription>
              Track enrollments and course completions over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <LineChart 
              data={timelineData} 
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>
              Compare enrollments and completion rates across courses
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <BarChart 
              data={coursePerformanceData}
              height={300}
              options={{
                indexAxis: 'y',
                plugins: {
                  legend: {
                    position: 'bottom',
                  }
                }
              }}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Domain Distribution</CardTitle>
            <CardDescription>
              Students enrolled by subject domain
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-center">
              <div className="w-64">
                <DonutChart 
                  data={domainData}
                  height={270}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    }
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Analysis Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="engagement">
            <TabsList className="mb-4">
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="engagement" className="pt-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Student Activity by Time of Day</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Tracking when students are most active on the platform
                  </p>
                  <AreaChart 
                    data={engagementData}
                    height={250}
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold mb-6">Key Engagement Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Video Completion Rate</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Quiz Participation Rate</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Assignment Submission Rate</span>
                        <span className="text-sm font-medium">82%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Forum Participation Rate</span>
                        <span className="text-sm font-medium">42%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="courses">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Enrollments</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Completion Rate</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Avg. Rating</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.coursePerformance.map((course) => (
                      <tr key={course.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{course.title}</td>
                        <td className="py-3 px-4 text-center">{course.enrollments}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden mr-2">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  course.completionRate >= 75 ? "bg-green-500" :
                                  course.completionRate >= 50 ? "bg-amber-500" :
                                  "bg-red-500"
                                )}
                                style={{ width: `${course.completionRate}%` }}
                              ></div>
                            </div>
                            <span>{course.completionRate}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{course.avgRating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center">{renderTrend(course.trend)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="students">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Student Demographics</h3>
                  <PieChart 
                    data={{
                      labels: ['18-24', '25-34', '35-44', '45+'],
                      datasets: [{
                        data: [35, 42, 18, 5],
                        backgroundColor: ['#3b82f6', '#8b5cf6', '#f97316', '#10b981'],
                      }]
                    }}
                    height={250}
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Retention Rate</h3>
                  <BarChart 
                    data={{
                      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                      datasets: [{
                        label: 'Active Students',
                        data: [100, 82, 74, 68, 62, 58],
                        backgroundColor: '#3b82f6',
                      }]
                    }}
                    height={250}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="assessments">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Assessment Performance</h3>
                  <BarChart 
                    data={{
                      labels: ['0-50%', '51-60%', '61-70%', '71-80%', '81-90%', '91-100%'],
                      datasets: [{
                        label: 'Students',
                        data: [5, 15, 25, 30, 18, 7],
                        backgroundColor: '#8b5cf6',
                      }]
                    }}
                    height={250}
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold mb-6">Assessment Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Average Quiz Score</span>
                        <span className="text-sm font-medium">76%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Assignment Completion Rate</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Project Submission Rate</span>
                        <span className="text-sm font-medium">54%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '54%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Certification Rate</span>
                        <span className="text-sm font-medium">42%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}