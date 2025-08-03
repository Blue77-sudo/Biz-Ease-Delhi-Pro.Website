import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Upload,
  File,
  FileText,
  Image,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  FolderOpen,
  Link,
  Shield,
  Download,
  CreditCard,
  IndianRupee
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { translations } from "@/lib/translations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DocumentsPage() {
  const { user, language } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDigiLockerConnected, setIsDigiLockerConnected] = useState(false);
  const [showDigiLockerDocs, setShowDigiLockerDocs] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/documents", user?.id],
    enabled: !!user?.id,
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: (documentData: any) => apiRequest("POST", "/api/documents", documentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setSelectedFiles([]);
      setSelectedCategory("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast({
        title: "Success",
        description: "Documents uploaded successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: string) => apiRequest("DELETE", `/api/documents/${documentId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Success",
        description: "Document deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const connectDigiLockerMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/digilocker/connect", { userId: user?.id }),
    onSuccess: () => {
      setIsDigiLockerConnected(true);
      toast({
        title: "Success",
        description: "DigiLocker connected successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to connect to DigiLocker. Please try again.",
        variant: "destructive",
      });
    },
  });

  const importDigiLockerDocMutation = useMutation({
    mutationFn: (docData: any) => apiRequest("POST", "/api/digilocker/import", { 
      userId: user?.id, 
      documentType: docData.type,
      documentId: docData.id 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Success",
        description: "Document imported from DigiLocker successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to import document from DigiLocker.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (!user?.id || selectedFiles.length === 0 || !selectedCategory) {
      toast({
        title: "Error",
        description: "Please select files and category before uploading.",
        variant: "destructive",
      });
      return;
    }

    selectedFiles.forEach((file) => {
      const documentData = {
        userId: user.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        category: selectedCategory,
      };
      uploadDocumentMutation.mutate(documentData);
    });
  };

  const handleDelete = (documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocumentMutation.mutate(documentId);
    }
  };

  const handleConnectDigiLocker = () => {
    connectDigiLockerMutation.mutate();
  };

  const handleImportFromDigiLocker = (type: string, id: string) => {
    importDigiLockerDocMutation.mutate({ type, id });
  };

  const processPaymentMutation = useMutation({
    mutationFn: (paymentData: any) => apiRequest("POST", "/api/documents/payment", paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setShowPaymentDialog(false);
      setSelectedDocument(null);
      toast({
        title: "Payment Successful",
        description: "Your document processing fee has been paid successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePayment = (document: any) => {
    setSelectedDocument(document);
    setShowPaymentDialog(true);
  };

  const processPayment = () => {
    if (!selectedDocument) return;

    processPaymentMutation.mutate({
      documentId: selectedDocument.id,
      userId: user?.id,
      amount: selectedDocument.processingFee || 500,
      paymentMethod: "online"
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (fileType.includes("image")) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <File className="h-8 w-8 text-blue-600" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const documentCategories = [
    { value: "identity", label: "Identity Documents" },
    { value: "address", label: "Address Proof" },
    { value: "business", label: "Business Registration" },
    { value: "financial", label: "Financial Documents" },
    { value: "tax", label: "Tax Documents" },
    { value: "licenses", label: "Licenses & Permits" },
    { value: "other", label: "Other" }
  ];

  const sampleDocuments = [
    {
      id: "1",
      fileName: "Business_Registration_Certificate.pdf",
      fileType: "application/pdf",
      fileSize: 1024000,
      category: "business",
      uploadedAt: "2025-01-01T10:00:00Z",
      isVerified: true,
      source: "upload",
      approvalStatus: "approved_pending_payment",
      processingFee: 750
    },
    {
      id: "2", 
      fileName: "GST_Certificate.pdf",
      fileType: "application/pdf",
      fileSize: 512000,
      category: "tax",
      uploadedAt: "2025-01-02T10:00:00Z",
      isVerified: true,
      source: "upload",
      approvalStatus: "approved",
      processingFee: 0
    }
  ];

  const digiLockerDocuments = [
    {
      id: "dl_1",
      name: "Aadhaar Card",
      type: "identity",
      issuer: "UIDAI",
      validUntil: "Permanent",
      isAvailable: true
    },
    {
      id: "dl_2", 
      name: "PAN Card",
      type: "identity",
      issuer: "Income Tax Department",
      validUntil: "Permanent",
      isAvailable: true
    },
    {
      id: "dl_3",
      name: "Driving License",
      type: "identity", 
      issuer: "RTO Delhi",
      validUntil: "2028-03-15",
      isAvailable: true
    },
    {
      id: "dl_4",
      name: "Voter ID",
      type: "identity",
      issuer: "Election Commission",
      validUntil: "Permanent", 
      isAvailable: true
    },
    {
      id: "dl_5",
      name: "Passport",
      type: "identity",
      issuer: "MEA",
      validUntil: "2030-12-10",
      isAvailable: false
    }
  ];

  const displayDocuments = documents || sampleDocuments;
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4 sm:space-y-6">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-2/3 sm:w-1/3" />
          <div className="h-64 sm:h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Digital Document Vault</h1>
        <p className="text-sm sm:text-base text-gray-600">Securely store and manage all your business documents. Documents can be auto-filled into application forms.</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload New Documents</span>
          </CardTitle>
          <CardDescription>
            Upload your business documents for secure storage and easy access during applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="file-upload" className="text-sm sm:text-base">Select Documents</Label>
              <Input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="bg-white mt-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
              </p>
            </div>

            <div>
              <Label className="text-sm sm:text-base">Document Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Selected Files:</Label>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                    <File className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate flex-1">{file.name}</span>
                    <span className="text-gray-400 text-xs">({formatFileSize(file.size)})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || !selectedCategory || uploadDocumentMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            size={isMobile ? "lg" : "default"}
          >
            {uploadDocumentMutation.isPending && (
              <div className="loading-spinner mr-2" />
            )}
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
        </CardContent>
      </Card>

      {/* DigiLocker Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>DigiLocker Integration</span>
          </CardTitle>
          <CardDescription>
            Connect to DigiLocker to access your government-issued digital documents instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isDigiLockerConnected ? (
            <div className="text-center py-6 sm:py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Connect to DigiLocker</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                Access your Aadhaar, PAN, Driving License, and other government documents directly from DigiLocker.
              </p>
              <Button 
                onClick={handleConnectDigiLocker}
                disabled={connectDigiLockerMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                size={isMobile ? "lg" : "default"}
              >
                {connectDigiLockerMutation.isPending && (
                  <div className="loading-spinner mr-2" />
                )}
                <Link className="h-4 w-4 mr-2" />
                Connect DigiLocker
              </Button>
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>✓ Secure OAuth 2.0 authentication</p>
                <p>✓ Government-verified documents</p>
                <p>✓ No document upload required</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">DigiLocker Connected</p>
                    <p className="text-sm text-green-700">Your digital documents are now accessible</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDigiLockerDocs(!showDigiLockerDocs)}
                >
                  {showDigiLockerDocs ? "Hide" : "View"} Documents
                </Button>
              </div>

              {showDigiLockerDocs && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Available Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {digiLockerDocuments.map((doc) => (
                      <div key={doc.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2 flex-wrap">
                              <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900 text-sm truncate">{doc.name}</span>
                              {doc.isAvailable && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 flex-shrink-0">
                                  Available
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">Issued by: {doc.issuer}</p>
                            <p className="text-xs text-gray-600">Valid until: {doc.validUntil}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!doc.isAvailable || importDigiLockerDocMutation.isPending}
                            onClick={() => handleImportFromDigiLocker(doc.type, doc.id)}
                            className="flex-shrink-0"
                          >
                            {importDigiLockerDocMutation.isPending ? (
                              <div className="loading-spinner mr-1" />
                            ) : (
                              <Download className="h-3 w-3 mr-1" />
                            )}
                            {isMobile ? "" : "Import"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 p-3 bg-blue-50 rounded-lg">
                    <p><strong>Note:</strong> Documents imported from DigiLocker are automatically verified and can be used for all government applications.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5" />
            <span>Your Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(displayDocuments) && displayDocuments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {displayDocuments.map((document: any) => (
                <Card key={document.id} className="border border-gray-200">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {getFileIcon(document.fileType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                            {document.fileName}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Uploaded: {new Date(document.uploadedAt || document.uploadDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatFileSize(document.fileSize)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {document.isVerified ? (
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" title="Verified" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" title="Pending Verification" />
                        )}
                      </div>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {documentCategories.find(cat => cat.value === document.category)?.label || document.category}
                      </Badge>
                      {document.approvalStatus === "approved_pending_payment" && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          Payment Pending
                        </Badge>
                      )}
                      {document.approvalStatus === "approved" && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Approved
                        </Badge>
                      )}
                    </div>

                    {document.approvalStatus === "approved_pending_payment" && (
                      <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-orange-900">Processing Fee</p>
                            <p className="text-sm font-bold text-orange-700">₹{document.processingFee}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handlePayment(document)}
                            className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1"
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            Pay Now
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs sm:text-sm">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(document.id)}
                        className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        {!isMobile && <span className="ml-1">Delete</span>}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 px-4">
              <FolderOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No documents uploaded yet</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">Upload your first document to get started</p>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline"
                size={isMobile ? "lg" : "default"}
                className="w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Categories Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Document Categories Guide</CardTitle>
          <CardDescription className="text-sm">
            Organize your documents properly for easier access during application processes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {documentCategories.map((category) => (
              <div key={category.value} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{category.label}</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  {category.value === "identity" && "Aadhaar, PAN Card, Passport, etc."}
                  {category.value === "address" && "Utility bills, rent agreement, property documents"}
                  {category.value === "business" && "Business registration, MOA, AOA, partnership deed"}
                  {category.value === "financial" && "Bank statements, balance sheets, audit reports"}
                  {category.value === "tax" && "GST certificates, tax returns, TDS certificates"}
                  {category.value === "licenses" && "Existing licenses, permits, certificates"}
                  {category.value === "other" && "Any other relevant business documents"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px] mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Process Payment</span>
            </DialogTitle>
            <DialogDescription>
              Complete the payment to finalize your document processing.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Document Details</h4>
                <p className="text-sm text-gray-600 mb-1">File: {selectedDocument.fileName}</p>
                <p className="text-sm text-gray-600">Category: {documentCategories.find(cat => cat.value === selectedDocument.category)?.label}</p>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Processing Fee</p>
                    <p className="text-sm text-blue-700">Government processing charges</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-900 flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {selectedDocument.processingFee}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p><strong>Note:</strong> This fee is charged by the government for document verification and processing. Payment is secure and processed through authorized payment gateways.</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={processPayment}
              disabled={processPaymentMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              {processPaymentMutation.isPending && (
                <div className="loading-spinner mr-2" />
              )}
              <CreditCard className="h-4 w-4 mr-2" />
              Pay ₹{selectedDocument?.processingFee}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}