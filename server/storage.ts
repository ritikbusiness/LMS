import { users, type User, type InsertUser, courses, modules, lessons, enrollments, lessonProgress, assessments, questions, assessmentAttempts, certificates, forumThreads, forumReplies, badges, userBadges, payments, learningPaths, learningPathSteps } from "@shared/schema";
import { randomUUID } from "crypto";

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

// Memory storage implementation (for dev/testing)
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
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users
    const user1: User = {
      id: 1,
      email: "student@college.edu",
      fullName: "Sarah Johnson",
      role: "student",
      googleId: "google123",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      branch: "Computer Science",
      year: "3rd Year",
      domain: "DevOps",
      xpPoints: 1240,
      createdAt: new Date().toISOString(),
    };
    this.usersMap.set(1, user1);
    
    // Sample courses
    const course1 = {
      id: 1,
      title: "Docker Fundamentals",
      description: "Learn the basics of containerization with Docker",
      domain: "DevOps",
      instructorId: 2,
      thumbnailUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80",
      price: 49.99,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.coursesMap.set(1, course1);
    
    const course2 = {
      id: 2,
      title: "Kubernetes Essentials",
      description: "Master container orchestration with Kubernetes",
      domain: "DevOps",
      instructorId: 2,
      thumbnailUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80",
      price: 59.99,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.coursesMap.set(2, course2);
    
    const course3 = {
      id: 3,
      title: "CI/CD Pipelines",
      description: "Build efficient CI/CD pipelines for your projects",
      domain: "DevOps",
      instructorId: 2,
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80",
      price: 39.99,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.coursesMap.set(3, course3);
    
    // Recommended courses
    const course4 = {
      id: 4,
      title: "AWS Cloud Services",
      description: "Learn to build, deploy, and scale applications using AWS cloud services",
      domain: "DevOps",
      instructorId: 2,
      thumbnailUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80",
      price: 49.99,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.coursesMap.set(4, course4);
    
    const course5 = {
      id: 5,
      title: "Terraform - Infrastructure as Code",
      description: "Learn to define and provision infrastructure using Terraform's declarative language",
      domain: "DevOps",
      instructorId: 2,
      thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80",
      price: 39.99,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.coursesMap.set(5, course5);
    
    // Sample enrollments
    const enrollment1 = {
      id: 1,
      userId: 1,
      courseId: 1,
      enrolledAt: new Date().toISOString(),
      completedAt: null,
      progress: 50,
      isActive: true,
    };
    this.enrollmentsMap.set("1_1", enrollment1);
    
    const enrollment2 = {
      id: 2,
      userId: 1,
      courseId: 2,
      enrolledAt: new Date().toISOString(),
      completedAt: null,
      progress: 16,
      isActive: true,
    };
    this.enrollmentsMap.set("1_2", enrollment2);
    
    const enrollment3 = {
      id: 3,
      userId: 1,
      courseId: 3,
      enrolledAt: new Date().toISOString(),
      completedAt: null,
      progress: 10,
      isActive: true,
    };
    this.enrollmentsMap.set("1_3", enrollment3);
    
    // Sample modules for Docker Fundamentals
    const module1 = {
      id: 1,
      courseId: 1,
      title: "Introduction to Docker",
      description: "Get started with Docker concepts and architecture",
      order: 1,
    };
    this.modulesMap.set(1, module1);
    
    const module2 = {
      id: 2,
      courseId: 1,
      title: "Working with Containers",
      description: "Learn to create, manage, and work with Docker containers",
      order: 2,
    };
    this.modulesMap.set(2, module2);
    
    // Sample lessons
    const lesson1 = {
      id: 1,
      moduleId: 1,
      title: "What is Docker?",
      description: "An introduction to container technology and Docker",
      videoUrl: "https://www.youtube.com/embed/pTFZFxd4hOI",
      duration: 600, // 10 minutes
      order: 1,
      materials: [
        {
          id: 1,
          title: "Docker Introduction Slide Deck",
          url: "#",
          type: "PDF",
          size: "2.5 MB"
        }
      ]
    };
    this.lessonsMap.set(1, lesson1);
    
    const lesson2 = {
      id: 2,
      moduleId: 1,
      title: "Docker Architecture",
      description: "Understanding Docker components and workflow",
      videoUrl: "https://www.youtube.com/embed/gAGEar5HQoU",
      duration: 720, // 12 minutes
      order: 2,
      materials: [
        {
          id: 2,
          title: "Docker Architecture Diagram",
          url: "#",
          type: "PDF",
          size: "1.2 MB"
        }
      ]
    };
    this.lessonsMap.set(2, lesson2);
    
    // Sample assessments
    const assessment1 = {
      id: 1,
      moduleId: 1,
      title: "Docker Fundamentals Quiz",
      description: "Test your knowledge of Docker basics",
      type: "mcq",
      timeLimit: 20,
      passingScore: 70,
    };
    this.assessmentsMap.set(1, assessment1);
    
    // Sample questions
    const question1 = {
      id: 1,
      assessmentId: 1,
      text: "What command is used to list all running Docker containers?",
      options: ["docker ps", "docker ls", "docker list", "docker containers"],
      correctOption: 0,
      order: 1,
    };
    this.questionsMap.set(1, question1);
    
    const question2 = {
      id: 2,
      assessmentId: 1,
      text: "Which of the following is NOT a Docker component?",
      options: ["Docker Client", "Docker Daemon", "Docker Hypervisor", "Docker Registry"],
      correctOption: 2,
      order: 2,
    };
    this.questionsMap.set(2, question2);
    
    // Sample forum threads
    const thread1 = {
      id: 1,
      title: "How to fix Docker compose networking issues?",
      content: "I'm trying to set up a multi-container application with Docker Compose but having trouble with the networking between containers...",
      userId: 3,
      courseId: 1,
      status: "solved",
      votes: 24,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      courseName: "Docker Fundamentals",
      replyCount: 5,
    };
    this.forumThreadsMap.set(1, thread1);
    
    const thread2 = {
      id: 2,
      title: "Best practices for Kubernetes secrets management?",
      content: "I'm working on deploying a secure application on Kubernetes and wondering what are the best practices for managing secrets...",
      userId: 4,
      courseId: 2,
      status: "open",
      votes: 17,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      courseName: "Kubernetes Essentials",
      replyCount: 3,
    };
    this.forumThreadsMap.set(2, thread2);
    
    const thread3 = {
      id: 3,
      title: "Jenkins vs. GitHub Actions - pros and cons?",
      content: "I'm trying to decide between Jenkins and GitHub Actions for my CI/CD pipeline. Would love to hear experiences and opinions...",
      userId: 5,
      courseId: 3,
      status: "open",
      votes: 9,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      courseName: "CI/CD Pipelines",
      replyCount: 12,
    };
    this.forumThreadsMap.set(3, thread3);
    
    // Sample learning paths
    const learningPath1 = {
      id: 1,
      domain: "DevOps",
      name: "DevOps Engineer Path",
      description: "Complete learning path to become a DevOps engineer",
    };
    this.learningPathsMap.set(1, learningPath1);
    
    // Sample learning path steps
    const learningPathSteps = [
      {
        id: 1,
        pathId: 1,
        courseId: 1, // Docker Fundamentals
        order: 1,
        isRequired: true,
      },
      {
        id: 2,
        pathId: 1,
        courseId: 2, // Kubernetes Essentials
        order: 2,
        isRequired: true,
      },
      {
        id: 3,
        pathId: 1,
        courseId: 4, // AWS Cloud Services
        order: 3,
        isRequired: true,
      },
      {
        id: 4,
        pathId: 1,
        courseId: 3, // CI/CD Pipelines
        order: 4,
        isRequired: true,
      },
      {
        id: 5,
        pathId: 1,
        courseId: 5, // Terraform
        order: 5,
        isRequired: true,
      }
    ];
    
    for (const step of learningPathSteps) {
      this.learningPathStepsMap.set(step.id, step);
    }
    
    // Set the current ID to the next available ID
    this.currentId = 6;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email.split('@')[0] === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.googleId === googleId,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId++;
    const newUser: User = { ...user, id, createdAt: new Date().toISOString() };
    this.usersMap.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = { ...user, ...data };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  async incrementUserXP(id: number, amount: number): Promise<User> {
    const user = await this.getUser(id);
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

  async getAllCourses(): Promise<any[]> {
    return Array.from(this.coursesMap.values());
  }

  async getCourseById(id: number): Promise<any | undefined> {
    return this.coursesMap.get(id);
  }

  async getUserEnrolledCourses(userId: number): Promise<any[]> {
    const enrollments = Array.from(this.enrollmentsMap.values())
      .filter(enrollment => enrollment.userId === userId);
    
    return Promise.all(
      enrollments.map(async enrollment => {
        const course = await this.getCourseById(enrollment.courseId);
        return {
          ...course,
          progress: enrollment.progress,
          enrolledAt: enrollment.enrolledAt
        };
      })
    );
  }

  async getRecommendedCourses(domain?: string): Promise<any[]> {
    const courses = Array.from(this.coursesMap.values())
      .filter(course => course.status === 'published');
    
    if (domain) {
      return courses.filter(course => course.domain === domain);
    }
    
    return courses;
  }

  async getCourseModules(courseId: number): Promise<any[]> {
    const modules = Array.from(this.modulesMap.values())
      .filter(module => module.courseId === courseId)
      .sort((a, b) => a.order - b.order);
    
    return Promise.all(
      modules.map(async module => {
        const lessons = Array.from(this.lessonsMap.values())
          .filter(lesson => lesson.moduleId === module.id)
          .sort((a, b) => a.order - b.order);
        
        const assessment = Array.from(this.assessmentsMap.values())
          .find(assessment => assessment.moduleId === module.id);
        
        return {
          ...module,
          lessons,
          assessment
        };
      })
    );
  }

  async getModuleById(id: number): Promise<any | undefined> {
    return this.modulesMap.get(id);
  }

  async getLessonById(id: number): Promise<any | undefined> {
    const lesson = this.lessonsMap.get(id);
    if (!lesson) return undefined;
    
    const module = await this.getModuleById(lesson.moduleId);
    return {
      ...lesson,
      moduleTitle: module?.title
    };
  }

  async getEnrollment(userId: number, courseId: number): Promise<any | undefined> {
    return this.enrollmentsMap.get(`${userId}_${courseId}`);
  }

  async createEnrollment(data: any): Promise<any> {
    const id = this.currentId++;
    const enrollment = {
      ...data,
      id,
      enrolledAt: new Date().toISOString()
    };
    
    this.enrollmentsMap.set(`${data.userId}_${data.courseId}`, enrollment);
    return enrollment;
  }

  async getCourseProgress(userId: number, courseId: number): Promise<any> {
    const enrollment = await this.getEnrollment(userId, courseId);
    if (!enrollment) {
      return {
        percentage: 0,
        completedLessons: [],
        completedAssessments: []
      };
    }
    
    // Get completed lessons
    const modules = await this.getCourseModules(courseId);
    const lessonIds = modules.flatMap(module => 
      module.lessons.map((lesson: any) => lesson.id)
    );
    
    const completedLessons = lessonIds.filter(lessonId => {
      const progressKey = `${userId}_${lessonId}`;
      const progress = this.lessonProgressMap.get(progressKey);
      return progress && progress.status === 'completed';
    });
    
    // Get completed assessments
    const assessmentIds = modules
      .filter(module => module.assessment)
      .map(module => module.assessment.id);
    
    const completedAssessments = assessmentIds.filter(assessmentId => {
      const attemptKey = `${userId}_${assessmentId}`;
      const attempt = this.assessmentAttemptsMap.get(attemptKey);
      return attempt && attempt.passed;
    });
    
    // Calculate percentage
    const totalItems = lessonIds.length + assessmentIds.length;
    const completedItems = completedLessons.length + completedAssessments.length;
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    return {
      percentage,
      completedLessons,
      completedAssessments
    };
  }

  async updateCourseProgress(userId: number, moduleId: number): Promise<any> {
    const module = await this.getModuleById(moduleId);
    if (!module) {
      throw new Error(`Module with ID ${moduleId} not found`);
    }
    
    const enrollment = await this.getEnrollment(userId, module.courseId);
    if (!enrollment) {
      throw new Error(`Enrollment not found for user ${userId} and course ${module.courseId}`);
    }
    
    // Calculate new progress percentage
    const progress = await this.getCourseProgress(userId, module.courseId);
    
    // Update enrollment
    const updatedEnrollment = {
      ...enrollment,
      progress: progress.percentage,
      updatedAt: new Date().toISOString()
    };
    
    this.enrollmentsMap.set(`${userId}_${module.courseId}`, updatedEnrollment);
    return updatedEnrollment;
  }

  async getLessonProgress(userId: number, lessonId: number): Promise<any | undefined> {
    return this.lessonProgressMap.get(`${userId}_${lessonId}`);
  }

  async updateLessonProgress(data: any): Promise<any> {
    const key = `${data.userId}_${data.lessonId}`;
    const existingProgress = this.lessonProgressMap.get(key);
    
    const progress = {
      ...(existingProgress || {}),
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    this.lessonProgressMap.set(key, progress);
    return progress;
  }

  async getCourseAssessments(courseId: number): Promise<any[]> {
    const modules = await this.getCourseModules(courseId);
    const assessments = modules
      .filter(module => module.assessment)
      .map(module => module.assessment);
    
    return Promise.all(
      assessments.map(async assessment => {
        const questions = await this.getAssessmentQuestions(assessment.id);
        return {
          ...assessment,
          questions
        };
      })
    );
  }

  async getAssessmentById(id: number): Promise<any | undefined> {
    return this.assessmentsMap.get(id);
  }

  async getAssessmentQuestions(assessmentId: number): Promise<any[]> {
    return Array.from(this.questionsMap.values())
      .filter(question => question.assessmentId === assessmentId)
      .sort((a, b) => a.order - b.order);
  }

  async createAssessmentAttempt(data: any): Promise<any> {
    const id = this.currentId++;
    const attempt = {
      ...data,
      id,
      startedAt: new Date().toISOString()
    };
    
    this.assessmentAttemptsMap.set(`${data.userId}_${data.assessmentId}`, attempt);
    return attempt;
  }

  async checkAllAssessmentsPassed(userId: number, courseId: number): Promise<boolean> {
    const modules = await this.getCourseModules(courseId);
    const assessments = modules
      .filter(module => module.assessment)
      .map(module => module.assessment);
    
    // If no assessments, consider it passed
    if (assessments.length === 0) {
      return true;
    }
    
    // Check if all assessments are passed
    for (const assessment of assessments) {
      const attemptKey = `${userId}_${assessment.id}`;
      const attempt = this.assessmentAttemptsMap.get(attemptKey);
      
      if (!attempt || !attempt.passed) {
        return false;
      }
    }
    
    return true;
  }

  async getUserCertificates(userId: number): Promise<any[]> {
    const certificates = Array.from(this.certificatesMap.values())
      .filter(cert => cert.userId === userId);
    
    return Promise.all(
      certificates.map(async cert => {
        const course = await this.getCourseById(cert.courseId);
        const user = await this.getUser(cert.userId);
        
        return {
          ...cert,
          courseName: course?.title || "Unknown Course",
          userName: user?.fullName || "Unknown User"
        };
      })
    );
  }

  async getCertificateById(id: string): Promise<any | undefined> {
    const cert = this.certificatesMap.get(id);
    if (!cert) return undefined;
    
    const course = await this.getCourseById(cert.courseId);
    const user = await this.getUser(cert.userId);
    
    return {
      ...cert,
      courseName: course?.title || "Unknown Course",
      userName: user?.fullName || "Unknown User"
    };
  }

  async createCertificate(data: any): Promise<any> {
    const certificate = {
      ...data,
      issuedAt: new Date().toISOString()
    };
    
    this.certificatesMap.set(data.certificateId, certificate);
    return certificate;
  }

  async getAllForumThreads(): Promise<any[]> {
    return Array.from(this.forumThreadsMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRecentForumThreads(): Promise<any[]> {
    return Array.from(this.forumThreadsMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  async getCourseForumThreads(courseId: number): Promise<any[]> {
    return Array.from(this.forumThreadsMap.values())
      .filter(thread => thread.courseId === courseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getForumThreadById(id: number): Promise<any | undefined> {
    return this.forumThreadsMap.get(id);
  }

  async createForumThread(data: any): Promise<any> {
    const id = this.currentId++;
    const now = new Date().toISOString();
    
    // Get course name
    const course = await this.getCourseById(data.courseId);
    
    const thread = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      courseName: course?.title || "Unknown Course",
      replyCount: 0
    };
    
    this.forumThreadsMap.set(id, thread);
    return thread;
  }

  async updateForumThreadVotes(id: number, increment: number): Promise<any> {
    const thread = await this.getForumThreadById(id);
    if (!thread) {
      throw new Error(`Thread with ID ${id} not found`);
    }
    
    const updatedThread = {
      ...thread,
      votes: thread.votes + increment,
      updatedAt: new Date().toISOString()
    };
    
    this.forumThreadsMap.set(id, updatedThread);
    return updatedThread;
  }

  async getLeaderboard(timeFrame: string, domain: string, currentUserId?: number): Promise<any> {
    // Filter users by domain if specified
    let filteredUsers = Array.from(this.usersMap.values());
    if (domain !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.domain === domain);
    }
    
    // Sort by XP points
    const sortedUsers = filteredUsers
      .sort((a, b) => (b.xpPoints || 0) - (a.xpPoints || 0));
    
    // Get top 10 users
    const rankings = sortedUsers.slice(0, 10).map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      fullName: user.fullName,
      branch: user.branch,
      avatarUrl: user.avatarUrl,
      xpPoints: user.xpPoints || 0,
      badgesCount: 2 // Mocked badge count
    }));
    
    // Get current user ranking if requested
    let userRanking = null;
    if (currentUserId) {
      const userIndex = sortedUsers.findIndex(user => user.id === currentUserId);
      if (userIndex !== -1) {
        userRanking = {
          rank: userIndex + 1,
          badgesCount: 2 // Mocked badge count
        };
      }
    }
    
    return {
      rankings,
      userRanking,
      timeFrame,
      domain
    };
  }

  async getLearningPathByDomain(domain: string): Promise<any | undefined> {
    return Array.from(this.learningPathsMap.values())
      .find(path => path.domain === domain);
  }

  async getLearningPathWithSteps(pathId: number): Promise<any> {
    const path = await this.learningPathsMap.get(pathId);
    if (!path) {
      throw new Error(`Learning path with ID ${pathId} not found`);
    }
    
    const steps = Array.from(this.learningPathStepsMap.values())
      .filter(step => step.pathId === pathId)
      .sort((a, b) => a.order - b.order);
    
    const stepsWithCourses = await Promise.all(
      steps.map(async step => {
        const course = await this.getCourseById(step.courseId);
        return {
          ...step,
          course
        };
      })
    );
    
    return {
      ...path,
      steps: stepsWithCourses
    };
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // This would use the Drizzle ORM with actual database queries
  // For the prototype, we'll use the MemStorage implementation
  memStorage = new MemStorage();

  async getUser(id: number): Promise<User | undefined> {
    return this.memStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.memStorage.getUserByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.memStorage.getUserByEmail(email);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return this.memStorage.getUserByGoogleId(googleId);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.memStorage.createUser(user);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return this.memStorage.updateUser(id, data);
  }

  async incrementUserXP(id: number, amount: number): Promise<User> {
    return this.memStorage.incrementUserXP(id, amount);
  }

  async getAllCourses(): Promise<any[]> {
    return this.memStorage.getAllCourses();
  }

  async getCourseById(id: number): Promise<any | undefined> {
    return this.memStorage.getCourseById(id);
  }

  async getUserEnrolledCourses(userId: number): Promise<any[]> {
    return this.memStorage.getUserEnrolledCourses(userId);
  }

  async getRecommendedCourses(domain?: string): Promise<any[]> {
    return this.memStorage.getRecommendedCourses(domain);
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

// Export the storage instance using MemStorage for now
import { db } from "./db";
import { count, eq, and, or, desc, asc, like, lt, gt, gte, not, isNull, inArray } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email.split('@')[0], username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return updatedUser;
  }

  async incrementUserXP(id: number, amount: number): Promise<User> {
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
  }

  // For now, we'll use the MemStorage for other operations
  private memStorage = new MemStorage();

  async getAllCourses(): Promise<any[]> {
    return this.memStorage.getAllCourses();
  }

  async getCourseById(id: number): Promise<any | undefined> {
    return this.memStorage.getCourseById(id);
  }

  async getUserEnrolledCourses(userId: number): Promise<any[]> {
    return this.memStorage.getUserEnrolledCourses(userId);
  }

  async getRecommendedCourses(domain?: string): Promise<any[]> {
    return this.memStorage.getRecommendedCourses(domain);
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

// Use the Database Storage implementation
export const storage = new DatabaseStorage();
