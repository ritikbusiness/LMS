import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuthRoutes } from "./auth";
import { generateCertificate } from "./certificates";
import passport from "passport";
import session from "express-session";
import { randomUUID } from "crypto";
import memorystore from "memorystore";
import { eq, and, desc, asc } from "drizzle-orm";
import { z } from "zod";
import {
  users,
  courses,
  modules,
  lessons,
  enrollments,
  lessonProgress,
  assessments,
  questions,
  assessmentAttempts,
  certificates,
  forumThreads,
  forumReplies,
  badges,
  userBadges,
  payments,
  learningPaths,
  learningPathSteps,
  insertEnrollmentSchema,
  insertForumThreadSchema,
  insertForumReplySchema,
  insertLessonProgressSchema,
  insertAssessmentAttemptSchema,
  insertCertificateSchema,
} from "@shared/schema";

// Create memory store for sessions
const MemoryStore = memorystore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      secret: process.env.SESSION_SECRET || randomUUID(),
      resave: false,
      saveUninitialized: false
    })
  );

  // Initialize passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up authentication routes
  setupAuthRoutes(app);

  // Middleware to check if user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // ========== API ROUTES ==========

  // User Routes
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    // User data is attached to req.user by passport
    res.json(req.user);
  });

  app.post("/api/users/onboarding", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;

      // Update user profile with onboarding data
      const updatedUser = await storage.updateUser(user.id, {
        fullName: req.body.fullName,
        branch: req.body.branch,
        year: req.body.year,
        domain: req.body.domain,
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Onboarding error:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Course Routes
  // Get all courses with optional filters (domain, status)
  app.get("/api/courses", async (req, res) => {
    try {
      const domain = req.query.domain as string | undefined;
      const status = req.query.status as string | undefined;
      
      // Get all courses
      const courses = await storage.getAllCourses();
      
      // Apply filters
      let filteredCourses = courses;
      if (domain) {
        filteredCourses = filteredCourses.filter(course => course.domain === domain);
      }
      
      if (status) {
        filteredCourses = filteredCourses.filter(course => course.status === status);
      }
      
      res.json(filteredCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/enrolled", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const enrolledCourses = await storage.getUserEnrolledCourses(user.id);
      res.json(enrolledCourses);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      res.status(500).json({ message: "Failed to fetch enrolled courses" });
    }
  });

  app.get("/api/courses/recommended", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      // Get recommended courses based on user's domain
      const recommendedCourses = await storage.getRecommendedCourses(user.domain);
      res.json(recommendedCourses);
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
      res.status(500).json({ message: "Failed to fetch recommended courses" });
    }
  });

  // Get course by ID
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourseById(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Get detailed info with modules if requested
      if (req.query.detailed === "true") {
        const modules = await storage.getCourseModules(courseId);
        return res.json({
          ...course,
          modules
        });
      }
      
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });
  
  // Create new course (instructors only)
  app.post("/api/courses", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Check if user is an instructor
      if (user.role !== "instructor" && user.role !== "admin") {
        return res.status(403).json({ message: "Only instructors can create courses" });
      }
      
      // Validate and create course with user as instructor
      const courseData = {
        ...req.body,
        instructorId: user.id
      };
      
      const newCourse = await storage.createCourse(courseData);
      res.status(201).json(newCourse);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });
  
  // Test endpoint to create a course (development only)
  app.post("/api/test/courses", async (req, res) => {
    try {
      // Create a sample course for testing
      const courseData = {
        title: req.body.title || "Sample Course",
        description: req.body.description || "This is a sample course for testing purposes.",
        domain: req.body.domain || "DevOps",
        instructorId: 1, // Assume instructor ID 1
        thumbnailUrl: req.body.thumbnailUrl || "https://placehold.co/600x400?text=Sample",
        price: req.body.price || 0,
        status: req.body.status || "published"
      };
      
      const newCourse = await storage.createCourse(courseData);
      res.status(201).json(newCourse);
    } catch (error) {
      console.error("Error creating test course:", error);
      res.status(500).json({ message: "Failed to create test course" });
    }
  });
  
  // Update course (instructors only)
  app.put("/api/courses/:id", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const courseId = parseInt(req.params.id);
      
      // Get course
      const course = await storage.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if user is the course instructor or an admin
      if (course.instructorId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "You don't have permission to update this course" });
      }
      
      // Update course
      const updatedCourse = await storage.updateCourse(courseId, req.body);
      res.json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  });
  
  // Delete course (instructors only)
  app.delete("/api/courses/:id", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const courseId = parseInt(req.params.id);
      
      // Get course
      const course = await storage.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if user is the course instructor or an admin
      if (course.instructorId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "You don't have permission to delete this course" });
      }
      
      // Check if course has enrollments
      const hasEnrollments = await storage.courseHasEnrollments(courseId);
      if (hasEnrollments) {
        // Instead of deleting, archive the course if it has enrollments
        await storage.updateCourse(courseId, { status: "archived" });
        return res.json({ message: "Course archived successfully" });
      }
      
      // Delete course
      await storage.deleteCourse(courseId);
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });
  
  // Get instructor courses
  app.get("/api/instructor/courses", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Check if user is an instructor
      if (user.role !== "instructor" && user.role !== "admin") {
        return res.status(403).json({ message: "Only instructors can access this endpoint" });
      }
      
      const instructorCourses = await storage.getInstructorCourses(user.id);
      res.json(instructorCourses);
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      res.status(500).json({ message: "Failed to fetch instructor courses" });
    }
  });

  app.get("/api/courses/:id/modules", async (req, res) => {
    try {
      const courseModules = await storage.getCourseModules(parseInt(req.params.id));
      res.json(courseModules);
    } catch (error) {
      console.error("Error fetching course modules:", error);
      res.status(500).json({ message: "Failed to fetch course modules" });
    }
  });

  app.post("/api/courses/:id/enroll", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const courseId = parseInt(req.params.id);

      // Check if course exists
      const course = await storage.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Check if user is already enrolled
      const existingEnrollment = await storage.getEnrollment(user.id, courseId);
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      // Create enrollment
      const enrollmentData = {
        userId: user.id,
        courseId: courseId,
        progress: 0,
        isActive: true
      };

      const enrollment = await storage.createEnrollment(enrollmentData);
      
      // Award XP for enrollment
      await storage.incrementUserXP(user.id, 10);

      res.json(enrollment);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  app.get("/api/courses/:id/progress", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const courseId = parseInt(req.params.id);

      const progress = await storage.getCourseProgress(user.id, courseId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching course progress:", error);
      res.status(500).json({ message: "Failed to fetch course progress" });
    }
  });

  app.get("/api/courses/:id/assessments", requireAuth, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const assessments = await storage.getCourseAssessments(courseId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching course assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  // Lesson Routes
  app.get("/api/lessons/:id", requireAuth, async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLessonById(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  app.get("/api/lessons/:id/materials", requireAuth, async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLessonById(lessonId);
      
      if (!lesson || !lesson.materials) {
        return res.json([]);
      }
      
      res.json(lesson.materials);
    } catch (error) {
      console.error("Error fetching lesson materials:", error);
      res.status(500).json({ message: "Failed to fetch lesson materials" });
    }
  });

  app.post("/api/lessons/:id/progress", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const lessonId = parseInt(req.params.id);
      const { watchTime, completed } = req.body;

      // Validate request body
      if (typeof watchTime !== 'number') {
        return res.status(400).json({ message: "Watch time must be a number" });
      }

      // Get lesson to find its course
      const lesson = await storage.getLessonById(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Update or create lesson progress
      const progressData = {
        userId: user.id,
        lessonId: lessonId,
        status: completed ? 'completed' : 'in_progress',
        watchTime: watchTime
      };

      if (completed) {
        progressData.completedAt = new Date().toISOString();
        
        // Award XP for completing a lesson
        await storage.incrementUserXP(user.id, 25);

        // Update course progress
        await storage.updateCourseProgress(user.id, lesson.moduleId);
      }

      const progress = await storage.updateLessonProgress(progressData);
      
      res.json(progress);
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      res.status(500).json({ message: "Failed to update lesson progress" });
    }
  });

  // Assessment Routes
  app.post("/api/assessments/:id/submit", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const assessmentId = parseInt(req.params.id);
      const { answers } = req.body;

      // Validate answers
      if (!answers || typeof answers !== 'object') {
        return res.status(400).json({ message: "Invalid answers format" });
      }

      // Get assessment
      const assessment = await storage.getAssessmentById(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Get questions for this assessment
      const assessmentQuestions = await storage.getAssessmentQuestions(assessmentId);
      if (!assessmentQuestions.length) {
        return res.status(500).json({ message: "No questions found for this assessment" });
      }

      // Grade assessment
      let correctAnswers = 0;
      for (const question of assessmentQuestions) {
        if (answers[question.id] === question.correctOption) {
          correctAnswers++;
        }
      }

      const score = Math.round((correctAnswers / assessmentQuestions.length) * 100);
      const passed = score >= assessment.passingScore;

      // Save attempt
      const attemptData = {
        userId: user.id,
        assessmentId: assessmentId,
        score: score,
        answers: answers,
        passed: passed,
        completedAt: new Date().toISOString()
      };

      await storage.createAssessmentAttempt(attemptData);

      // Award XP if passed
      if (passed) {
        await storage.incrementUserXP(user.id, 50);
        
        // Get the module to find its course
        const module = await storage.getModuleById(assessment.moduleId);
        if (module) {
          // Check if all assessments for this course are passed
          const allAssessmentsPassed = await storage.checkAllAssessmentsPassed(user.id, module.courseId);
          
          // If all passed, generate certificate
          if (allAssessmentsPassed) {
            const course = await storage.getCourseById(module.courseId);
            if (course) {
              await generateCertificate(user, course);
              
              // Award bonus XP for course completion
              await storage.incrementUserXP(user.id, 200);
            }
          }
        }
      }

      res.json({ score, passed });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      res.status(500).json({ message: "Failed to submit assessment" });
    }
  });

  // Forum Routes
  app.get("/api/forum/threads", async (req, res) => {
    try {
      const threads = await storage.getAllForumThreads();
      res.json(threads);
    } catch (error) {
      console.error("Error fetching forum threads:", error);
      res.status(500).json({ message: "Failed to fetch forum threads" });
    }
  });

  app.get("/api/forum/recent", async (req, res) => {
    try {
      const recentThreads = await storage.getRecentForumThreads();
      res.json(recentThreads);
    } catch (error) {
      console.error("Error fetching recent forum threads:", error);
      res.status(500).json({ message: "Failed to fetch recent forum threads" });
    }
  });

  app.get("/api/courses/:id/forum", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const threads = await storage.getCourseForumThreads(courseId);
      res.json(threads);
    } catch (error) {
      console.error("Error fetching course forum threads:", error);
      res.status(500).json({ message: "Failed to fetch course forum threads" });
    }
  });

  app.post("/api/forum/threads", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { title, content, courseId } = req.body;

      // Validate request body
      const threadData = {
        title,
        content,
        userId: user.id,
        courseId,
        status: 'open',
        votes: 0
      };

      const thread = await storage.createForumThread(threadData);
      
      // Award XP for creating a thread
      await storage.incrementUserXP(user.id, 5);
      
      res.json(thread);
    } catch (error) {
      console.error("Error creating forum thread:", error);
      res.status(500).json({ message: "Failed to create forum thread" });
    }
  });

  app.post("/api/forum/threads/:id/vote", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const threadId = parseInt(req.params.id);
      const { direction } = req.body;

      if (direction !== 'up' && direction !== 'down') {
        return res.status(400).json({ message: "Direction must be 'up' or 'down'" });
      }

      const thread = await storage.getForumThreadById(threadId);
      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }

      // Prevent voting on own thread
      if (thread.userId === user.id) {
        return res.status(400).json({ message: "Cannot vote on your own thread" });
      }

      // Update votes
      const increment = direction === 'up' ? 1 : -1;
      const updatedThread = await storage.updateForumThreadVotes(threadId, increment);
      
      // Award XP to thread creator for upvote
      if (direction === 'up') {
        await storage.incrementUserXP(thread.userId, 2);
      }
      
      res.json(updatedThread);
    } catch (error) {
      console.error("Error voting on thread:", error);
      res.status(500).json({ message: "Failed to vote on thread" });
    }
  });

  // Certificate Routes
  app.get("/api/certificates", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const userCertificates = await storage.getUserCertificates(user.id);
      res.json(userCertificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      res.status(500).json({ message: "Failed to fetch certificates" });
    }
  });

  app.get("/api/certificates/:id", async (req, res) => {
    try {
      const certificateId = req.params.id;
      const certificate = await storage.getCertificateById(certificateId);
      
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      
      res.json(certificate);
    } catch (error) {
      console.error("Error fetching certificate:", error);
      res.status(500).json({ message: "Failed to fetch certificate" });
    }
  });

  // Leaderboard Routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const timeFrame = req.query.timeFrame as string || 'weekly';
      const domain = req.query.domain as string || 'all';
      const userId = req.user ? (req.user as any).id : null;
      
      const leaderboard = await storage.getLeaderboard(timeFrame, domain, userId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Learning Path Routes
  app.get("/api/learning-paths/:domain", async (req, res) => {
    try {
      const domain = req.params.domain;
      const path = await storage.getLearningPathByDomain(domain);
      
      if (!path) {
        return res.status(404).json({ message: "Learning path not found" });
      }
      
      // Get steps with course details
      const pathWithSteps = await storage.getLearningPathWithSteps(path.id);
      res.json(pathWithSteps);
    } catch (error) {
      console.error("Error fetching learning path:", error);
      res.status(500).json({ message: "Failed to fetch learning path" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
