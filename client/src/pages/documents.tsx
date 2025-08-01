import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload,
  File,
  FileText,
  Image,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  FolderOpen
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { translations } from "@/lib/translations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function DocumentsPage() {
  const { user, language } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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
      fileSize: 2048576,
      uploadDate: "2025-07-10",
      category: "business",
      isVerified: true
    },
    {
      id: "2",
      fileName: "Owner_Aadhaar.jpg",
      fileType: "image/jpeg",
      fileSize: 1024000,
      uploadDate: "2025-07-05",
      category: "identity",
      isVerified: false
    }
  ];

  const displayDocuments = documents || sampleDocuments;

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Document Vault</h1>
        <p className="text-gray-600">Securely store and manage all your business documents. Documents can be auto-filled into application forms.</p>
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
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="file-upload">Select Documents</Label>
              <Input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="bg-white mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
              </p>
            </div>
            
            <div>
              <Label>Document Category</Label>
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
              <Label>Selected Files:</Label>
              <div className="space-y-1">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <File className="h-4 w-4" />
                    <span>{file.name}</span>
                    <span className="text-gray-400">({formatFileSize(file.size)})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || !selectedCategory || uploadDocumentMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {uploadDocumentMutation.isPending && (
              <div className="loading-spinner mr-2" />
            )}
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayDocuments.map((document: any) => (
                <Card key={document.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(document.fileType)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {document.fileName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatFileSize(document.fileSize)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {document.isVerified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" title="Verified" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" title="Pending Verification" />
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs">
                        {documentCategories.find(cat => cat.value === document.category)?.label || document.category}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(document.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded yet</h3>
              <p className="text-gray-500 mb-4">Upload your first document to get started</p>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline">
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
          <CardTitle>Document Categories Guide</CardTitle>
          <CardDescription>
            Organize your documents properly for easier access during application processes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentCategories.map((category) => (
              <div key={category.value} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{category.label}</h4>
                <p className="text-sm text-gray-600">
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
    </div>
  );
}
