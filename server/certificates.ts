import { User, Course } from "@shared/schema";
import { storage } from "./storage";
import crypto from "crypto";

// Generate unique certificate ID
function generateCertificateId(userId: number, courseId: number): string {
  const timeStamp = Date.now().toString();
  const hash = crypto.createHash('md5').update(`${userId}-${courseId}-${timeStamp}`).digest('hex');
  const prefix = courseId.toString().padStart(3, '0');
  
  return `KAYAGO-${prefix}-${hash.substring(0, 8)}`.toUpperCase();
}

// Generate PDF certificate (mock implementation)
async function generateCertificatePDF(user: User, course: any, certificateId: string): Promise<string> {
  // In a real implementation, this would use a library like PDFKit or jsPDF to create a PDF
  // For this prototype, we'll return a mock URL
  return `/certificates/${certificateId}.pdf`;
}

// Generate certificate for user completing a course
export async function generateCertificate(user: User, course: any): Promise<any> {
  try {
    // Check if certificate already exists
    const existingCertificates = await storage.getUserCertificates(user.id);
    const existingCertificate = existingCertificates.find(
      cert => cert.courseId === course.id
    );
    
    if (existingCertificate) {
      return existingCertificate;
    }
    
    // Generate certificate ID
    const certificateId = generateCertificateId(user.id, course.id);
    
    // Generate PDF URL (in a real implementation, this would create an actual PDF file)
    const pdfUrl = await generateCertificatePDF(user, course, certificateId);
    
    // Create certificate record
    const certificateData = {
      userId: user.id,
      courseId: course.id,
      certificateId: certificateId,
      pdfUrl: pdfUrl,
    };
    
    const certificate = await storage.createCertificate(certificateData);
    
    return certificate;
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw new Error("Failed to generate certificate");
  }
}
