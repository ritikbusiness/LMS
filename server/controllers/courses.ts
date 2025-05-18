import { Request, Response } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { insertCourseSchema } from "@shared/schema";

// Validation schema for course creation/update
const courseValidationSchema = insertCourseSchema
  .extend({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    domain: z.enum(["DevOps", "MERN", "AI", "CyberSecurity", "BDE", "DigitalMarketing"]),
    price: z.number().min(0, "Price cannot be negative").default(0),
    thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
  });

// Get all courses (with optional domain filter)
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const domain = req.query.domain as string | undefined;
    const status = req.query.status as string | undefined;
    
    const courses = await storage.getAllCourses();
    
    // Filter by domain if provided
    let filteredCourses = courses;
    if (domain) {
      filteredCourses = filteredCourses.filter(course => course.domain === domain);
    }
    
    // Filter by status if provided
    if (status) {
      filteredCourses = filteredCourses.filter(course => course.status === status);
    }
    
    res.json(filteredCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await storage.getCourseById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    // Get course modules if detailed view is requested
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
};

// Create new course (instructors only)
export const createCourse = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    
    // Check if user is an instructor
    if (user.role !== "instructor" && user.role !== "admin") {
      return res.status(403).json({ message: "Only instructors can create courses" });
    }
    
    // Validate request body
    const validatedData = courseValidationSchema.parse({
      ...req.body,
      instructorId: user.id,
    });
    
    // Create course
    const newCourse = await storage.createCourse(validatedData);
    
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Failed to create course" });
  }
};

// Update course (instructors only)
export const updateCourse = async (req: Request, res: Response) => {
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
    
    // Validate request body (partial update)
    const validatedData = courseValidationSchema.partial().parse(req.body);
    
    // Update course
    const updatedCourse = await storage.updateCourse(courseId, validatedData);
    
    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Failed to update course" });
  }
};

// Delete course (instructors only)
export const deleteCourse = async (req: Request, res: Response) => {
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
};

// Get instructor courses
export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    
    // Check if user is an instructor
    if (user.role !== "instructor" && user.role !== "admin") {
      return res.status(403).json({ message: "Only instructors can access this endpoint" });
    }
    
    const courses = await storage.getInstructorCourses(user.id);
    
    res.json(courses);
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    res.status(500).json({ message: "Failed to fetch instructor courses" });
  }
};