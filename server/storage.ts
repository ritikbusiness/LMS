import { users, type User, type InsertUser, courses, modules, lessons, enrollments, lessonProgress, assessments, questions, assessmentAttempts, certificates, forumThreads, forumReplies, badges, userBadges, payments, learningPaths, learningPathSteps } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq, and, or, desc, asc, like, lt, gt, gte, not, isNull, inArray, count } from "drizzle-orm";
import { db } from "./db";

// Define the storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  incrementUserXP(id: number, amount: number): Promise<User>;
  
  // Courses
  getAllCourses(): Promise<any[]>;
  getCourseById(id: number): Promise<any | undefined>;
  getUserEnrolledCourses(userId: number): Promise<any[]>;
  getRecommendedCourses(domain?: string): Promise<any[]>;
  createCourse(data: any): Promise<any>;
  updateCourse(id: number, data: any): Promise<any>;
  deleteCourse(id: number): Promise<void>;
  courseHasEnrollments(courseId: number): Promise<boolean>;
  getInstructorCourses(instructorId: number): Promise<any[]>;
  
  // Modules & Lessons
  getCourseModules(courseId: number): Promise<any[]>;
  getModuleById(id: number): Promise<any | undefined>;
  getLessonById(id: number): Promise<any | undefined>;
  
  // Enrollments & Progress
  getEnrollment(userId: number, courseId: number): Promise<any | undefined>;
  createEnrollment(data: any): Promise<any>;
  getCourseProgress(userId: number, courseId: number): Promise<any>;
  updateCourseProgress(userId: number, moduleId: number): Promise<any>;
  getLessonProgress(userId: number, lessonId: number): Promise<any | undefined>;
  updateLessonProgress(data: any): Promise<any>;
  
  // Assessments
  getCourseAssessments(courseId: number): Promise<any[]>;
  getAssessmentById(id: number): Promise<any | undefined>;
  getAssessmentQuestions(assessmentId: number): Promise<any[]>;
  createAssessmentAttempt(data: any): Promise<any>;
  checkAllAssessmentsPassed(userId: number, courseId: number): Promise<boolean>;
  
  // Certificates
  getUserCertificates(userId: number): Promise<any[]>;
  getCertificateById(id: string): Promise<any | undefined>;
  createCertificate(data: any): Promise<any>;
  
  // Forum
  getAllForumThreads(): Promise<any[]>;
  getRecentForumThreads(): Promise<any[]>;
  getCourseForumThreads(courseId: number): Promise<any[]>;
  getForumThreadById(id: number): Promise<any | undefined>;
  createForumThread(data: any): Promise<any>;
  updateForumThreadVotes(id: number, increment: number): Promise<any>;
  
  // Leaderboard
  getLeaderboard(timeFrame: string, domain: string, currentUserId?: number): Promise<any>;
  
  // Learning Paths
  getLearningPathByDomain(domain: string): Promise<any | undefined>;
  getLearningPathWithSteps(pathId: number): Promise<any>;
}

// In-memory storage implementation (for development)
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private coursesMap: Map<number, any>;
  private modulesMap: Map<number, any>;
  private lessonsMap: Map<number, any>;
  private enrollmentsMap: Map<string, any>; // key: userId_courseId
  private lessonProgressMap: Map<string, any>; // key: userId_lessonId
  private assessmentsMap: Map<number, any>;
  private questionsMap: Map<number, any>;
  private assessmentAttemptsMap: Map<string, any>; // key: userId_assessmentId
  private certificatesMap: Map<string, any>;
  private forumThreadsMap: Map<number, any>;
  private forumRepliesMap: Map<number, any>;
  private badgesMap: Map<number, any>;
  private userBadgesMap: Map<string, any>; // key: userId_badgeId
  private paymentsMap: Map<number, any>;
  private learningPathsMap: Map<number, any>;
  private learningPathStepsMap: Map<number, any>;
  
  currentId: number;
  
  constructor() {
    this.usersMap = new Map();
    this.coursesMap = new Map();
    this.modulesMap = new Map();
    this.lessonsMap = new Map();
    this.enrollmentsMap = new Map();
    this.lessonProgressMap = new Map();
    this.assessmentsMap = new Map();
    this.questionsMap = new Map();
    this.assessmentAttemptsMap = new Map();
    this.certificatesMap = new Map();
    this.forumThreadsMap = new Map();
    this.forumRepliesMap = new Map();
    this.badgesMap = new Map();
    this.userBadgesMap = new Map();
    this.paymentsMap = new Map();
    this.learningPathsMap = new Map();
    this.learningPathStepsMap = new Map();
    
    this.currentId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Sample users
    const user1: User = {
      id: 1,
      email: "john.doe@example.com",
      fullName: "John Doe",
      role: "student",
      googleId: "google123",
      avatarUrl: "https://ui-avatars.com/api/?name=John+Doe",
      branch: "Computer Science",
      year: "3rd",
      domain: "DevOps",
      xpPoints: 150,
      createdAt: new Date(),
    };
    
    const user2: User = {
      id: 2,
      email: "alice.smith@example.com",
      fullName: "Alice Smith",
      role: "instructor",
      googleId: "google456",
      avatarUrl: "https://ui-avatars.com/api/?name=Alice+Smith",
      xpPoints: 0,
      createdAt: new Date(),
    };
    
    this.usersMap.set(user1.id, user1);
    this.usersMap.set(user2.id, user2);
    
    // Sample courses
    const course1 = {
      id: 1,
      title: "Introduction to DevOps",
      description: "Learn the fundamentals of DevOps methodology and practices.",
      domain: "DevOps",
      instructorId: 2,
      thumbnailUrl: "https://placehold.co/600x400?text=DevOps",
      price: 0,
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const course2 = {
      id: 2,
      title: "MERN Stack Development",
      description: "Complete guide to building web applications with MongoDB, Express, React, and Node.js.",
      domain: "MERN",
      instructorId: 2,
      thumbnailUrl: "https://placehold.co/600x400?text=MERN",
      price: 0,
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.coursesMap.set(course1.id, course1);
    this.coursesMap.set(course2.id, course2);
    
    // Sample modules
    const module1 = {
      id: 1,
      courseId: 1,
      title: "Introduction to CI/CD",
      description: "Understanding continuous integration and deployment.",
      order: 1,
    };
    
    const module2 = {
      id: 2,
      courseId: 1,
      title: "Working with Jenkins",
      description: "Setting up and using Jenkins for automation.",
      order: 2,
    };
    
    this.modulesMap.set(module1.id, module1);
    this.modulesMap.set(module2.id, module2);
    
    // Sample lessons
    const lesson1 = {
      id: 1,
      moduleId: 1,
      title: "CI/CD Fundamentals",
      description: "Understanding the principles of continuous integration and delivery.",
      videoUrl: "https://example.com/videos/cicd-fundamentals",
      duration: 1200, // 20 minutes
      order: 1,
      materials: { links: ["https://example.com/materials/cicd-slides"] },
    };
    
    const lesson2 = {
      id: 2,
      moduleId: 1,
      title: "CI/CD Pipeline Components",
      description: "Exploring the components that make up a CI/CD pipeline.",
      videoUrl: "https://example.com/videos/cicd-components",
      duration: 1500, // 25 minutes
      order: 2,
      materials: { links: ["https://example.com/materials/cicd-components-doc"] },
    };
    
    this.lessonsMap.set(lesson1.id, lesson1);
    this.lessonsMap.set(lesson2.id, lesson2);
    
    // Sample enrollment
    const enrollment1 = {
      id: 1,
      userId: 1,
      courseId: 1,
      enrolledAt: new Date(),
      completedAt: null,
      progress: 25, // 25% completed
      isActive: true,
    };
    
    this.enrollmentsMap.set(`${enrollment1.userId}_${enrollment1.courseId}`, enrollment1);
    
    // Sample lesson progress
    const progress1 = {
      id: 1,
      userId: 1,
      lessonId: 1,
      status: "completed",
      watchTime: 1200, // watched full video
      completedAt: new Date(),
    };
    
    this.lessonProgressMap.set(`${progress1.userId}_${progress1.lessonId}`, progress1);
    
    // Sample assessment
    const assessment1 = {
      id: 1,
      moduleId: 1,
      title: "CI/CD Fundamentals Quiz",
      description: "Test your knowledge of CI/CD fundamentals.",
      type: "mcq",
      timeLimit: 15, // 15 minutes
      passingScore: 70,
    };
    
    this.assessmentsMap.set(assessment1.id, assessment1);
    
    // Sample questions
    const question1 = {
      id: 1,
      assessmentId: 1,
      text: "What does CI stand for in CI/CD?",
      options: ["Continuous Integration", "Continuous Implementation", "Complete Integration", "Compiled Interface"],
      correctOption: 0,
      order: 1,
    };
    
    const question2 = {
      id: 2,
      assessmentId: 1,
      text: "Which of the following is a CI/CD tool?",
      options: ["React", "Jenkins", "MongoDB", "Express"],
      correctOption: 1,
      order: 2,
    };
    
    this.questionsMap.set(question1.id, question1);
    this.questionsMap.set(question2.id, question2);
    
    // Sample forum thread
    const thread1 = {
      id: 1,
      title: "Help with Jenkins configuration",
      content: "I'm having trouble configuring Jenkins for my project. Can anyone help?",
      userId: 1,
      courseId: 1,
      status: "open",
      votes: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.forumThreadsMap.set(thread1.id, thread1);
    
    // Sample forum reply
    const reply1 = {
      id: 1,
      threadId: 1,
      content: "Have you tried checking the documentation at jenkins.io? It has good tutorials.",
      userId: 2,
      isAccepted: false,
      votes: 1,
      createdAt: new Date(),
    };
    
    this.forumRepliesMap.set(reply1.id, reply1);
    
    // Sample badge
    const badge1 = {
      id: 1,
      name: "First Course Completed",
      description: "Awarded for completing your first course.",
      imageUrl: "https://example.com/badges/first-course",
      xpValue: 50,
    };
    
    this.badgesMap.set(badge1.id, badge1);
    
    // Sample learning path
    const path1 = {
      id: 1,
      domain: "DevOps",
      name: "DevOps Engineer Path",
      description: "Complete learning path to become a DevOps engineer.",
    };
    
    this.learningPathsMap.set(path1.id, path1);
    
    // Sample learning path step
    const step1 = {
      id: 1,
      pathId: 1,
      courseId: 1,
      order: 1,
      isRequired: true,
    };
    
    this.learningPathStepsMap.set(step1.id, step1);
  }
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email.split('@')[0] === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email
    );
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.googleId === googleId
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.usersMap.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = this.usersMap.get(id);
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = { ...user, ...data };
    this.usersMap.set(id, updatedUser);
    
    return updatedUser;
  }
  
  async incrementUserXP(id: number, amount: number): Promise<User> {
    const user = this.usersMap.get(id);
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = { 
      ...user, 
      xpPoints: (user.xpPoints || 0) + amount 
    };
    
    this.usersMap.set(id, updatedUser);
    
    return updatedUser;
  }
  
  // Courses
  async getAllCourses(): Promise<any[]> {
    return Array.from(this.coursesMap.values());
  }
  
  async getCourseById(id: number): Promise<any | undefined> {
    return this.coursesMap.get(id);
  }
  
  async getUserEnrolledCourses(userId: number): Promise<any[]> {
    const enrollments = Array.from(this.enrollmentsMap.values()).filter(
      (enrollment) => enrollment.userId === userId && enrollment.isActive
    );
    
    return enrollments.map((enrollment) => {
      const course = this.coursesMap.get(enrollment.courseId);
      return {
        ...course,
        progress: enrollment.progress,
        enrollmentId: enrollment.id,
        completedAt: enrollment.completedAt,
      };
    });
  }
  
  async getRecommendedCourses(domain?: string): Promise<any[]> {
    let courses = Array.from(this.coursesMap.values()).filter(
      (course) => course.status === 'published'
    );
    
    if (domain) {
      courses = courses.filter((course) => course.domain === domain);
    }
    
    return courses.slice(0, 5); // Limit to 5 courses
  }
  
  async createCourse(data: any): Promise<any> {
    const id = this.currentId++;
    
    const newCourse = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.coursesMap.set(id, newCourse);
    return newCourse;
  }
  
  async updateCourse(id: number, data: any): Promise<any> {
    const course = this.coursesMap.get(id);
    
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    
    const updatedCourse = {
      ...course,
      ...data,
      updatedAt: new Date()
    };
    
    this.coursesMap.set(id, updatedCourse);
    return updatedCourse;
  }
  
  async deleteCourse(id: number): Promise<void> {
    if (!this.coursesMap.has(id)) {
      throw new Error(`Course with ID ${id} not found`);
    }
    
    this.coursesMap.delete(id);
  }
  
  async courseHasEnrollments(courseId: number): Promise<boolean> {
    // Check if any enrollments exist for this course
    return Array.from(this.enrollmentsMap.values()).some(
      enrollment => enrollment.courseId === courseId
    );
  }
  
  async getInstructorCourses(instructorId: number): Promise<any[]> {
    // Get all courses for an instructor
    return Array.from(this.coursesMap.values())
      .filter(course => course.instructorId === instructorId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
  
  // Modules & Lessons
  async getCourseModules(courseId: number): Promise<any[]> {
    const modules = Array.from(this.modulesMap.values())
      .filter((module) => module.courseId === courseId)
      .sort((a, b) => a.order - b.order);
    
    // Add lessons to each module
    return modules.map((module) => {
      const moduleLessons = Array.from(this.lessonsMap.values())
        .filter((lesson) => lesson.moduleId === module.id)
        .sort((a, b) => a.order - b.order);
      
      // Find assessment for this module
      const assessment = Array.from(this.assessmentsMap.values()).find(
        (assessment) => assessment.moduleId === module.id
      );
      
      return {
        ...module,
        lessons: moduleLessons,
        assessment,
      };
    });
  }
  
  async getModuleById(id: number): Promise<any | undefined> {
    return this.modulesMap.get(id);
  }
  
  async getLessonById(id: number): Promise<any | undefined> {
    const lesson = this.lessonsMap.get(id);
    
    if (lesson) {
      const module = this.modulesMap.get(lesson.moduleId);
      if (module) {
        return {
          ...lesson,
          moduleTitle: module.title,
        };
      }
    }
    
    return lesson;
  }
  
  // Enrollments & Progress
  async getEnrollment(userId: number, courseId: number): Promise<any | undefined> {
    return this.enrollmentsMap.get(`${userId}_${courseId}`);
  }
  
  async createEnrollment(data: any): Promise<any> {
    const id = this.currentId++;
    const newEnrollment = {
      ...data,
      id,
      enrolledAt: new Date(),
    };
    
    this.enrollmentsMap.set(`${data.userId}_${data.courseId}`, newEnrollment);
    
    return newEnrollment;
  }
  
  async getCourseProgress(userId: number, courseId: number): Promise<any> {
    // Get enrollment
    const enrollment = this.enrollmentsMap.get(`${userId}_${courseId}`);
    
    if (!enrollment) {
      return { percentage: 0 };
    }
    
    // Get all lessons for the course
    const modules = Array.from(this.modulesMap.values()).filter(
      (module) => module.courseId === courseId
    );
    
    const allLessons = modules.flatMap((module) => {
      return Array.from(this.lessonsMap.values()).filter(
        (lesson) => lesson.moduleId === module.id
      );
    });
    
    // Get completed lessons
    const completedLessons = Array.from(this.lessonProgressMap.values())
      .filter(
        (progress) => 
          progress.userId === userId && 
          progress.status === 'completed' &&
          allLessons.some((lesson) => lesson.id === progress.lessonId)
      )
      .map((progress) => progress.lessonId);
    
    // Get completed assessments
    const assessmentIds = Array.from(this.assessmentsMap.values())
      .filter((assessment) => 
        modules.some((module) => module.id === assessment.moduleId)
      )
      .map((assessment) => assessment.id);
    
    const completedAssessments = Array.from(this.assessmentAttemptsMap.values())
      .filter(
        (attempt) => 
          attempt.userId === userId && 
          attempt.passed && 
          assessmentIds.includes(attempt.assessmentId)
      )
      .map((attempt) => attempt.assessmentId);
    
    // Calculate percentage
    let percentage = 0;
    if (allLessons.length > 0) {
      percentage = Math.round((completedLessons.length / allLessons.length) * 100);
    }
    
    return {
      percentage,
      completedLessons,
      completedAssessments,
    };
  }
  
  async updateCourseProgress(userId: number, moduleId: number): Promise<any> {
    // Get module
    const module = this.modulesMap.get(moduleId);
    if (!module) {
      throw new Error(`Module with ID ${moduleId} not found`);
    }
    
    // Get all lessons in the module
    const moduleLessons = Array.from(this.lessonsMap.values()).filter(
      (lesson) => lesson.moduleId === moduleId
    );
    
    // Get completed lessons in the module
    const completedLessonIds = Array.from(this.lessonProgressMap.values())
      .filter(
        (progress) => 
          progress.userId === userId && 
          progress.status === 'completed' &&
          moduleLessons.some((lesson) => lesson.id === progress.lessonId)
      )
      .map((progress) => progress.lessonId);
    
    const allLessonsCompleted = completedLessonIds.length === moduleLessons.length;
    
    if (allLessonsCompleted) {
      // Update course progress
      const enrollment = this.enrollmentsMap.get(`${userId}_${module.courseId}`);
      
      if (enrollment) {
        // Get all lessons for the course
        const allModules = Array.from(this.modulesMap.values()).filter(
          (m) => m.courseId === module.courseId
        );
        
        const allCourseLessons = allModules.flatMap((m) => {
          return Array.from(this.lessonsMap.values()).filter(
            (lesson) => lesson.moduleId === m.id
          );
        });
        
        // Get all completed lessons for the course
        const allCompletedLessons = Array.from(this.lessonProgressMap.values())
          .filter(
            (progress) => 
              progress.userId === userId && 
              progress.status === 'completed' &&
              allCourseLessons.some((lesson) => lesson.id === progress.lessonId)
          );
        
        // Calculate progress
        const courseProgress = Math.round(
          (allCompletedLessons.length / allCourseLessons.length) * 100
        );
        
        // Update enrollment
        const updatedEnrollment = {
          ...enrollment,
          progress: courseProgress,
        };
        
        // If course is complete, update completedAt
        if (courseProgress === 100) {
          updatedEnrollment.completedAt = new Date();
        }
        
        this.enrollmentsMap.set(`${userId}_${module.courseId}`, updatedEnrollment);
        
        return updatedEnrollment;
      }
    }
    
    return null;
  }
  
  async getLessonProgress(userId: number, lessonId: number): Promise<any | undefined> {
    return this.lessonProgressMap.get(`${userId}_${lessonId}`);
  }
  
  async updateLessonProgress(data: any): Promise<any> {
    const key = `${data.userId}_${data.lessonId}`;
    const existingProgress = this.lessonProgressMap.get(key);
    
    if (existingProgress) {
      // Update existing progress
      const updatedProgress = { ...existingProgress, ...data };
      this.lessonProgressMap.set(key, updatedProgress);
      return updatedProgress;
    } else {
      // Create new progress
      const id = this.currentId++;
      const newProgress = { ...data, id };
      this.lessonProgressMap.set(key, newProgress);
      return newProgress;
    }
  }
  
  // Assessments
  async getCourseAssessments(courseId: number): Promise<any[]> {
    // Get modules for the course
    const courseModules = Array.from(this.modulesMap.values()).filter(
      (module) => module.courseId === courseId
    );
    
    // Get assessments for these modules
    const assessments = Array.from(this.assessmentsMap.values()).filter((assessment) =>
      courseModules.some((module) => module.id === assessment.moduleId)
    );
    
    // Add questions to each assessment
    return assessments.map((assessment) => {
      const questions = Array.from(this.questionsMap.values())
        .filter((question) => question.assessmentId === assessment.id)
        .sort((a, b) => a.order - b.order);
      
      return {
        ...assessment,
        questions,
      };
    });
  }
  
  async getAssessmentById(id: number): Promise<any | undefined> {
    return this.assessmentsMap.get(id);
  }
  
  async getAssessmentQuestions(assessmentId: number): Promise<any[]> {
    return Array.from(this.questionsMap.values())
      .filter((question) => question.assessmentId === assessmentId)
      .sort((a, b) => a.order - b.order);
  }
  
  async createAssessmentAttempt(data: any): Promise<any> {
    const id = this.currentId++;
    const key = `${data.userId}_${data.assessmentId}`;
    
    const newAttempt = {
      ...data,
      id,
      startedAt: new Date(),
    };
    
    this.assessmentAttemptsMap.set(key, newAttempt);
    
    return newAttempt;
  }
  
  async checkAllAssessmentsPassed(userId: number, courseId: number): Promise<boolean> {
    // Get modules for the course
    const courseModules = Array.from(this.modulesMap.values()).filter(
      (module) => module.courseId === courseId
    );
    
    // Get assessments for these modules
    const courseAssessments = Array.from(this.assessmentsMap.values()).filter(
      (assessment) =>
        courseModules.some((module) => module.id === assessment.moduleId)
    );
    
    if (courseAssessments.length === 0) {
      // No assessments for this course
      return true;
    }
    
    // Get passed assessment attempts
    const passedAssessments = Array.from(this.assessmentAttemptsMap.values()).filter(
      (attempt) =>
        attempt.userId === userId &&
        attempt.passed &&
        courseAssessments.some((assessment) => assessment.id === attempt.assessmentId)
    );
    
    // Check if all assessments are passed
    return passedAssessments.length === courseAssessments.length;
  }
  
  // Certificates
  async getUserCertificates(userId: number): Promise<any[]> {
    return Array.from(this.certificatesMap.values())
      .filter((certificate) => certificate.userId === userId)
      .map((certificate) => {
        const course = this.coursesMap.get(certificate.courseId);
        const user = this.usersMap.get(certificate.userId);
        
        return {
          ...certificate,
          courseName: course ? course.title : 'Unknown Course',
          userName: user ? user.fullName : 'Unknown User',
        };
      });
  }
  
  async getCertificateById(id: string): Promise<any | undefined> {
    const certificate = this.certificatesMap.get(id);
    
    if (certificate) {
      const course = this.coursesMap.get(certificate.courseId);
      const user = this.usersMap.get(certificate.userId);
      
      return {
        ...certificate,
        courseName: course ? course.title : 'Unknown Course',
        userName: user ? user.fullName : 'Unknown User',
      };
    }
    
    return undefined;
  }
  
  async createCertificate(data: any): Promise<any> {
    const id = this.currentId++;
    
    const newCertificate = {
      ...data,
      id,
      issuedAt: new Date(),
    };
    
    this.certificatesMap.set(data.certificateId, newCertificate);
    
    return newCertificate;
  }
  
  // Forum
  async getAllForumThreads(): Promise<any[]> {
    const threads = Array.from(this.forumThreadsMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return threads.map((thread) => {
      const course = this.coursesMap.get(thread.courseId);
      const replies = Array.from(this.forumRepliesMap.values()).filter(
        (reply) => reply.threadId === thread.id
      );
      
      return {
        ...thread,
        courseName: course ? course.title : 'Unknown Course',
        replyCount: replies.length,
      };
    });
  }
  
  async getRecentForumThreads(): Promise<any[]> {
    const threads = Array.from(this.forumThreadsMap.values())
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
    
    return threads.map((thread) => {
      const course = this.coursesMap.get(thread.courseId);
      const replies = Array.from(this.forumRepliesMap.values()).filter(
        (reply) => reply.threadId === thread.id
      );
      
      return {
        ...thread,
        courseName: course ? course.title : 'Unknown Course',
        replyCount: replies.length,
      };
    });
  }
  
  async getCourseForumThreads(courseId: number): Promise<any[]> {
    const threads = Array.from(this.forumThreadsMap.values())
      .filter((thread) => thread.courseId === courseId)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    
    return threads.map((thread) => {
      const course = this.coursesMap.get(thread.courseId);
      const replies = Array.from(this.forumRepliesMap.values()).filter(
        (reply) => reply.threadId === thread.id
      );
      
      return {
        ...thread,
        courseName: course ? course.title : 'Unknown Course',
        replyCount: replies.length,
      };
    });
  }
  
  async getForumThreadById(id: number): Promise<any | undefined> {
    const thread = this.forumThreadsMap.get(id);
    
    if (thread) {
      const course = this.coursesMap.get(thread.courseId);
      
      return {
        ...thread,
        courseName: course ? course.title : 'Unknown Course',
      };
    }
    
    return undefined;
  }
  
  async createForumThread(data: any): Promise<any> {
    const id = this.currentId++;
    
    const newThread = {
      ...data,
      id,
      votes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.forumThreadsMap.set(id, newThread);
    
    // Add course name
    const course = this.coursesMap.get(data.courseId);
    
    return {
      ...newThread,
      courseName: course ? course.title : 'Unknown Course',
    };
  }
  
  async updateForumThreadVotes(id: number, increment: number): Promise<any> {
    const thread = this.forumThreadsMap.get(id);
    
    if (!thread) {
      throw new Error(`Thread with ID ${id} not found`);
    }
    
    const updatedThread = {
      ...thread,
      votes: thread.votes + increment,
    };
    
    this.forumThreadsMap.set(id, updatedThread);
    
    return updatedThread;
  }
  
  // Leaderboard
  async getLeaderboard(timeFrame: string, domain: string, currentUserId?: number): Promise<any> {
    // Sort users by XP
    let users = Array.from(this.usersMap.values())
      .filter((user) => user.xpPoints && user.xpPoints > 0)
      .sort((a, b) => (b.xpPoints || 0) - (a.xpPoints || 0));
    
    // Apply domain filter
    if (domain !== 'all') {
      users = users.filter((user) => user.domain === domain);
    }
    
    // Get top 10 users
    const rankings = users.slice(0, 10).map((user) => {
      // Count badges
      const badges = Array.from(this.userBadgesMap.values()).filter(
        (badge) => badge.userId === user.id
      );
      
      return {
        userId: user.id,
        fullName: user.fullName,
        branch: user.branch,
        avatarUrl: user.avatarUrl,
        xpPoints: user.xpPoints,
        badgesCount: badges.length,
      };
    });
    
    // Get current user's rank if provided
    let userRanking = null;
    if (currentUserId) {
      const currentUser = this.usersMap.get(currentUserId);
      
      if (currentUser) {
        const userRank = users.findIndex((user) => user.id === currentUserId) + 1;
        const badges = Array.from(this.userBadgesMap.values()).filter(
          (badge) => badge.userId === currentUserId
        );
        
        userRanking = {
          rank: userRank,
          badgesCount: badges.length,
        };
      }
    }
    
    return {
      rankings,
      userRanking,
    };
  }
  
  // Learning Paths
  async getLearningPathByDomain(domain: string): Promise<any | undefined> {
    return Array.from(this.learningPathsMap.values()).find(
      (path) => path.domain === domain
    );
  }
  
  async getLearningPathWithSteps(pathId: number): Promise<any> {
    const path = this.learningPathsMap.get(pathId);
    
    if (!path) {
      throw new Error(`Learning path with ID ${pathId} not found`);
    }
    
    const steps = Array.from(this.learningPathStepsMap.values())
      .filter((step) => step.pathId === pathId)
      .sort((a, b) => a.order - b.order)
      .map((step) => {
        const course = this.coursesMap.get(step.courseId);
        
        return {
          ...step,
          courseTitle: course ? course.title : 'Unknown Course',
          courseDescription: course ? course.description : '',
        };
      });
    
    return {
      ...path,
      steps,
    };
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Use MemStorage as fallback for now
  private memStorage = new MemStorage();

  // Users
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Database error in getUser:', error);
      return this.memStorage.getUser(id);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(like(users.email, `${username}@%`));
      return user;
    } catch (error) {
      console.error('Database error in getUserByUsername:', error);
      return this.memStorage.getUserByUsername(username);
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error('Database error in getUserByEmail:', error);
      return this.memStorage.getUserByEmail(email);
    }
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
      return user;
    } catch (error) {
      console.error('Database error in getUserByGoogleId:', error);
      return this.memStorage.getUserByGoogleId(googleId);
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const [newUser] = await db.insert(users).values(user).returning();
      return newUser;
    } catch (error) {
      console.error('Database error in createUser:', error);
      return this.memStorage.createUser(user);
    }
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();
      
      if (!updatedUser) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Database error in updateUser:', error);
      return this.memStorage.updateUser(id, data);
    }
  }

  async incrementUserXP(id: number, amount: number): Promise<User> {
    try {
      const user = await this.getUser(id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      const newXP = (user.xpPoints || 0) + amount;
      const [updatedUser] = await db
        .update(users)
        .set({ xpPoints: newXP })
        .where(eq(users.id, id))
        .returning();
      
      return updatedUser;
    } catch (error) {
      console.error('Database error in incrementUserXP:', error);
      return this.memStorage.incrementUserXP(id, amount);
    }
  }

  // Use MemStorage for the rest for now
  async getAllCourses(): Promise<any[]> {
    try {
      const allCourses = await db.select().from(courses);
      
      // Enhance with instructor information
      const enhancedCourses = await Promise.all(
        allCourses.map(async (course) => {
          const [instructor] = await db
            .select()
            .from(users)
            .where(eq(users.id, course.instructorId));
          
          return {
            ...course,
            instructor: instructor ? {
              id: instructor.id,
              fullName: instructor.fullName,
              avatarUrl: instructor.avatarUrl
            } : { 
              id: course.instructorId, 
              fullName: "Unknown Instructor" 
            }
          };
        })
      );
      
      return enhancedCourses;
    } catch (error) {
      console.error("Error getting all courses from database:", error);
      return this.memStorage.getAllCourses();
    }
  }

  async getCourseById(id: number): Promise<any | undefined> {
    try {
      const [course] = await db.select().from(courses).where(eq(courses.id, id));
      return course || undefined;
    } catch (error) {
      console.error('Database error in getCourseById:', error);
      return this.memStorage.getCourseById(id);
    }
  }

  async getUserEnrolledCourses(userId: number): Promise<any[]> {
    try {
      const enrolledCourses = await db
        .select({
          id: courses.id,
          title: courses.title,
          description: courses.description,
          domain: courses.domain,
          instructorId: courses.instructorId,
          thumbnailUrl: courses.thumbnailUrl,
          price: courses.price,
          status: courses.status,
          createdAt: courses.createdAt,
          updatedAt: courses.updatedAt,
          progress: enrollments.progress,
          enrollmentId: enrollments.id,
          completedAt: enrollments.completedAt
        })
        .from(enrollments)
        .innerJoin(courses, eq(enrollments.courseId, courses.id))
        .where(and(eq(enrollments.userId, userId), eq(enrollments.isActive, true)));

      return enrolledCourses;
    } catch (error) {
      console.error('Database error in getUserEnrolledCourses:', error);
      return this.memStorage.getUserEnrolledCourses(userId);
    }
  }

  async getRecommendedCourses(domain?: string): Promise<any[]> {
    try {
      let query = db
        .select()
        .from(courses)
        .where(eq(courses.status, 'published'))
        .limit(5);
      
      if (domain) {
        query = db
          .select()
          .from(courses)
          .where(and(eq(courses.status, 'published'), eq(courses.domain, domain as any)))
          .limit(5);
      }
      
      return await query;
    } catch (error) {
      console.error('Database error in getRecommendedCourses:', error);
      return this.memStorage.getRecommendedCourses(domain);
    }
  }
  
  async createCourse(data: any): Promise<any> {
    try {
      const [newCourse] = await db
        .insert(courses)
        .values({
          ...data,
          updatedAt: new Date()
        })
        .returning();
      
      return newCourse;
    } catch (error) {
      console.error('Database error in createCourse:', error);
      return this.memStorage.createCourse(data);
    }
  }
  
  async updateCourse(id: number, data: any): Promise<any> {
    try {
      const [updatedCourse] = await db
        .update(courses)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(courses.id, id))
        .returning();
      
      if (!updatedCourse) {
        throw new Error(`Course with ID ${id} not found`);
      }
      
      return updatedCourse;
    } catch (error) {
      console.error('Database error in updateCourse:', error);
      return this.memStorage.updateCourse(id, data);
    }
  }
  
  async deleteCourse(id: number): Promise<void> {
    try {
      await db
        .delete(courses)
        .where(eq(courses.id, id));
    } catch (error) {
      console.error('Database error in deleteCourse:', error);
      await this.memStorage.deleteCourse(id);
    }
  }
  
  async courseHasEnrollments(courseId: number): Promise<boolean> {
    try {
      const enrollmentsCount = await db
        .select({ count: count() })
        .from(enrollments)
        .where(eq(enrollments.courseId, courseId));
      
      return enrollmentsCount[0].count > 0;
    } catch (error) {
      console.error('Database error in courseHasEnrollments:', error);
      return this.memStorage.courseHasEnrollments(courseId);
    }
  }
  
  async getInstructorCourses(instructorId: number): Promise<any[]> {
    try {
      const instructorCourses = await db
        .select()
        .from(courses)
        .where(eq(courses.instructorId, instructorId))
        .orderBy(desc(courses.updatedAt));
      
      return instructorCourses;
    } catch (error) {
      console.error('Database error in getInstructorCourses:', error);
      return this.memStorage.getInstructorCourses(instructorId);
    }
  }

  async getCourseModules(courseId: number): Promise<any[]> {
    return this.memStorage.getCourseModules(courseId);
  }

  async getModuleById(id: number): Promise<any | undefined> {
    return this.memStorage.getModuleById(id);
  }

  async getLessonById(id: number): Promise<any | undefined> {
    return this.memStorage.getLessonById(id);
  }

  async getEnrollment(userId: number, courseId: number): Promise<any | undefined> {
    return this.memStorage.getEnrollment(userId, courseId);
  }

  async createEnrollment(data: any): Promise<any> {
    return this.memStorage.createEnrollment(data);
  }

  async getCourseProgress(userId: number, courseId: number): Promise<any> {
    return this.memStorage.getCourseProgress(userId, courseId);
  }

  async updateCourseProgress(userId: number, moduleId: number): Promise<any> {
    return this.memStorage.updateCourseProgress(userId, moduleId);
  }

  async getLessonProgress(userId: number, lessonId: number): Promise<any | undefined> {
    return this.memStorage.getLessonProgress(userId, lessonId);
  }

  async updateLessonProgress(data: any): Promise<any> {
    return this.memStorage.updateLessonProgress(data);
  }

  async getCourseAssessments(courseId: number): Promise<any[]> {
    return this.memStorage.getCourseAssessments(courseId);
  }

  async getAssessmentById(id: number): Promise<any | undefined> {
    return this.memStorage.getAssessmentById(id);
  }

  async getAssessmentQuestions(assessmentId: number): Promise<any[]> {
    return this.memStorage.getAssessmentQuestions(assessmentId);
  }

  async createAssessmentAttempt(data: any): Promise<any> {
    return this.memStorage.createAssessmentAttempt(data);
  }

  async checkAllAssessmentsPassed(userId: number, courseId: number): Promise<boolean> {
    return this.memStorage.checkAllAssessmentsPassed(userId, courseId);
  }

  async getUserCertificates(userId: number): Promise<any[]> {
    return this.memStorage.getUserCertificates(userId);
  }

  async getCertificateById(id: string): Promise<any | undefined> {
    return this.memStorage.getCertificateById(id);
  }

  async createCertificate(data: any): Promise<any> {
    return this.memStorage.createCertificate(data);
  }

  async getAllForumThreads(): Promise<any[]> {
    return this.memStorage.getAllForumThreads();
  }

  async getRecentForumThreads(): Promise<any[]> {
    return this.memStorage.getRecentForumThreads();
  }

  async getCourseForumThreads(courseId: number): Promise<any[]> {
    return this.memStorage.getCourseForumThreads(courseId);
  }

  async getForumThreadById(id: number): Promise<any | undefined> {
    return this.memStorage.getForumThreadById(id);
  }

  async createForumThread(data: any): Promise<any> {
    return this.memStorage.createForumThread(data);
  }

  async updateForumThreadVotes(id: number, increment: number): Promise<any> {
    return this.memStorage.updateForumThreadVotes(id, increment);
  }

  async getLeaderboard(timeFrame: string, domain: string, currentUserId?: number): Promise<any> {
    return this.memStorage.getLeaderboard(timeFrame, domain, currentUserId);
  }

  async getLearningPathByDomain(domain: string): Promise<any | undefined> {
    return this.memStorage.getLearningPathByDomain(domain);
  }

  async getLearningPathWithSteps(pathId: number): Promise<any> {
    return this.memStorage.getLearningPathWithSteps(pathId);
  }
}

// Use the DatabaseStorage for our application
export const storage = new DatabaseStorage();