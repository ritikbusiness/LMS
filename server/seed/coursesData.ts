/**
 * Data for 15 courses across different domains for the Desired Career Academy LMS
 */
export const coursesData = [
  // Software Development Domain
  {
    title: "Advanced Full-Stack JavaScript Development",
    slug: "advanced-full-stack-javascript-development",
    subtitle: "Master modern JavaScript frameworks and build scalable full-stack applications",
    description: "This comprehensive course covers everything you need to become a professional full-stack JavaScript developer. From React and Node.js to MongoDB and serverless architecture, you'll learn how to build, test, and deploy complete web applications using the latest industry practices.",
    domain: "Software_Development",
    subDomain: "FullStack",
    instructorId: 1,
    thumbnailUrl: "https://example.com/courses/fullstack-js.jpg",
    previewVideoUrl: "https://example.com/videos/fullstack-js-preview.mp4",
    price: 129.99,
    salePrice: 99.99,
    isActive: true,
    status: "published",
    totalModules: 8,
    totalLessons: 42,
    totalDuration: 3120, // 52 hours
    averageRating: 4.8,
    totalReviews: 156,
    totalEnrollments: 1842,
    completionRate: 68,
    difficultyLevel: "intermediate",
    learningOutcomes: [
      "Build full-stack applications using React, Node.js, and MongoDB",
      "Implement authentication and authorization using JWT",
      "Deploy applications to cloud platforms",
      "Write clean, maintainable code with modern JavaScript practices",
      "Create responsive and accessible user interfaces"
    ],
    prerequisites: [
      "Basic JavaScript knowledge",
      "Understanding of HTML/CSS",
      "Familiarity with web development concepts"
    ],
    language: "English",
    createdAt: new Date("2023-01-15"),
    publishedAt: new Date("2023-02-01"),
  },

  // Data Analytics Domain
  {
    title: "Data Analytics Master Class: From Beginner to Professional",
    slug: "data-analytics-master-class",
    subtitle: "Learn to analyze, visualize, and interpret data to drive business decisions",
    description: "Become a data analytics professional with this comprehensive course covering everything from Excel and SQL to Python, Tableau, and Power BI. Learn how to clean data, perform statistical analysis, create stunning visualizations, and generate actionable insights that drive business decisions.",
    domain: "Data_Analytics",
    subDomain: "Data_Analyst",
    instructorId: 2,
    thumbnailUrl: "https://example.com/courses/data-analytics.jpg",
    previewVideoUrl: "https://example.com/videos/data-analytics-preview.mp4",
    price: 149.99,
    salePrice: 119.99,
    isActive: true,
    status: "published",
    totalModules: 10,
    totalLessons: 58,
    totalDuration: 3660, // 61 hours
    averageRating: 4.7,
    totalReviews: 203,
    totalEnrollments: 2185,
    completionRate: 72,
    difficultyLevel: "beginner",
    learningOutcomes: [
      "Master data cleaning and preparation techniques",
      "Perform statistical analysis to identify patterns and trends",
      "Create interactive dashboards and visualizations",
      "Write efficient SQL queries for data extraction",
      "Apply data analytics principles to real-world business problems"
    ],
    prerequisites: [
      "Basic computer skills",
      "No prior analytics experience required"
    ],
    language: "English",
    createdAt: new Date("2023-02-10"),
    publishedAt: new Date("2023-03-01"),
  },

  // AI/ML Domain
  {
    title: "Practical Machine Learning and AI: From Theory to Deployment",
    slug: "practical-machine-learning-ai",
    subtitle: "Build and deploy machine learning models for real-world applications",
    description: "This hands-on course takes you beyond theory into practical machine learning and artificial intelligence. Learn how to build, train, and deploy ML models from scratch. Cover classification, regression, clustering, deep learning, NLP, and computer vision with practical projects using Python, TensorFlow, PyTorch, and cloud ML services.",
    domain: "AI_ML",
    subDomain: "Machine_Learning",
    instructorId: 3,
    thumbnailUrl: "https://example.com/courses/machine-learning.jpg",
    previewVideoUrl: "https://example.com/videos/ml-preview.mp4",
    price: 199.99,
    salePrice: 159.99,
    isActive: true,
    status: "published",
    totalModules: 12,
    totalLessons: 65,
    totalDuration: 4320, // 72 hours
    averageRating: 4.9,
    totalReviews: 178,
    totalEnrollments: 1568,
    completionRate: 65,
    difficultyLevel: "intermediate",
    learningOutcomes: [
      "Build and train machine learning models using Python",
      "Implement neural networks for complex pattern recognition",
      "Apply NLP techniques for text analysis and sentiment analysis",
      "Develop computer vision applications",
      "Deploy ML models to production environments"
    ],
    prerequisites: [
      "Python programming knowledge",
      "Basic understanding of statistics",
      "Linear algebra fundamentals"
    ],
    language: "English",
    createdAt: new Date("2023-03-05"),
    publishedAt: new Date("2023-03-20"),
  },

  // Web Development Domain
  {
    title: "Modern Web Development with React and TypeScript",
    slug: "modern-web-development-react-typescript",
    subtitle: "Build robust web applications with React, TypeScript, and modern frontend tools",
    description: "Take your web development skills to the next level with this comprehensive course on modern frontend development. Learn to build scalable, type-safe applications using React and TypeScript. Master state management, routing, testing, and performance optimization while building real-world projects.",
    domain: "Web_Development",
    subDomain: "Frontend",
    instructorId: 1,
    thumbnailUrl: "https://example.com/courses/react-typescript.jpg",
    previewVideoUrl: "https://example.com/videos/react-ts-preview.mp4",
    price: 139.99,
    salePrice: 109.99,
    isActive: true,
    status: "published",
    totalModules: 9,
    totalLessons: 48,
    totalDuration: 2880, // 48 hours
    averageRating: 4.8,
    totalReviews: 142,
    totalEnrollments: 1976,
    completionRate: 74,
    difficultyLevel: "intermediate",
    learningOutcomes: [
      "Build sophisticated React applications with TypeScript",
      "Implement state management using Redux and Context API",
      "Create reusable component libraries",
      "Write comprehensive tests for React applications",
      "Optimize React applications for performance"
    ],
    prerequisites: [
      "JavaScript fundamentals",
      "Basic React knowledge",
      "Understanding of web development concepts"
    ],
    language: "English",
    createdAt: new Date("2023-04-10"),
    publishedAt: new Date("2023-04-25"),
  },

  // Cloud/DevOps Domain
  {
    title: "AWS DevOps Engineering Professional",
    slug: "aws-devops-engineering-professional",
    subtitle: "Master DevOps practices on AWS and prepare for the AWS DevOps Engineer Professional certification",
    description: "Become an AWS DevOps professional with this comprehensive course. Learn Infrastructure as Code, CI/CD pipelines, container orchestration, and monitoring on AWS. Master tools like CloudFormation, CodePipeline, ECS, Kubernetes, and CloudWatch to automate and optimize the software delivery lifecycle on AWS.",
    domain: "Cloud_DevOps",
    subDomain: "AWS",
    instructorId: 4,
    thumbnailUrl: "https://example.com/courses/aws-devops.jpg",
    previewVideoUrl: "https://example.com/videos/aws-devops-preview.mp4",
    price: 189.99,
    salePrice: 149.99,
    isActive: true,
    status: "published",
    totalModules: 11,
    totalLessons: 62,
    totalDuration: 3900, // 65 hours
    averageRating: 4.7,
    totalReviews: 123,
    totalEnrollments: 1345,
    completionRate: 69,
    difficultyLevel: "advanced",
    learningOutcomes: [
      "Implement Infrastructure as Code using CloudFormation and Terraform",
      "Build CI/CD pipelines using AWS services",
      "Deploy and manage containerized applications on ECS and EKS",
      "Implement monitoring, logging, and alerting solutions",
      "Prepare for the AWS DevOps Engineer Professional certification"
    ],
    prerequisites: [
      "AWS fundamentals knowledge",
      "Basic understanding of DevOps concepts",
      "System administration experience"
    ],
    language: "English",
    createdAt: new Date("2023-05-15"),
    publishedAt: new Date("2023-06-01"),
  },

  // Networking/Security Domain
  {
    title: "Cybersecurity Analyst Career Path",
    slug: "cybersecurity-analyst-career-path",
    subtitle: "Comprehensive training to become a professional cybersecurity analyst",
    description: "Launch your career as a cybersecurity analyst with this comprehensive training program. Learn network security, ethical hacking, vulnerability assessment, security operations, incident response, and compliance frameworks. Gain hands-on experience with industry-standard tools and prepare for key security certifications.",
    domain: "Networking_Security",
    subDomain: "Cybersecurity",
    instructorId: 5,
    thumbnailUrl: "https://example.com/courses/cybersecurity-analyst.jpg",
    previewVideoUrl: "https://example.com/videos/security-preview.mp4",
    price: 179.99,
    salePrice: 139.99,
    isActive: true,
    status: "published",
    totalModules: 14,
    totalLessons: 78,
    totalDuration: 4680, // 78 hours
    averageRating: 4.8,
    totalReviews: 156,
    totalEnrollments: 1689,
    completionRate: 71,
    difficultyLevel: "intermediate",
    learningOutcomes: [
      "Identify and mitigate security vulnerabilities",
      "Conduct vulnerability assessments and penetration tests",
      "Implement security monitoring and incident response",
      "Understand compliance and regulatory frameworks",
      "Prepare for CompTIA Security+ and CySA+ certifications"
    ],
    prerequisites: [
      "Basic IT and networking knowledge",
      "Understanding of operating systems",
      "No prior security experience required"
    ],
    language: "English",
    createdAt: new Date("2023-06-20"),
    publishedAt: new Date("2023-07-05"),
  },

  // Database Management Domain
  {
    title: "Database Engineering and Administration Masterclass",
    slug: "database-engineering-administration-masterclass",
    subtitle: "Become a database expert with comprehensive training in SQL, NoSQL, data modeling, and optimization",
    description: "Master the art and science of database engineering with this comprehensive course. Learn database design, SQL programming, performance optimization, replication, and high availability across major RDBMS and NoSQL systems. Gain hands-on experience with PostgreSQL, MySQL, MongoDB, and cloud database services.",
    domain: "Database_Management",
    subDomain: "Database_Architect",
    instructorId: 2,
    thumbnailUrl: "https://example.com/courses/database-engineering.jpg",
    previewVideoUrl: "https://example.com/videos/database-preview.mp4",
    price: 159.99,
    salePrice: 129.99,
    isActive: true,
    status: "published",
    totalModules: 12,
    totalLessons: 65,
    totalDuration: 3900, // 65 hours
    averageRating: 4.7,
    totalReviews: 132,
    totalEnrollments: 1456,
    completionRate: 68,
    difficultyLevel: "intermediate",
    learningOutcomes: [
      "Design efficient and scalable database architectures",
      "Write advanced SQL queries and stored procedures",
      "Implement database replication and high availability",
      "Optimize database performance",
      "Manage both relational and NoSQL database systems"
    ],
    prerequisites: [
      "Basic SQL knowledge",
      "Understanding of data structures",
      "Basic system administration concepts"
    ],
    language: "English",
    createdAt: new Date("2023-07-10"),
    publishedAt: new Date("2023-07-25"),
  },

  // Software Testing Domain
  {
    title: "Complete Software Testing Bootcamp: From Manual to Automation",
    slug: "complete-software-testing-bootcamp",
    subtitle: "Learn end-to-end software testing methodologies, tools, and best practices",
    description: "Transform yourself into a professional software tester with this comprehensive bootcamp. Master the complete testing lifecycle from requirements analysis to test reporting. Learn manual testing, test automation with Selenium, API testing, performance testing, mobile testing, and DevOps integration while preparing for ISTQB certification.",
    domain: "Software_Testing",
    subDomain: "Automation_Testing",
    instructorId: 6,
    thumbnailUrl: "https://example.com/courses/software-testing.jpg",
    previewVideoUrl: "https://example.com/videos/testing-preview.mp4",
    price: 149.99,
    salePrice: 119.99,
    isActive: true,
    status: "published",
    totalModules: 10,
    totalLessons: 55,
    totalDuration: 3300, // 55 hours
    averageRating: 4.6,
    totalReviews: 118,
    totalEnrollments: 1325,
    completionRate: 73,
    difficultyLevel: "beginner",
    learningOutcomes: [
      "Design comprehensive test plans and test cases",
      "Implement automated testing using Selenium WebDriver",
      "Perform API testing with Postman and RestAssured",
      "Conduct performance testing with JMeter",
      "Integrate testing into CI/CD pipelines"
    ],
    prerequisites: [
      "Basic computer skills",
      "Understanding of software development lifecycle",
      "No prior testing experience required"
    ],
    language: "English",
    createdAt: new Date("2023-08-05"),
    publishedAt: new Date("2023-08-20"),
  },

  // Project Management Domain
  {
    title: "Agile Project Management for Tech Teams",
    slug: "agile-project-management-tech-teams",
    subtitle: "Master Scrum, Kanban, and other Agile methodologies for tech project success",
    description: "Elevate your project management skills with this comprehensive Agile course designed specifically for technology teams. Learn to implement Scrum, Kanban, and hybrid Agile frameworks to deliver successful tech projects. Master sprint planning, backlog refinement, agile estimation, and team facilitation techniques while preparing for PSM and PMI-ACP certifications.",
    domain: "Project_Management",
    subDomain: "Scrum_Master",
    instructorId: 7,
    thumbnailUrl: "https://example.com/courses/agile-pm.jpg",
    previewVideoUrl: "https://example.com/videos/agile-preview.mp4",
    price: 169.99,
    salePrice: 139.99,
    isActive: true,
    status: "published",
    totalModules: 9,
    totalLessons: 48,
    totalDuration: 2880, // 48 hours
    averageRating: 4.8,
    totalReviews: 145,
    totalEnrollments: 1876,
    completionRate: 78,
    difficultyLevel: "intermediate",
    learningOutcomes: [
      "Implement Scrum and Kanban in technology projects",
      "Lead effective Agile ceremonies and team meetings",
      "Create and manage product backlogs",
      "Apply Agile estimation and planning techniques",
      "Prepare for professional Agile certifications"
    ],
    prerequisites: [
      "Basic project management knowledge",
      "Familiarity with software development concepts",
      "Team leadership experience helpful but not required"
    ],
    language: "English",
    createdAt: new Date("2023-09-10"),
    publishedAt: new Date("2023-09-25"),
  },

  // Blockchain Domain
  {
    title: "Blockchain Development and Smart Contracts",
    slug: "blockchain-development-smart-contracts",
    subtitle: "Learn to build decentralized applications with Ethereum, Solidity, and Web3",
    description: "Enter the world of blockchain development with this comprehensive course on Ethereum and decentralized applications. Learn blockchain fundamentals, smart contract development with Solidity, Web3 integration, and dApp architecture. Build real-world projects including DeFi applications, NFT marketplaces, and DAOs while exploring the latest blockchain technologies.",
    domain: "Blockchain",
    subDomain: "Smart_Contract_Developer",
    instructorId: 8,
    thumbnailUrl: "https://example.com/courses/blockchain-dev.jpg",
    previewVideoUrl: "https://example.com/videos/blockchain-preview.mp4",
    price: 199.99,
    salePrice: 159.99,
    isActive: true,
    status: "published",
    totalModules: 11,
    totalLessons: 58,
    totalDuration: 3480, // 58 hours
    averageRating: 4.7,
    totalReviews: 98,
    totalEnrollments: 1245,
    completionRate: 67,
    difficultyLevel: "advanced",
    learningOutcomes: [
      "Develop and deploy smart contracts using Solidity",
      "Build decentralized applications (dApps) with Web3.js",
      "Implement secure token standards and NFTs",
      "Create DeFi applications and protocols",
      "Test and audit smart contracts for security vulnerabilities"
    ],
    prerequisites: [
      "JavaScript programming experience",
      "Web development knowledge",
      "Basic understanding of cryptography concepts"
    ],
    language: "English",
    createdAt: new Date("2023-10-15"),
    publishedAt: new Date("2023-11-01"),
  },

  // Hardware/Embedded Domain
  {
    title: "IoT and Embedded Systems Engineering",
    slug: "iot-embedded-systems-engineering",
    subtitle: "Design and develop Internet of Things devices and embedded systems",
    description: "Master the development of Internet of Things (IoT) and embedded systems in this hands-on course. Learn hardware design, microcontroller programming, sensor integration, connectivity protocols, and IoT cloud platforms. Build complete IoT projects from hardware design to cloud connectivity with real-world applications in smart homes, industrial IoT, and wearable technology.",
    domain: "Hardware_Embedded",
    subDomain: "IoT",
    instructorId: 9,
    thumbnailUrl: "https://example.com/courses/iot-embedded.jpg",
    previewVideoUrl: "https://example.com/videos/iot-preview.mp4",
    price: 189.99,
    salePrice: 149.99,
    isActive: true,
    status: "published",
    totalModules: 12,
    totalLessons: 65,
    totalDuration: 3900, // 65 hours
    averageRating: 4.6,
    totalReviews: 87,
    totalEnrollments: 965,
    completionRate: 65,
    difficultyLevel: "intermediate",
    learningOutcomes: [
      "Design embedded systems with microcontrollers and sensors",
      "Program embedded devices using Arduino, ESP32, and Raspberry Pi",
      "Implement IoT connectivity with MQTT, HTTP, and Bluetooth",
      "Connect IoT devices to cloud platforms",
      "Develop end-to-end IoT solutions for real-world applications"
    ],
    prerequisites: [
      "Basic electronics knowledge",
      "Programming fundamentals",
      "Understanding of networking concepts"
    ],
    language: "English",
    createdAt: new Date("2023-11-10"),
    publishedAt: new Date("2023-11-25"),
  },

  // IT Support Domain
  {
    title: "IT Support Professional Certification",
    slug: "it-support-professional-certification",
    subtitle: "Complete training for IT help desk and support roles",
    description: "Launch your career in IT support with this comprehensive certification course. Learn hardware troubleshooting, operating system management, networking fundamentals, security best practices, and customer service skills. Master the tools and techniques used by professional IT support specialists while preparing for CompTIA A+ and ITIL certifications.",
    domain: "IT_Support",
    subDomain: "Help_Desk",
    instructorId: 10,
    thumbnailUrl: "https://example.com/courses/it-support.jpg",
    previewVideoUrl: "https://example.com/videos/it-support-preview.mp4",
    price: 129.99,
    salePrice: 99.99,
    isActive: true,
    status: "published",
    totalModules: 10,
    totalLessons: 52,
    totalDuration: 3120, // 52 hours
    averageRating: 4.7,
    totalReviews: 165,
    totalEnrollments: 2156,
    completionRate: 82,
    difficultyLevel: "beginner",
    learningOutcomes: [
      "Troubleshoot and resolve common hardware and software issues",
      "Install, configure, and maintain operating systems",
      "Implement and manage network configurations",
      "Apply IT security best practices",
      "Deliver professional technical support and customer service"
    ],
    prerequisites: [
      "Basic computer skills",
      "No prior IT experience required"
    ],
    language: "English",
    createdAt: new Date("2023-12-05"),
    publishedAt: new Date("2023-12-20"),
  },

  // Research & Development Domain
  {
    title: "Research Methods for Technology Innovation",
    slug: "research-methods-technology-innovation",
    subtitle: "Learn systematic approaches to research and innovation in technology",
    description: "Master the methodologies and practices of technology research with this comprehensive course. Learn how to design research studies, collect and analyze data, prototype solutions, and validate results. Explore frameworks for innovation management, technology forecasting, and intellectual property protection while developing skills in technical writing and presentation.",
    domain: "Research_Development",
    subDomain: "Research_Engineer",
    instructorId: 11,
    thumbnailUrl: "https://example.com/courses/tech-research.jpg",
    previewVideoUrl: "https://example.com/videos/research-preview.mp4",
    price: 169.99,
    salePrice: 139.99,
    isActive: true,
    status: "published",
    totalModules: 9,
    totalLessons: 48,
    totalDuration: 2880, // 48 hours
    averageRating: 4.5,
    totalReviews: 76,
    totalEnrollments: 865,
    completionRate: 70,
    difficultyLevel: "advanced",
    learningOutcomes: [
      "Design and conduct technology research studies",
      "Apply quantitative and qualitative research methods",
      "Develop and test technology prototypes",
      "Write research papers and technical documentation",
      "Present research findings effectively"
    ],
    prerequisites: [
      "Basic understanding of scientific method",
      "Technical background in relevant field",
      "Academic or professional writing experience"
    ],
    language: "English",
    createdAt: new Date("2024-01-10"),
    publishedAt: new Date("2024-01-25"),
  },

  // Sales & Marketing Domain
  {
    title: "Tech Sales and Digital Marketing Mastery",
    slug: "tech-sales-digital-marketing-mastery",
    subtitle: "Learn to market and sell technology products and services",
    description: "Master the art and science of technology sales and digital marketing with this comprehensive course. Learn how to understand tech customers, craft compelling value propositions, build sales funnels, and implement digital marketing strategies. Gain skills in SEO, content marketing, social media, email campaigns, and analytics specifically for technology products and services.",
    domain: "Sales_Marketing",
    subDomain: "Tech_Sales",
    instructorId: 12,
    thumbnailUrl: "https://example.com/courses/tech-sales.jpg",
    previewVideoUrl: "https://example.com/videos/tech-sales-preview.mp4",
    price: 149.99,
    salePrice: 119.99,
    isActive: true,
    status: "published",
    totalModules: 10,
    totalLessons: 55,
    totalDuration: 3300, // 55 hours
    averageRating: 4.6,
    totalReviews: 94,
    totalEnrollments: 1245,
    completionRate: 75,
    difficultyLevel: "intermediate",
    learningOutcomes: [
      "Develop effective sales strategies for technology products",
      "Create and execute digital marketing campaigns",
      "Build and optimize sales funnels",
      "Implement SEO and content marketing for tech products",
      "Analyze and optimize marketing performance"
    ],
    prerequisites: [
      "Basic marketing or sales knowledge",
      "Familiarity with digital platforms",
      "No technical background required"
    ],
    language: "English",
    createdAt: new Date("2024-02-10"),
    publishedAt: new Date("2024-02-25"),
  },

  // Education & Training Domain
  {
    title: "E-Learning Development and Instructional Design",
    slug: "elearning-development-instructional-design",
    subtitle: "Learn to create effective online courses and digital learning experiences",
    description: "Become an e-learning professional with this comprehensive course on instructional design and digital education. Learn to design effective learning objectives, create engaging multimedia content, develop assessments, and build complete online courses. Master e-learning authoring tools, LMS implementation, and instructional methodologies for diverse learning environments.",
    domain: "Education_Training",
    subDomain: "Content_Developer",
    instructorId: 13,
    thumbnailUrl: "https://example.com/courses/elearning-dev.jpg",
    previewVideoUrl: "https://example.com/videos/elearning-preview.mp4",
    price: 159.99,
    salePrice: 129.99,
    isActive: true,
    status: "published",
    totalModules: 11,
    totalLessons: 60,
    totalDuration: 3600, // 60 hours
    averageRating: 4.7,
    totalReviews: 112,
    totalEnrollments: 1465,
    completionRate: 76,
    difficultyLevel: "intermediate",
    learningOutcomes: [
      "Apply instructional design principles to e-learning",
      "Create engaging multimedia learning content",
      "Develop effective assessments and learning activities",
      "Use e-learning authoring tools and platforms",
      "Implement courses in learning management systems"
    ],
    prerequisites: [
      "Teaching or training experience helpful but not required",
      "Basic digital content creation skills",
      "Interest in education and learning"
    ],
    language: "English",
    createdAt: new Date("2024-03-15"),
    publishedAt: new Date("2024-03-30"),
  }
];