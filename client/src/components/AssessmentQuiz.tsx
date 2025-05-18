import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "../lib/queryClient";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption?: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  timeLimit?: number;
  passingScore: number;
  questions: Question[];
}

interface AssessmentQuizProps {
  assessment: Assessment;
  courseId: string;
}

const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({ assessment, courseId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(assessment.timeLimit ? assessment.timeLimit * 60 : null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const { toast } = useToast();

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const totalQuestions = assessment.questions.length;

  // Submit assessment mutation
  const submitAssessmentMutation = useMutation({
    mutationFn: (data: { assessmentId: string; answers: Record<number, number> }) => 
      apiRequest("POST", `/api/assessments/${data.assessmentId}/submit`, { answers: data.answers }),
    onSuccess: (data) => {
      setResult(data);
      setQuizCompleted(true);
      
      if (data.passed) {
        setShowCertificateDialog(true);
      }
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/courses", courseId, "progress"] });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your assessment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const answeredQuestions = Object.keys(selectedAnswers).length;
    
    if (answeredQuestions < totalQuestions) {
      const unansweredCount = totalQuestions - answeredQuestions;
      toast({
        title: "Incomplete Assessment",
        description: `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Do you want to review before submitting?`,
        variant: "destructive",
      });
      return;
    }
    
    submitAssessmentMutation.mutate({
      assessmentId: assessment.id,
      answers: selectedAnswers
    });
  };

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div>
      {!quizCompleted ? (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Question {currentQuestionIndex + 1} of {totalQuestions}</div>
                {timeRemaining && (
                  <div className="text-sm font-medium">
                    Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
              
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <label 
                    key={index}
                    className={`flex items-center p-3 border ${
                      selectedAnswers[currentQuestion.id] === index 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200'
                    } rounded-lg hover:bg-gray-50 cursor-pointer transition-colors`}
                  >
                    <input 
                      type="radio" 
                      name={`question-${currentQuestion.id}`} 
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                      checked={selectedAnswers[currentQuestion.id] === index}
                      onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button 
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion.id] === undefined}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={submitAssessmentMutation.isPending}
              >
                {submitAssessmentMutation.isPending ? (
                  <>
                    <div className="mr-2 animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Submitting...
                  </>
                ) : "Submit Assessment"}
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className={`text-4xl mb-4 ${result?.passed ? 'text-green-500' : 'text-amber-500'}`}>
              {result?.passed ? (
                <i className="ri-checkbox-circle-fill"></i>
              ) : (
                <i className="ri-error-warning-fill"></i>
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
              {result?.passed ? "Assessment Passed!" : "Assessment Not Passed"}
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your score: {result?.score}% (Passing score: {assessment.passingScore}%)
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div 
                className={`h-2.5 rounded-full ${result?.passed ? 'bg-green-500' : 'bg-amber-500'}`} 
                style={{ width: `${result?.score}%` }}
              ></div>
            </div>
            
            <div className="flex justify-center space-x-4">
              {result?.passed ? (
                <Button onClick={() => setShowCertificateDialog(true)}>
                  <i className="ri-award-fill mr-2"></i>
                  View Certificate
                </Button>
              ) : (
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <i className="ri-restart-line mr-2"></i>
                  Retry Assessment
                </Button>
              )}
              
              <Button variant="outline" onClick={() => window.history.back()}>
                Return to Course
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <AlertDialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Certificate Generated</AlertDialogTitle>
            <AlertDialogDescription>
              Congratulations! You've successfully completed the assessment and earned a certificate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button onClick={() => window.location.href = '/certificates'}>
                View Certificate
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssessmentQuiz;
