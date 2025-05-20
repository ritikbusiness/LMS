import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, pgEnum, date, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum definitions
export const userRoleEnum = pgEnum('user_role', [
  'student', 
  'instructor', 
  'admin', 
  'sub_admin', 
  'moderator', 
  'support_agent', 
  'university_partner'
]);

export const courseStatusEnum = pgEnum('course_status', [
  'draft', 
  'under_review',
  'changes_requested',
  'published', 
  'featured',
  'archived'
]);

export const domainEnum = pgEnum('domain', [
  'Software_Development',
  'Data_Analytics', 
  'Cloud_DevOps',
  'Networking_Security',
  'AI_ML', 
  'Database_Management',
  'Web_Development',
  'IT_Support',
  'Software_Testing',
  'Hardware_Embedded',
  'Blockchain',
  'Research_Development',
  'Project_Management',
  'Sales_Marketing',
  'Education_Training'
]);

export const subDomainEnum = pgEnum('sub_domain', [
  'Frontend', 
  'Backend', 
  'FullStack', 
  'Mobile_Dev', 
  'Game_Dev', 
  'Embedded',
  'Data_Scientist', 
  'Data_Analyst', 
  'Data_Engineer', 
  'BI_Analyst', 
  'Machine_Learning',
  'AWS', 
  'Azure', 
  'GCP', 
  'DevOps', 
  'CICD', 
  'Docker', 
  'Kubernetes', 
  'SRE', 
  'Cloud_Architect',
  'Network_Engineer', 
  'Cybersecurity', 
  'Ethical_Hacker', 
  'SysAdmin',
  'NLP', 
  'Computer_Vision', 
  'AI_Research', 
  'ML_Engineer',
  'DBA', 
  'Big_Data', 
  'Database_Architect',
  'Web_Developer', 
  'UI_UX', 
  'Web_Designer',
  'Help_Desk', 
  'Support_Engineer',
  'QA', 
  'Manual_Testing', 
  'Automation_Testing',
  'IoT', 
  'Hardware_Engineer',
  'Crypto_Analyst', 
  'Smart_Contract_Developer',
  'Research_Engineer', 
  'Computer_Scientist',
  'Project_Manager', 
  'Product_Manager', 
  'Scrum_Master', 
  'Agile_Coach',
  'Digital_Marketing', 
  'Business_Development', 
  'Tech_Sales',
  'Technical_Trainer', 
  'Content_Developer',
]);

export const accessLevelEnum = pgEnum('access_level', [
  'full', 
  'restricted', 
  'read_only',
  'specific'
]);

export const assessmentTypeEnum = pgEnum('assessment_type', [
  'mcq', 
  'subjective', 
  'coding', 
  'project', 
  'presentation'
]);

export const threadStatusEnum = pgEnum('thread_status', [
  'open', 
  'answered', 
  'solved', 
  'closed',
  'flagged'
]);

export const contentTypeEnum = pgEnum('content_type', [
  'video', 
  'pdf', 
  'presentation', 
  'code', 
  'quiz', 
  'assignment',
  'lab', 
  'project'
]);

export const jobTypeEnum = pgEnum('job_type', [
  'full_time', 
  'part_time', 
  'internship', 
  'contract', 
  'freelance'
]);

export const experienceLevelEnum = pgEnum('experience_level', [
  'entry', 
  'junior', 
  'mid', 
  'senior', 
  'lead'
]);

export const ticketStatusEnum = pgEnum('ticket_status', [
  'open', 
  'assigned', 
  'in_progress', 
  'resolved', 
  'closed'
]);

export const ticketCategoryEnum = pgEnum('ticket_category', [
  'payment', 
  'technical', 
  'content', 
  'account', 
  'other'
]);

export const presentationCriteriaEnum = pgEnum('presentation_criteria', [
  'eye_contact', 
  'voice_modulation', 
  'content_quality', 
  'slide_design', 
  'time_management',
  'filler_words', 
  'body_language', 
  'q_a_handling'
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'course_update', 
  'forum_reply', 
  'achievement', 
  'reminder', 
  'system',
  'payment', 
  'promotional'
]);

// Users & Authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default('student'),
  googleId: text("google_id").unique(),
  passwordHash: text("password_hash"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  college: text("college"),
  branch: text("branch"),
  year: text("year"),
  domain: domainEnum("domain"),
  subDomain: subDomainEnum("sub_domain"),
  linkedin: text("linkedin_url"),
  github: text("github_url"),
  twitter: text("twitter_url"),
  portfolio: text("portfolio_url"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zipCode: text("zip_code"),
  dateOfBirth: date("date_of_birth"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  xpPoints: integer("xp_points").default(0),
  level: integer("level").default(1),
  stripeCustomerId: text("stripe_customer_id"),
  razorpayCustomerId: text("razorpay_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  preferences: jsonb("preferences").default({}),
  achievements: jsonb("achievements").default({}),
  skills: jsonb("skills").default([]),
  metadata: jsonb("metadata").default({}),
});

// Admin Panel Users
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  role: userRoleEnum("role").notNull(),
  accessLevel: accessLevelEnum("access_level").notNull().default('restricted'),
  permissions: jsonb("permissions").notNull(),
  departmentId: integer("department_id"),
  supervisorId: integer("supervisor_id"),
  allowedActions: jsonb("allowed_actions").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by"),
  lastActive: timestamp("last_active"),
  notes: text("notes"),
});

// Admin Activity Logs
export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: integer("entity_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// University Partners
export const universityPartners = pgTable("university_partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  domain: text("domain").notNull().unique(),
  logoUrl: text("logo_url"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  agreementStartDate: date("agreement_start_date"),
  agreementEndDate: date("agreement_end_date"),
  status: text("status").default('active'),
  commissionRate: real("commission_rate"),
  revenueShare: real("revenue_share"),
  students: integer("students").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  settings: jsonb("settings").default({}),
});

// Instructors
export const instructors = pgTable("instructors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  specialization: text("specialization"),
  expertise: jsonb("expertise").default([]),
  bio: text("bio"),
  headline: text("headline"),
  languages: jsonb("languages").default([]),
  yearsOfExperience: integer("years_of_experience"),
  rating: real("rating"),
  totalStudents: integer("total_students").default(0),
  totalCourses: integer("total_courses").default(0),
  socialLinks: jsonb("social_links").default({}),
  isVerified: boolean("is_verified").default(false),
  applicationStatus: text("application_status").default('pending'),
  documents: jsonb("documents").default([]),
  educationDetails: jsonb("education_details").default([]),
  workExperience: jsonb("work_experience").default([]),
  bankDetails: jsonb("bank_details"),
  taxInfo: jsonb("tax_info"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Instructor Earnings
export const instructorEarnings = pgTable("instructor_earnings", {
  id: serial("id").primaryKey(),
  instructorId: integer("instructor_id").notNull(),
  amount: real("amount").notNull(),
  courseId: integer("course_id"),
  paymentId: integer("payment_id"),
  commissionRate: real("commission_rate"),
  netAmount: real("net_amount"),
  currency: text("currency").default('USD'),
  status: text("status").default('pending'), // pending, processed, failed
  processingDate: timestamp("processing_date"),
  transactionId: text("transaction_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  subtitle: text("subtitle"),
  description: text("description").notNull(),
  domain: domainEnum("domain").notNull(),
  subDomain: subDomainEnum("sub_domain"),
  instructorId: integer("instructor_id").notNull(),
  coInstructors: jsonb("co_instructors").default([]),
  thumbnailUrl: text("thumbnail_url"),
  previewVideoUrl: text("preview_video_url"),
  price: real("price").default(0),
  salePrice: real("sale_price"),
  isActive: boolean("is_active").default(true),
  status: courseStatusEnum("status").default('draft'),
  reviewNotes: text("review_notes"),
  reviewedBy: integer("reviewed_by"),
  totalModules: integer("total_modules").default(0),
  totalLessons: integer("total_lessons").default(0),
  totalDuration: integer("total_duration").default(0), // in seconds
  averageRating: real("average_rating"),
  totalReviews: integer("total_reviews").default(0),
  totalEnrollments: integer("total_enrollments").default(0),
  completionRate: real("completion_rate"),
  difficultyLevel: text("difficulty_level").default('beginner'),
  learningOutcomes: jsonb("learning_outcomes").default([]),
  prerequisites: jsonb("prerequisites").default([]),
  targetAudience: jsonb("target_audience").default([]),
  whatYouWillLearn: jsonb("what_you_will_learn").default([]),
  keywords: jsonb("keywords").default([]),
  language: text("language").default('English'),
  certificateEnabled: boolean("certificate_enabled").default(true),
  forumEnabled: boolean("forum_enabled").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
  featuredAt: timestamp("featured_at"),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Modules (sections of a course)
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  duration: integer("duration").default(0), // total duration in seconds
  totalLessons: integer("total_lessons").default(0),
  isPublished: boolean("is_published").default(false),
  completionRequirements: jsonb("completion_requirements").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lessons (content items in a module)
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  contentType: contentTypeEnum("content_type").notNull(),
  videoUrl: text("video_url"),
  videoDuration: integer("video_duration"), // in seconds
  transcriptUrl: text("transcript_url"),
  subtitlesUrl: text("subtitles_url"),
  order: integer("order").notNull(),
  isPreview: boolean("is_preview").default(false),
  isPublished: boolean("is_published").default(true),
  materials: jsonb("materials").default([]), // links to downloadable materials
  content: jsonb("content").default({}), // structured content in JSON
  nextLessonId: integer("next_lesson_id"),
  previewImageUrl: text("preview_image_url"),
  engagementMetrics: jsonb("engagement_metrics").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Resources (attachments for lessons)
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size"), // in bytes
  order: integer("order").default(0),
  isDownloadable: boolean("is_downloadable").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Video Captions/Subtitles
export const captions = pgTable("captions", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  language: text("language").notNull(),
  fileUrl: text("file_url").notNull(),
  isAutoGenerated: boolean("is_auto_generated").default(false),
  format: text("format").default('vtt'), // vtt, srt
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  paymentId: integer("payment_id"),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  progress: integer("progress").default(0), // percentage of completion
  lastAccessedAt: timestamp("last_accessed_at"),
  currentModuleId: integer("current_module_id"),
  currentLessonId: integer("current_lesson_id"),
  certificateId: text("certificate_id"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  platform: text("platform").default('web'), // web, mobile, api
  notes: text("notes"),
  metadata: jsonb("metadata").default({}),
});

// Progress tracking
export const lessonProgress = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  enrollmentId: integer("enrollment_id"),
  status: text("status").default('not_started'), // not_started, in_progress, completed
  watchTime: integer("watch_time").default(0), // in seconds
  watchPercent: integer("watch_percent").default(0), // 0-100
  startPosition: integer("start_position").default(0), // video position in seconds
  lastPosition: integer("last_position").default(0), // video position in seconds
  completedAt: timestamp("completed_at"),
  lastUpdatedAt: timestamp("last_updated_at").defaultNow(),
  viewCount: integer("view_count").default(0),
  device: text("device"),
  notes: text("notes"),
});

// Assessments
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  moduleId: integer("module_id"),
  title: text("title").notNull(),
  description: text("description"),
  type: assessmentTypeEnum("type").default('mcq'),
  timeLimit: integer("time_limit"), // in minutes, null for untimed
  passingScore: integer("passing_score").default(70), // percentage needed to pass
  maxAttempts: integer("max_attempts").default(3),
  randomizeQuestions: boolean("randomize_questions").default(false),
  showAnswers: boolean("show_answers").default(true),
  totalQuestions: integer("total_questions").default(0),
  totalPoints: integer("total_points").default(0),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  tags: jsonb("tags").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assessment questions
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  text: text("text").notNull(),
  type: text("type").default('mcq'), // mcq, truefalse, subjective, coding
  options: jsonb("options").default([]), // array of options for MCQs
  correctOption: integer("correct_option"), // index of correct option for MCQs
  correctAnswer: text("correct_answer"), // for non-MCQs
  explanation: text("explanation"),
  points: integer("points").default(1),
  difficulty: text("difficulty").default('medium'),
  order: integer("order").notNull(),
  mediaUrl: text("media_url"), // image or video url
  isActive: boolean("is_active").default(true),
  metadata: jsonb("metadata").default({}),
});

// User assessment attempts
export const assessmentAttempts = pgTable("assessment_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assessmentId: integer("assessment_id").notNull(),
  enrollmentId: integer("enrollment_id"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  score: integer("score"), // percentage score
  answers: jsonb("answers").default([]), // user's answers
  passed: boolean("passed"),
  timeTaken: integer("time_taken"), // in seconds
  attemptNumber: integer("attempt_number").default(1),
  reviewedBy: integer("reviewed_by"), // for subjective assessments
  reviewedAt: timestamp("reviewed_at"),
  feedback: text("feedback"),
  detailedResults: jsonb("detailed_results").default({}),
  ipAddress: text("ip_address"),
  device: text("device"),
  flags: jsonb("flags").default([]), // for potential cheating or suspicious activity
});

// Certificates
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  certificateId: uuid("certificate_id").notNull().unique(), // unique identifier for the certificate
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  enrollmentId: integer("enrollment_id"),
  title: text("title").notNull(),
  recipientName: text("recipient_name").notNull(),
  courseName: text("course_name").notNull(),
  completionDate: date("completion_date").notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  pdfUrl: text("pdf_url"),
  imageUrl: text("image_url"),
  verificationUrl: text("verification_url"),
  issuerName: text("issuer_name").default('Desired Career Academy'),
  issuerLogo: text("issuer_logo"),
  instructorName: text("instructor_name"),
  instructorSignature: text("instructor_signature"),
  adminSignature: text("admin_signature"),
  templateId: integer("template_id"),
  isVerified: boolean("is_verified").default(true),
  metadata: jsonb("metadata").default({}),
});

// Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  moduleId: integer("module_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  type: text("type").default('individual'), // individual, group
  difficultyLevel: text("difficulty_level").default('intermediate'),
  estimatedHours: integer("estimated_hours"),
  skills: jsonb("skills").default([]),
  resources: jsonb("resources").default([]),
  deliverables: jsonb("deliverables").default([]),
  evaluationCriteria: jsonb("evaluation_criteria").default([]),
  sampleSolution: text("sample_solution"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project Submissions
export const projectSubmissions = pgTable("project_submissions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: integer("user_id").notNull(),
  enrollmentId: integer("enrollment_id"),
  title: text("title").notNull(),
  description: text("description"),
  submissionUrl: text("submission_url"),
  repositoryUrl: text("repository_url"),
  files: jsonb("files").default([]),
  status: text("status").default('submitted'), // draft, submitted, under_review, completed
  grade: integer("grade"), // percentage
  feedback: text("feedback"),
  reviewerId: integer("reviewer_id"),
  reviewedAt: timestamp("reviewed_at"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Presentations
export const presentations = pgTable("presentations", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  moduleId: integer("module_id"),
  title: text("title").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  scheduledDate: timestamp("scheduled_date"),
  duration: integer("duration").default(15), // minutes
  maxParticipants: integer("max_participants").default(5),
  isGroupPresentation: boolean("is_group_presentation").default(false),
  evaluationCriteria: jsonb("evaluation_criteria").default([]),
  zoomMeetingId: text("zoom_meeting_id"),
  zoomPassword: text("zoom_password"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Presentation Evaluations
export const presentationEvaluations = pgTable("presentation_evaluations", {
  id: serial("id").primaryKey(),
  presentationId: integer("presentation_id").notNull(),
  userId: integer("user_id").notNull(),
  evaluatorId: integer("evaluator_id").notNull(),
  criteria: presentationCriteriaEnum("criteria").notNull(),
  score: integer("score").notNull(), // 1-10
  feedback: text("feedback"),
  aiScore: integer("ai_score"), // AI-generated score
  videoUrl: text("video_url"), // Recording URL
  transcriptUrl: text("transcript_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Course Reviews
export const courseReviews = pgTable("course_reviews", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  userId: integer("user_id").notNull(),
  enrollmentId: integer("enrollment_id"),
  rating: integer("rating").notNull(), // 1-5
  title: text("title"),
  content: text("content"),
  isVerifiedPurchase: boolean("is_verified_purchase").default(true),
  isAnonymous: boolean("is_anonymous").default(false),
  likes: integer("likes").default(0),
  status: text("status").default('published'), // published, pending, rejected
  instructorResponse: text("instructor_response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum threads
export const forumThreads = pgTable("forum_threads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  moduleId: integer("module_id"),
  lessonId: integer("lesson_id"),
  status: threadStatusEnum("status").default('open'),
  views: integer("views").default(0),
  votes: integer("votes").default(0),
  isAnnouncement: boolean("is_announcement").default(false),
  isPinned: boolean("is_pinned").default(false),
  tags: jsonb("tags").default([]),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  closedById: integer("closed_by_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum replies
export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull(),
  parentId: integer("parent_id"), // for nested replies
  isInstructorResponse: boolean("is_instructor_response").default(false),
  isAccepted: boolean("is_accepted").default(false),
  isHidden: boolean("is_hidden").default(false),
  votes: integer("votes").default(0),
  attachments: jsonb("attachments").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Doubt Responses
export const aiResponses = pgTable("ai_responses", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id"),
  replyId: integer("reply_id"),
  userId: integer("user_id").notNull(), // user who asked the doubt
  question: text("question").notNull(),
  response: text("response").notNull(),
  sourceReferences: jsonb("source_references").default([]),
  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  model: text("model"),
  rating: integer("rating"), // user rating of response
  feedback: text("feedback"),
  resolvedIssue: boolean("resolved_issue").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Badges & Achievements
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").default('achievement'), // achievement, skill, participation
  level: text("level").default('bronze'), // bronze, silver, gold, platinum
  imageUrl: text("image_url"),
  criteria: jsonb("criteria").default({}),
  xpValue: integer("xp_value").default(0),
  isAutoAwarded: boolean("is_auto_awarded").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  awardedAt: timestamp("awarded_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  awardedBy: integer("awarded_by"), // can be null for auto-awarded
  reason: text("reason"),
  isPublic: boolean("is_public").default(true),
});

// Payments and Transactions
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id"),
  amount: real("amount").notNull(),
  currency: text("currency").default('USD'),
  status: text("status").notNull(), // pending, completed, failed, refunded
  gateway: text("gateway").default('razorpay'), // razorpay, stripe
  gatewayPaymentId: text("gateway_payment_id"),
  gatewayOrderId: text("gateway_order_id"),
  refundAmount: real("refund_amount"),
  refundedAt: timestamp("refunded_at"),
  refundReason: text("refund_reason"),
  couponCode: text("coupon_code"),
  discountAmount: real("discount_amount"),
  taxAmount: real("tax_amount"),
  netAmount: real("net_amount"),
  invoiceUrl: text("invoice_url"),
  billingName: text("billing_name"),
  billingEmail: text("billing_email"),
  billingPhone: text("billing_phone"),
  billingAddress: text("billing_address"),
  billingCity: text("billing_city"),
  billingState: text("billing_state"),
  billingCountry: text("billing_country"),
  billingZip: text("billing_zip"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Coupons
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  type: text("type").default('percentage'), // percentage, fixed
  value: real("value").notNull(),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  minPurchaseAmount: real("min_purchase_amount"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  applicableCourses: jsonb("applicable_courses").default([]), // empty means all courses
  userRestrictions: jsonb("user_restrictions").default([]), // empty means all users
  createdById: integer("created_by_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning paths
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  domain: domainEnum("domain").notNull(),
  subDomain: subDomainEnum("sub_domain"),
  level: text("level").default('beginner'),
  imageUrl: text("image_url"),
  estimatedCompletionTime: integer("estimated_completion_time"), // in hours
  skills: jsonb("skills").default([]),
  popularity: integer("popularity").default(0),
  careerOutcomes: jsonb("career_outcomes").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning path steps
export const learningPathSteps = pgTable("learning_path_steps", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id").notNull(),
  courseId: integer("course_id").notNull(),
  order: integer("order").notNull(),
  title: text("title"),
  description: text("description"),
  isRequired: boolean("is_required").default(true),
  metadata: jsonb("metadata").default({}),
});

// Leaderboards
export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").default('xp'), // xp, course_completions, assessments
  domain: domainEnum("domain"),
  subDomain: subDomainEnum("sub_domain"),
  period: text("period").default('weekly'), // daily, weekly, monthly, all-time
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leaderboard Entries
export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  leaderboardId: integer("leaderboard_id").notNull(),
  userId: integer("user_id").notNull(),
  rank: integer("rank").notNull(),
  score: integer("score").notNull(),
  previousRank: integer("previous_rank"),
  metadata: jsonb("metadata").default({}),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  linkUrl: text("link_url"),
  imageUrl: text("image_url"),
  data: jsonb("data").default({}),
  scheduledFor: timestamp("scheduled_for"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Jobs & Opportunities
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  companyName: text("company_name").notNull(),
  companyLogo: text("company_logo"),
  location: text("location").notNull(),
  locationType: text("location_type").default('remote'), // remote, onsite, hybrid
  jobType: jobTypeEnum("job_type").notNull(),
  experienceLevel: experienceLevelEnum("experience_level").notNull(),
  minSalary: real("min_salary"),
  maxSalary: real("max_salary"),
  currency: text("currency").default('USD'),
  description: text("description").notNull(),
  requirements: jsonb("requirements").default([]),
  responsibilities: jsonb("responsibilities").default([]),
  benefits: jsonb("benefits").default([]),
  skills: jsonb("skills").default([]),
  applicationUrl: text("application_url"),
  domain: domainEnum("domain"),
  subDomain: subDomainEnum("sub_domain"),
  deadline: timestamp("deadline"),
  postedById: integer("posted_by_id").notNull(),
  contactEmail: text("contact_email"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  viewCount: integer("view_count").default(0),
  applicantCount: integer("applicant_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job Applications
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  userId: integer("user_id").notNull(),
  resumeUrl: text("resume_url").notNull(),
  coverLetter: text("cover_letter"),
  status: text("status").default('applied'), // applied, reviewed, shortlisted, rejected, interviewed, offered
  notes: text("notes"),
  reviewedById: integer("reviewed_by_id"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Resume Templates
export const resumeTemplates = pgTable("resume_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  previewImageUrl: text("preview_image_url"),
  templateData: jsonb("template_data").notNull(),
  category: text("category").default('professional'),
  isActive: boolean("is_active").default(true),
  isPremium: boolean("is_premium").default(false),
  popularity: integer("popularity").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Resumes
export const userResumes = pgTable("user_resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  templateId: integer("template_id").notNull(),
  title: text("title").notNull(),
  resumeData: jsonb("resume_data").notNull(),
  pdfUrl: text("pdf_url"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support Tickets
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: ticketCategoryEnum("category").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: ticketStatusEnum("status").default('open'),
  priority: text("priority").default('medium'), // low, medium, high, urgent
  assignedToId: integer("assigned_to_id"),
  courseId: integer("course_id"),
  orderId: integer("order_id"),
  screenshots: jsonb("screenshots").default([]),
  tags: jsonb("tags").default([]),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),
  reopenedAt: timestamp("reopened_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ticket Responses
export const ticketResponses = pgTable("ticket_responses", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  isAdminResponse: boolean("is_admin_response").default(false),
  isPrivateNote: boolean("is_private_note").default(false),
  attachments: jsonb("attachments").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Website Content (CMS)
export const cmsPages = pgTable("cms_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  isPublished: boolean("is_published").default(true),
  publishedAt: timestamp("published_at"),
  updatedById: integer("updated_by_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull(),
  featuredImageUrl: text("featured_image_url"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  tags: jsonb("tags").default([]),
  categories: jsonb("categories").default([]),
  status: text("status").default('draft'), // draft, published, archived
  viewCount: integer("view_count").default(0),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, createdAt: true, updatedAt: true, publishedAt: true, featuredAt: true });
export const insertModuleSchema = createInsertSchema(modules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, enrolledAt: true, completedAt: true, lastAccessedAt: true });
export const insertLessonProgressSchema = createInsertSchema(lessonProgress).omit({ id: true, completedAt: true, lastUpdatedAt: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true });
export const insertAssessmentAttemptSchema = createInsertSchema(assessmentAttempts).omit({ id: true, startedAt: true, completedAt: true, reviewedAt: true });
export const insertCertificateSchema = createInsertSchema(certificates).omit({ id: true, issuedAt: true });
export const insertForumThreadSchema = createInsertSchema(forumThreads).omit({ id: true, createdAt: true, updatedAt: true, lastActivityAt: true });
export const insertForumReplySchema = createInsertSchema(forumReplies).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true });
export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true, awardedAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLearningPathStepSchema = createInsertSchema(learningPathSteps).omit({ id: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInstructorSchema = createInsertSchema(instructors).omit({ id: true, createdAt: true, updatedAt: true });
export const insertResumeTemplateSchema = createInsertSchema(resumeTemplates).omit({ id: true, createdAt: true });
export const insertCmsPageSchema = createInsertSchema(cmsPages).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true, updatedAt: true });

// Type Exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type Resource = typeof resources.$inferSelect;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type AssessmentAttempt = typeof assessmentAttempts.$inferSelect;
export type InsertAssessmentAttempt = z.infer<typeof insertAssessmentAttemptSchema>;

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;

export type ForumThread = typeof forumThreads.$inferSelect;
export type InsertForumThread = z.infer<typeof insertForumThreadSchema>;

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;

export type LearningPathStep = typeof learningPathSteps.$inferSelect;
export type InsertLearningPathStep = z.infer<typeof insertLearningPathStepSchema>;

export type Instructor = typeof instructors.$inferSelect;
export type InsertInstructor = z.infer<typeof insertInstructorSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;

export type ResumeTemplate = typeof resumeTemplates.$inferSelect;
export type InsertResumeTemplate = z.infer<typeof insertResumeTemplateSchema>;

export type CmsPage = typeof cmsPages.$inferSelect;
export type InsertCmsPage = z.infer<typeof insertCmsPageSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
