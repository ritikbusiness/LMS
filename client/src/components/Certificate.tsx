import { useRef } from "react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface CertificateProps {
  certificate: {
    id: string;
    userName: string;
    courseName: string;
    issuedAt: string;
    certificateId: string;
  };
}

const Certificate: React.FC<CertificateProps> = ({ certificate }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Kayago-Certificate-${certificate.certificateId}.pdf`);
      
      toast({
        title: "Certificate Downloaded",
        description: "Your certificate has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    // Implementation for sharing (could use navigator.share API or copy link to clipboard)
    const shareUrl = `${window.location.origin}/certificates/share/${certificate.certificateId}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({
            title: "Link Copied",
            description: "Certificate link copied to clipboard.",
          });
        })
        .catch(err => {
          console.error("Could not copy text: ", err);
          toast({
            title: "Copy Failed",
            description: "Could not copy link to clipboard.",
            variant: "destructive",
          });
        });
    }
  };

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Course Certificate</h2>
        <p className="mt-1 text-gray-600">Your achievement for completing the course</p>
      </div>
      
      {/* Certificate Preview */}
      <div 
        ref={certificateRef}
        className="border-8 border-primary-100 rounded-lg p-8 mb-6 bg-white shadow-inner"
      >
        <div className="text-center">
          <div className="text-primary-500 text-xl mb-3">KAYAGO LEARNING MANAGEMENT SYSTEM</div>
          <div className="text-4xl font-bold mb-4">CERTIFICATE OF COMPLETION</div>
          <div className="text-gray-500 mb-8">This certifies that</div>
          <div className="text-2xl font-medium mb-2">{certificate.userName}</div>
          <div className="text-gray-500 mb-8">has successfully completed the course</div>
          <div className="text-2xl font-bold text-gray-800 mb-2">{certificate.courseName}</div>
          <div className="text-gray-500 mb-6">Completed on {formattedDate}</div>
          
          <div className="flex justify-center items-center mt-8">
            <div className="mr-12 text-center">
              <div className="h-0.5 w-40 bg-gray-400 mb-2"></div>
              <div className="text-gray-600">Instructor Signature</div>
            </div>
            <div className="text-center">
              <div className="h-0.5 w-40 bg-gray-400 mb-2"></div>
              <div className="text-gray-600">Platform Director</div>
            </div>
          </div>
          
          <div className="mt-6 text-gray-500">
            Certificate ID: {certificate.certificateId}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={handleDownload} className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 flex items-center">
          <i className="ri-download-line mr-2"></i> Download Certificate
        </Button>
        <Button onClick={handleShare} variant="outline" className="ml-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center">
          <i className="ri-share-line mr-2"></i> Share
        </Button>
      </div>
    </div>
  );
};

export default Certificate;
