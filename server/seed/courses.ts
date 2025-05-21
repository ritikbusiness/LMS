import { coursesData } from './coursesData';
import { db } from '../db';
import { courses, modules, lessons, assessments, questions } from '../../shared/schema';
import { domainEnum, assessmentTypeEnum, contentTypeEnum } from '../../shared/schema';

/**
 * Seeds the database with 15 courses across different domains
 */
export async function seedCourses() {
  console.log('Seeding courses...');
  
  try {
    // Process coursesData to ensure domain is properly typed
    const typedCoursesData = coursesData.map(course => ({
      ...course,
      // Ensure domain is properly typed as a valid domain enum value
      domain: course.domain as typeof domainEnum.enumValues[number],
      // Convert dates to proper format
      createdAt: new Date(course.createdAt),
      publishedAt: course.publishedAt ? new Date(course.publishedAt) : undefined,
      // Set proper defaults
      status: 'published',
      isActive: true
    }));
    
    // Insert all courses
    const insertedCourses = await db.insert(courses).values(typedCoursesData).returning();
    console.log(`Inserted ${insertedCourses.length} courses successfully`);
    
    // For each course, create modules, lessons, and assessments
    for (const course of insertedCourses) {
      // Create 4-6 modules per course
      const moduleCount = Math.floor(Math.random() * 3) + 4; // 4-6 modules
      
      for (let i = 1; i <= moduleCount; i++) {
        const moduleData = {
          courseId: course.id,
          title: `Module ${i}: ${getModuleTitle(course.domain, i)}`,
          description: `This module covers essential concepts and practical techniques in ${getModuleDescription(course.domain, i)}`,
          order: i,
          duration: Math.floor(Math.random() * 3600) + 1800, // 30-90 minutes in seconds
          totalLessons: Math.floor(Math.random() * 3) + 3, // 3-5 lessons
          isPublished: true
        };
        
        const [insertedModule] = await db.insert(modules).values(moduleData).returning();
        
        // Create lessons for each module
        const lessonCount = moduleData.totalLessons;
        for (let j = 1; j <= lessonCount; j++) {
          const contentType = getRandomContentType();
          
          const lessonData = {
            moduleId: insertedModule.id,
            title: `Lesson ${j}: ${getLessonTitle(course.domain, i, j)}`,
            description: `Learn about ${getLessonDescription(course.domain, i, j)}`,
            contentType: contentType as typeof contentTypeEnum.enumValues[number],
            videoUrl: j === 1 ? getRandomVideoUrl() : null, // First lesson has video
            videoDuration: j === 1 ? Math.floor(Math.random() * 1200) + 300 : null, // 5-25 minutes
            order: j,
            isPreview: j === 1, // First lesson is preview
            isPublished: true,
            materials: [
              {
                title: 'Lesson Notes',
                url: `https://example.com/courses/${course.id}/modules/${insertedModule.id}/lessons/notes.pdf`
              }
            ]
          };
          
          await db.insert(lessons).values(lessonData).returning();
        }
        
        // Create an assessment for the module
        if (i === moduleCount || i % 2 === 0) { // Last module and even-numbered modules have assessments
          const assessmentData = {
            courseId: course.id,
            moduleId: insertedModule.id,
            title: `${course.title} - ${insertedModule.title} Assessment`,
            description: `Test your knowledge on ${insertedModule.title}`,
            type: 'mcq' as typeof assessmentTypeEnum.enumValues[number],
            timeLimit: 30,
            passingScore: 70,
            maxAttempts: 3,
            randomizeQuestions: true,
            showAnswers: true,
            totalQuestions: 10,
            totalPoints: 100,
            isActive: true,
            order: i
          };
          
          const [insertedAssessment] = await db.insert(assessments).values(assessmentData).returning();
          
          // Create questions for the assessment
          for (let q = 1; q <= 10; q++) {
            // Create each question individually to avoid array type issues
            const questionData = {
              assessmentId: insertedAssessment.id,
              text: `Question ${q}: ${getQuestionText(course.domain, i, q)}`,
              type: 'mcq',
              options: [
                `Option A: ${getOptionText(course.domain, q, 'A')}`,
                `Option B: ${getOptionText(course.domain, q, 'B')}`,
                `Option C: ${getOptionText(course.domain, q, 'C')}`,
                `Option D: ${getOptionText(course.domain, q, 'D')}`
              ],
              correctOption: Math.floor(Math.random() * 4), // Random correct answer (0-3)
              points: 10,
              explanation: `Explanation: ${getExplanationText(course.domain)}`,
              order: q
            };
            
            await db.insert(questions).values(questionData);
          }
        }
      }
    }
    
    console.log('All course data seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding courses:', error);
    return false;
  }
}

// Helper functions for generating content
function getModuleTitle(domain: string, moduleNumber: number): string {
  const moduleTitles = {
    'Software_Development': [
      'Introduction to Programming Fundamentals',
      'Object-Oriented Programming Concepts',
      'Data Structures and Algorithms',
      'Software Architecture and Design Patterns',
      'Version Control and Collaboration',
      'Testing and Quality Assurance'
    ],
    'Data_Analytics': [
      'Foundations of Data Analysis',
      'Statistical Methods for Data Science',
      'Data Visualization Techniques',
      'Database Management and SQL',
      'Predictive Analytics',
      'Machine Learning for Data Analysis'
    ],
    'AI_ML': [
      'Machine Learning Fundamentals',
      'Neural Networks Architecture',
      'Deep Learning Frameworks',
      'Natural Language Processing',
      'Computer Vision Applications',
      'Reinforcement Learning'
    ],
    'Web_Development': [
      'HTML/CSS Fundamentals',
      'JavaScript and DOM Manipulation',
      'Frontend Frameworks',
      'Backend Development',
      'API Design and Development',
      'Web Performance Optimization'
    ],
    'Cloud_DevOps': [
      'Cloud Computing Essentials',
      'Infrastructure as Code',
      'Containerization with Docker',
      'Kubernetes Orchestration',
      'CI/CD Pipeline Implementation',
      'Cloud Security and Compliance'
    ],
    'Networking_Security': [
      'Network Architecture Fundamentals',
      'Cybersecurity Principles',
      'Encryption and Authentication',
      'Security Protocols and Standards',
      'Threat Detection and Mitigation',
      'Network Penetration Testing'
    ],
    'Database_Management': [
      'Database Design Principles',
      'SQL Programming Advanced Concepts',
      'NoSQL Database Systems',
      'Data Warehousing',
      'Database Performance Tuning',
      'Distributed Database Systems'
    ],
    'Software_Testing': [
      'Testing Methodologies',
      'Manual Testing Techniques',
      'Automated Testing Frameworks',
      'Performance Testing',
      'Security Testing',
      'Mobile Application Testing'
    ],
    'Project_Management': [
      'Project Management Fundamentals',
      'Agile Methodologies',
      'Scrum Framework Implementation',
      'Project Risk Management',
      'Stakeholder Management',
      'Project Portfolio Management'
    ],
    'Blockchain': [
      'Blockchain Fundamentals',
      'Cryptocurrency Concepts',
      'Smart Contract Development',
      'Decentralized Applications',
      'Blockchain Security',
      'Enterprise Blockchain Solutions'
    ],
    'Hardware_Embedded': [
      'Embedded Systems Architecture',
      'Microcontroller Programming',
      'RTOS Concepts',
      'IoT Device Development',
      'Sensor Integration',
      'Low-Level Hardware Interfaces'
    ],
    'IT_Support': [
      'IT Service Management',
      'Troubleshooting Methodologies',
      'Desktop Support Fundamentals',
      'Network Support',
      'Cloud Infrastructure Support',
      'Customer Service for IT Professionals'
    ],
    'Research_Development': [
      'Research Methodologies',
      'Innovation Management',
      'Product Development Lifecycle',
      'Research Design and Planning',
      'Data Analysis for Research',
      'Research Paper Writing'
    ],
    'Sales_Marketing': [
      'Digital Marketing Fundamentals',
      'Sales Techniques for Tech Products',
      'Market Analysis and Strategy',
      'Content Marketing',
      'SEO and SEM Strategies',
      'Social Media Marketing'
    ],
    'Education_Training': [
      'Instructional Design Principles',
      'E-Learning Development',
      'Training Delivery Methods',
      'Learning Assessment Techniques',
      'Adult Learning Theories',
      'Educational Technology Integration'
    ]
  };
  
  const domainModules = moduleTitles[domain] || moduleTitles['Software_Development'];
  return domainModules[moduleNumber % domainModules.length];
}

function getModuleDescription(domain: string, moduleNumber: number): string {
  return `${domain.replace('_', ' ')} relating to ${getModuleTitle(domain, moduleNumber)}`;
}

function getLessonTitle(domain: string, moduleNumber: number, lessonNumber: number): string {
  // Simplified lesson titles based on domain and module
  const baseTitle = getModuleTitle(domain, moduleNumber);
  switch (lessonNumber) {
    case 1: return `Introduction to ${baseTitle}`;
    case 2: return `Core Concepts in ${baseTitle}`;
    case 3: return `Practical Applications of ${baseTitle}`;
    case 4: return `Advanced Techniques in ${baseTitle}`;
    case 5: return `Case Studies: ${baseTitle}`;
    default: return `Topic ${lessonNumber} in ${baseTitle}`;
  }
}

function getLessonDescription(domain: string, moduleNumber: number, lessonNumber: number): string {
  return `Detailed exploration of ${getLessonTitle(domain, moduleNumber, lessonNumber)}`;
}

function getRandomContentType(): 'video' | 'pdf' | 'presentation' | 'code' | 'quiz' {
  const types = ['video', 'pdf', 'presentation', 'code', 'quiz'];
  return types[Math.floor(Math.random() * types.length)] as any;
}

function getRandomVideoUrl(): string {
  return `https://example.com/videos/lesson-${Math.floor(Math.random() * 1000)}.mp4`;
}

function getQuestionText(domain: string, moduleNumber: number, questionNumber: number): string {
  return `Which of the following is true about ${getModuleTitle(domain, moduleNumber)}?`;
}

function getOptionText(domain: string, questionNumber: number, option: string): string {
  // Generate plausible-sounding options based on domain
  return `Example answer for ${domain.replace('_', ' ')} question ${questionNumber}, option ${option}`;
}

function getExplanationText(domain: string): string {
  return `The correct answer demonstrates understanding of key concepts in ${domain.replace('_', ' ')}.`;
}