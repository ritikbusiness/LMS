import { seedCourses } from './courses';
import { db } from '../db';
import { users, instructors } from '../../shared/schema';

/**
 * Seed all data into the database
 */
async function seedAll() {
  try {
    console.log('Starting database seeding...');
    
    // First, check if we already have course data
    const existingCourses = await db.query.courses.findMany({
      limit: 1
    });
    
    if (existingCourses.length > 0) {
      console.log('Database already has courses - skipping seed');
      return;
    }
    
    // Create instructors needed for the courses
    await seedInstructors();
    
    // Seed the courses
    await seedCourses();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

/**
 * Seed instructor accounts
 */
async function seedInstructors() {
  console.log('Seeding instructor accounts...');
  
  // Create instructor users (13 needed based on coursesData)
  const instructorUsers = [];
  for (let i = 1; i <= 13; i++) {
    const userData = {
      email: `instructor${i}@example.com`,
      fullName: `Instructor ${i}`,
      role: 'instructor' as const,
      passwordHash: '$2b$10$BQZdaTZVPdkqO3UwNLXyFexUqJD.ggOsHnE2XICpq0srXJW3.Tovi', // password: password123
      isVerified: true,
      isActive: true,
      avatarUrl: `https://example.com/avatars/instructor${i}.jpg`,
      bio: `Experienced ${getRandomSpecialization()} with ${5 + Math.floor(Math.random() * 15)} years of experience.`,
    };
    
    instructorUsers.push(userData);
  }
  
  // Insert all instructors
  const createdUsers = await db.insert(users).values(instructorUsers).returning();
  
  // Now create instructor profiles
  const instructorProfiles = createdUsers.map(user => ({
    userId: user.id,
    specialization: getRandomSpecialization(),
    expertise: ['JavaScript', 'React', 'Node.js', 'Python', 'Data Science'],
    bio: user.bio || 'Experienced technology instructor with a passion for teaching.',
    headline: `${getRandomSpecialization()} Expert | Professional Educator`,
    yearsOfExperience: 5 + Math.floor(Math.random() * 15),
    rating: 4.5 + (Math.random() * 0.5),
    totalStudents: Math.floor(Math.random() * 10000),
    totalCourses: 1 + Math.floor(Math.random() * 5),
    isVerified: true,
    applicationStatus: 'approved'
  }));
  
  await db.insert(instructors).values(instructorProfiles);
  
  console.log(`Created ${instructorUsers.length} instructor accounts`);
}

// Helper function for random instructor specialization
function getRandomSpecialization() {
  const specializations = [
    'Software Developer',
    'Data Scientist',
    'Web Developer',
    'DevOps Engineer',
    'Machine Learning Engineer',
    'Cybersecurity Specialist',
    'Database Administrator',
    'Project Manager',
    'Blockchain Developer',
    'Full-Stack Developer',
    'Cloud Architect',
    'AI Researcher',
    'IT Professional'
  ];
  
  return specializations[Math.floor(Math.random() * specializations.length)];
}

// Export the seed function
export { seedAll };