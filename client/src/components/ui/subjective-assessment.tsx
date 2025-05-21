import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeatureTooltip } from '@/components/ui/contextual-help';
import { 
  BookOpen, CheckCircle, XCircle, MessageSquare, Paperclip, 
  Clock, FileText, Upload, ThumbsUp, AlertTriangle
} from 'lucide-react';

// Types for the assessment
interface AssessmentQuestion {
  id: string | number;
  text: string;
  type: 'subjective' | 'coding' | 'project' | 'presentation';
  points: number;
  guidelines?: string;
  attachments?: Array<{
    id: string | number;
    name: string;
    url: string;
    type: string;
  }>;
}

interface AssessmentSubmission {
  id: string | number;
  questionId: string | number;
  answer: string;
  status: 'pending' | 'reviewed' | 'needs_revision';
  feedback?: string;
  score?: number;
  attachments?: Array<{
    id: string | number;
    name: string;
    url: string;
    type: string;
  }>;
  submittedAt: string;
  reviewedAt?: string;
  reviewer?: {
    id: string | number;
    name: string;
    avatarUrl?: string;
  };
}

interface SubjectiveAssessmentProps {
  title: string;
  description?: string;
  questions: AssessmentQuestion[];
  submissions?: AssessmentSubmission[];
  isInstructor?: boolean;
  onSubmit?: (submissionData: Partial<AssessmentSubmission>) => void;
  onReview?: (submissionId: string | number, feedback: string, score: number) => void;
}

export function SubjectiveAssessment({
  title,
  description,
  questions,
  submissions = [],
  isInstructor = false,
  onSubmit,
  onReview
}: SubjectiveAssessmentProps) {
  // State for student answers
  const [answers, setAnswers] = useState<Record<string | number, string>>({});
  
  // State for file uploads
  const [fileUploads, setFileUploads] = useState<Record<string | number, File[]>>({});
  
  // State for instructor feedback
  const [feedback, setFeedback] = useState<Record<string | number, { text: string; score: number }>>({});
  
  // Calculate the total possible points
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  
  // Calculate the total earned points
  const earnedPoints = submissions.reduce((sum, s) => sum + (s.score || 0), 0);
  
  // Handle answer change
  const handleAnswerChange = (questionId: string | number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // Handle file upload
  const handleFileUpload = (questionId: string | number, files: FileList | null) => {
    if (!files) return;
    
    setFileUploads(prev => ({
      ...prev,
      [questionId]: [...(prev[questionId] || []), ...Array.from(files)]
    }));
  };
  
  // Handle answer submission
  const handleSubmit = (questionId: string | number) => {
    if (!answers[questionId]?.trim() && (!fileUploads[questionId] || fileUploads[questionId].length === 0)) {
      alert('Please provide an answer or attach files before submitting.');
      return;
    }
    
    // Prepare submission data
    const submissionData: Partial<AssessmentSubmission> = {
      questionId,
      answer: answers[questionId] || '',
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    
    // Call the submission handler
    onSubmit?.(submissionData);
    
    // Clear the answer
    setAnswers(prev => ({
      ...prev,
      [questionId]: ''
    }));
    
    // Clear file uploads
    setFileUploads(prev => ({
      ...prev,
      [questionId]: []
    }));
  };
  
  // Handle feedback change
  const handleFeedbackChange = (submissionId: string | number, text: string, score: number) => {
    setFeedback(prev => ({
      ...prev,
      [submissionId]: { text, score }
    }));
  };
  
  // Handle submitting a review
  const handleReviewSubmit = (submissionId: string | number) => {
    const reviewData = feedback[submissionId];
    if (!reviewData?.text) {
      alert('Please provide feedback before submitting the review.');
      return;
    }
    
    onReview?.(submissionId, reviewData.text, reviewData.score);
    
    // Clear the feedback
    setFeedback(prev => {
      const newFeedback = { ...prev };
      delete newFeedback[submissionId];
      return newFeedback;
    });
  };
  
  // Get submission for a specific question
  const getSubmissionForQuestion = (questionId: string | number) => {
    return submissions.find(s => s.questionId === questionId);
  };
  
  // Render the assessment status
  const renderAssessmentStatus = () => {
    if (submissions.length === 0) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-gray-600">No submissions yet. Complete the questions below to submit your assessment.</p>
          </div>
        </div>
      );
    }
    
    const pendingCount = submissions.filter(s => s.status === 'pending').length;
    const reviewedCount = submissions.filter(s => s.status === 'reviewed').length;
    const needsRevisionCount = submissions.filter(s => s.status === 'needs_revision').length;
    
    let statusColor = 'bg-blue-50 text-blue-800';
    let statusIcon = <Clock className="h-5 w-5 text-blue-500 mr-2" />;
    let statusText = 'Assessment in progress';
    
    if (pendingCount === 0 && needsRevisionCount === 0) {
      statusColor = 'bg-green-50 text-green-800';
      statusIcon = <CheckCircle className="h-5 w-5 text-green-500 mr-2" />;
      statusText = 'Assessment completed';
    } else if (reviewedCount > 0 && needsRevisionCount > 0) {
      statusColor = 'bg-amber-50 text-amber-800';
      statusIcon = <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />;
      statusText = 'Some answers need revision';
    }
    
    return (
      <div className={`p-4 rounded-lg ${statusColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {statusIcon}
            <span className="font-medium">{statusText}</span>
          </div>
          
          <div className="text-sm">
            Score: {earnedPoints}/{totalPoints} points ({Math.round((earnedPoints / totalPoints) * 100)}%)
          </div>
        </div>
        
        <div className="mt-3 flex gap-2">
          <Badge variant="outline" className="bg-white">
            {pendingCount} Pending
          </Badge>
          <Badge variant="outline" className="bg-white">
            {reviewedCount} Reviewed
          </Badge>
          {needsRevisionCount > 0 && (
            <Badge variant="outline" className="bg-white text-amber-700">
              {needsRevisionCount} Need Revision
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // Render a specific question with its submission (if any)
  const renderQuestion = (question: AssessmentQuestion, index: number) => {
    const submission = getSubmissionForQuestion(question.id);
    const isSubmitted = !!submission;
    const isReviewed = submission?.status === 'reviewed';
    const needsRevision = submission?.status === 'needs_revision';
    
    return (
      <Card key={question.id} className="mb-6">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <Badge className="mb-2">Question {index + 1}</Badge>
              <CardTitle>{question.text}</CardTitle>
              {question.guidelines && (
                <CardDescription className="mt-2">{question.guidelines}</CardDescription>
              )}
            </div>
            <div className="text-right">
              <span className="font-medium">{question.points} points</span>
              <Badge variant="outline" className="ml-2">
                {question.type === 'subjective' ? 'Written Answer' :
                 question.type === 'coding' ? 'Code Submission' :
                 question.type === 'project' ? 'Project Submission' : 'Presentation'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {question.attachments && question.attachments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Reference Materials:</h4>
              <div className="flex flex-wrap gap-2">
                {question.attachments.map(attachment => (
                  <a 
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm hover:bg-gray-200 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-1 text-blue-500" />
                    {attachment.name}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {isInstructor ? (
            // Instructor view of submissions
            isSubmitted ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Student Submission</h4>
                  <p className="whitespace-pre-wrap">{submission.answer}</p>
                  
                  {submission.attachments && submission.attachments.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-1">Attached Files:</h5>
                      <div className="flex flex-wrap gap-2">
                        {submission.attachments.map(attachment => (
                          <a 
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm hover:bg-gray-200 transition-colors"
                          >
                            <Paperclip className="h-4 w-4 mr-1 text-blue-500" />
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 mt-2">
                    Submitted on {new Date(submission.submittedAt).toLocaleString()}
                  </div>
                </div>
                
                {!isReviewed ? (
                  <div>
                    <h4 className="font-medium mb-2">Provide Feedback</h4>
                    <div className="space-y-3">
                      <Textarea 
                        placeholder="Enter your feedback for the student here..."
                        className="min-h-[100px]"
                        value={feedback[submission.id]?.text || ''}
                        onChange={(e) => handleFeedbackChange(
                          submission.id, 
                          e.target.value, 
                          feedback[submission.id]?.score || 0
                        )}
                      />
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Score (out of {question.points} points)
                        </label>
                        <input 
                          type="number"
                          min="0"
                          max={question.points}
                          className="w-24 px-3 py-2 border rounded"
                          value={feedback[submission.id]?.score || 0}
                          onChange={(e) => handleFeedbackChange(
                            submission.id, 
                            feedback[submission.id]?.text || '', 
                            Math.min(question.points, Math.max(0, parseInt(e.target.value) || 0))
                          )}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleReviewSubmit(submission.id)}
                          disabled={!feedback[submission.id]?.text}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center text-blue-800">
                      <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                      Your Feedback
                    </h4>
                    <p className="whitespace-pre-wrap">{submission.feedback}</p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-gray-600">
                        Reviewed on {submission.reviewedAt ? new Date(submission.reviewedAt).toLocaleString() : 'N/A'}
                      </span>
                      <span className="font-medium">
                        Score: {submission.score}/{question.points}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                <p className="text-gray-600">No submission received for this question yet.</p>
              </div>
            )
          ) : (
            // Student view
            isSubmitted ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Your Submission</h4>
                  <p className="whitespace-pre-wrap">{submission.answer}</p>
                  
                  {submission.attachments && submission.attachments.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-1">Your Attached Files:</h5>
                      <div className="flex flex-wrap gap-2">
                        {submission.attachments.map(attachment => (
                          <a 
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm hover:bg-gray-200 transition-colors"
                          >
                            <Paperclip className="h-4 w-4 mr-1 text-blue-500" />
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 mt-2">
                    Submitted on {new Date(submission.submittedAt).toLocaleString()}
                  </div>
                </div>
                
                {isReviewed && (
                  <div className={`p-4 rounded-lg ${needsRevision ? 'bg-amber-50' : 'bg-green-50'}`}>
                    <h4 className="font-medium mb-2 flex items-center">
                      {needsRevision ? (
                        <>
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          <span className="text-amber-800">Needs Revision</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-green-800">Instructor Feedback</span>
                        </>
                      )}
                    </h4>
                    <p className="whitespace-pre-wrap">{submission.feedback}</p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-gray-600">
                        Reviewed on {submission.reviewedAt ? new Date(submission.reviewedAt).toLocaleString() : 'N/A'}
                      </span>
                      <span className="font-medium">
                        Score: {submission.score}/{question.points}
                      </span>
                    </div>
                  </div>
                )}
                
                {needsRevision && (
                  <div>
                    <h4 className="font-medium mb-2">Revised Answer</h4>
                    <Textarea 
                      placeholder="Enter your revised answer here..."
                      className="min-h-[100px] mb-3"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                    
                    <div className="flex items-center gap-3 mb-3">
                      <Button variant="outline" className="gap-2" asChild>
                        <label>
                          <Upload className="h-4 w-4" />
                          Attach Files
                          <input 
                            type="file" 
                            multiple 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(question.id, e.target.files)}
                          />
                        </label>
                      </Button>
                      
                      {fileUploads[question.id]?.length > 0 && (
                        <span className="text-sm text-gray-600">
                          {fileUploads[question.id].length} file(s) selected
                        </span>
                      )}
                    </div>
                    
                    <Button onClick={() => handleSubmit(question.id)}>
                      Submit Revised Answer
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Textarea 
                  placeholder="Enter your answer here..."
                  className="min-h-[150px] mb-3"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
                
                <div className="flex items-center gap-3 mb-3">
                  <Button variant="outline" className="gap-2" asChild>
                    <label>
                      <Upload className="h-4 w-4" />
                      Attach Files
                      <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(question.id, e.target.files)}
                      />
                    </label>
                  </Button>
                  
                  {fileUploads[question.id]?.length > 0 && (
                    <span className="text-sm text-gray-600">
                      {fileUploads[question.id].length} file(s) selected
                    </span>
                  )}
                </div>
                
                <Button onClick={() => handleSubmit(question.id)}>
                  Submit Answer
                </Button>
              </div>
            )
          )}
        </CardContent>
      </Card>
    );
  };

  // Render all instructor submissions in a table
  const renderInstructorSubmissionsTable = () => {
    if (!isInstructor) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>Review all student submissions in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Question</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Submitted</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Score</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => {
                  const question = questions.find(q => q.id === submission.questionId);
                  if (!question) return null;
                  
                  return (
                    <tr key={submission.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">Q{questions.findIndex(q => q.id === question.id) + 1}: {question.text.substring(0, 30)}...</td>
                      <td className="py-3 px-4">
                        {submission.reviewer ? (
                          <div className="flex items-center">
                            {submission.reviewer.avatarUrl && (
                              <img 
                                src={submission.reviewer.avatarUrl} 
                                alt={submission.reviewer.name}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                            )}
                            <span>{submission.reviewer.name}</span>
                          </div>
                        ) : 'Anonymous'}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {submission.status === 'pending' && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">Pending Review</Badge>
                        )}
                        {submission.status === 'reviewed' && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">Reviewed</Badge>
                        )}
                        {submission.status === 'needs_revision' && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">Needs Revision</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {submission.score !== undefined ? (
                          <span>{submission.score}/{question.points}</span>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => {
                            // Scroll to the question
                            const element = document.getElementById(`question-${question.id}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <FeatureTooltip
      title="Subjective Assessment"
      content="Our assessment system allows instructors to review and provide feedback on subjective answers, coding assignments, projects, and presentations."
      position="top"
      showIcon={false}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              {title}
            </CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {renderAssessmentStatus()}
          </CardContent>
        </Card>
        
        {isInstructor && renderInstructorSubmissionsTable()}
        
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div id={`question-${question.id}`} key={question.id}>
              {renderQuestion(question, index)}
            </div>
          ))}
        </div>
      </div>
    </FeatureTooltip>
  );
}