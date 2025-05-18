import { apiRequest } from "./queryClient";

// Courses
export const fetchEnrolledCourses = () => 
  apiRequest("GET", "/api/courses/enrolled").then(res => res.json());

export const fetchRecommendedCourses = () => 
  apiRequest("GET", "/api/courses/recommended").then(res => res.json());

export const fetchAllCourses = () => 
  apiRequest("GET", "/api/courses/all").then(res => res.json());

export const fetchCourseById = (id: string) => 
  apiRequest("GET", `/api/courses/${id}`).then(res => res.json());

export const fetchCourseModules = (courseId: string) => 
  apiRequest("GET", `/api/courses/${courseId}/modules`).then(res => res.json());

export const enrollInCourse = (courseId: string) => 
  apiRequest("POST", `/api/courses/${courseId}/enroll`, {}).then(res => res.json());

export const trackCourseProgress = (courseId: string, data: any) => 
  apiRequest("POST", `/api/courses/${courseId}/progress`, data).then(res => res.json());

// Lessons
export const fetchLessonById = (lessonId: string) => 
  apiRequest("GET", `/api/lessons/${lessonId}`).then(res => res.json());

export const fetchLessonMaterials = (lessonId: string) => 
  apiRequest("GET", `/api/lessons/${lessonId}/materials`).then(res => res.json());

export const trackLessonProgress = (lessonId: string, data: any) => 
  apiRequest("POST", `/api/lessons/${lessonId}/progress`, data).then(res => res.json());

// Assessments
export const fetchCourseAssessments = (courseId: string) => 
  apiRequest("GET", `/api/courses/${courseId}/assessments`).then(res => res.json());

export const submitAssessment = (assessmentId: string, data: any) => 
  apiRequest("POST", `/api/assessments/${assessmentId}/submit`, data).then(res => res.json());

// Forums
export const fetchForumThreads = () => 
  apiRequest("GET", "/api/forum/threads").then(res => res.json());

export const fetchRecentThreads = () => 
  apiRequest("GET", "/api/forum/recent").then(res => res.json());

export const fetchCourseThreads = (courseId: string) => 
  apiRequest("GET", `/api/courses/${courseId}/forum`).then(res => res.json());

export const createForumThread = (data: any) => 
  apiRequest("POST", "/api/forum/threads", data).then(res => res.json());

export const voteOnThread = (threadId: string, direction: 'up' | 'down') => 
  apiRequest("POST", `/api/forum/threads/${threadId}/vote`, { direction }).then(res => res.json());

// Learning Paths
export const fetchLearningPath = (domain: string) => 
  apiRequest("GET", `/api/learning-paths/${domain}`).then(res => res.json());

// Certificates
export const fetchUserCertificates = () => 
  apiRequest("GET", "/api/certificates").then(res => res.json());

export const fetchCertificateById = (certificateId: string) => 
  apiRequest("GET", `/api/certificates/${certificateId}`).then(res => res.json());

// Leaderboard
export const fetchLeaderboard = (timeFrame: string, domain: string) => 
  apiRequest("GET", `/api/leaderboard?timeFrame=${timeFrame}&domain=${domain}`).then(res => res.json());

// User profile & onboarding
export const updateUserProfile = (data: any) => 
  apiRequest("POST", "/api/users/onboarding", data).then(res => res.json());
