import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent,
  DialogTrigger 
} from "@/components/ui/dialog";
import Certificate from "../../components/Certificate";

const Certificates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  // Fetch user's certificates
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["/api/certificates"],
  });

  // Filter certificates based on search term
  const filteredCertificates = certificates?.filter(cert =>
    cert.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCertificate = (certificate: any) => {
    setSelectedCertificate(certificate);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Certificates</h1>

      <div className="mb-6 max-w-md">
        <Input
          placeholder="Search certificates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 h-[200px] animate-pulse"></div>
          ))}
        </div>
      ) : filteredCertificates?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCertificates.map(certificate => (
            <div 
              key={certificate.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="border-8 border-primary-100 p-6">
                <div className="text-center">
                  <div className="text-primary-500 text-base mb-1">KAYAGO LMS</div>
                  <div className="text-xl font-bold mb-2">CERTIFICATE</div>
                  <div className="text-gray-500 text-xs mb-4">This certifies that</div>
                  <div className="text-base font-medium mb-1">{certificate.userName}</div>
                  <div className="text-gray-500 text-xs mb-4">has successfully completed</div>
                  <div className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{certificate.courseName}</div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleOpenCertificate(certificate)}>
                        <i className="ri-eye-line mr-1"></i> View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl p-0">
                      <Certificate certificate={selectedCertificate} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-5xl mb-4">🎓</div>
          <h3 className="text-lg font-medium text-gray-500">No certificates yet</h3>
          <p className="mt-2 text-gray-400 max-w-md mx-auto">
            Complete courses and assessments to earn certificates that showcase your skills
          </p>
          <Button className="mt-6">Explore Courses</Button>
        </div>
      )}
    </div>
  );
};

export default Certificates;
