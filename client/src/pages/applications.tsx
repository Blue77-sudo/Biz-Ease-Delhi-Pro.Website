import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Store, 
  Handshake, 
  Factory, 
  Utensils, 
  Leaf, 
  Receipt,
  Plus,
  Eye,
  Download,
  FileText,
  AlertCircle
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { translations } from "@/lib/translations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Application } from "@shared/schema";

const licenseTypes = [
  {
    id: "shop-establishment",
    name: "Shop & Establishment",
    description: "Required for all commercial establishments in Delhi. No inspection required before registration.",
    processingTime: "7-10 working days",
    fee: "₹500 - ₹2,000",
    icon: Store,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: "trade-license",
    name: "Trade License",
    description: "Municipal license for conducting business activities within Delhi municipal limits.",
    processingTime: "15-20 working days",
    fee: "₹1,000 - ₹5,000",
    icon: Handshake,
    iconColor: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: "factory-license",
    name: "Factory License",
    description: "Now simplified under Delhi Industrial Policy 2020. MSME Udyam Registration or GNCTD documentation required.",
    processingTime: "30-45 working days",
    fee: "₹2,000 - ₹10,000",
    icon: Factory,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: "fssai",
    name: "FSSAI License",
    description: "Food Safety and Standards Authority license for food business operators.",
    processingTime: "10-15 working days",
    fee: "₹100 - ₹7,500",
    icon: Utensils,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    id: "pollution-control",
    name: "Pollution Control",
    description: "Environmental clearance for industries under Delhi Pollution Control Committee.",
    processingTime: "20-30 working days",
    fee: "₹5,000 - ₹25,000",
    icon: Leaf,
    iconColor: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  {
    id: "professional-tax",
    name: "Professional Tax",
    description: "Registration for professional tax for businesses employing staff in Delhi.",
    processingTime: "5-7 working days",
    fee: "₹200 - ₹2,500",
    icon: Receipt,
    iconColor: "text-red-600",
    bgColor: "bg-red-100"
  }
];

export default function ApplicationsPage() {
  const { user, businessProfile, language } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = translations[language];
  const [selectedLicense, setSelectedLicense] = useState<typeof licenseTypes[0] | null>(null);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    licenseType: "",
    businessActivity: "",
    documents: [] as File[]
  });

  const { data: applications, isLoading } = useQuery({
    queryKey: ["/api/applications", user?.id],
    enabled: !!user?.id,
  });

  const createApplicationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/applications", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      setIsApplicationDialogOpen(false);
      setApplicationForm({ licenseType: "", businessActivity: "", documents: [] });
      toast({
        title: "Success",
        description: "Application submitted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLicenseSelect = (license: typeof licenseTypes[0]) => {
    setSelectedLicense(license);
    setApplicationForm(prev => ({ ...prev, licenseType: license.id }));
    setIsApplicationDialogOpen(true);
  };

  const handleSubmitApplication = () => {
    if (!user?.id || !applicationForm.licenseType || !applicationForm.businessActivity) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    const applicationData = {
      userId: user.id,
      licenseType: applicationForm.licenseType,
      status: "pending",
      formData: {
        businessActivity: applicationForm.businessActivity,
        applicantName: businessProfile?.businessName || "",
        businessAddress: businessProfile?.businessAddress || "",
      },
      documents: applicationForm.documents.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
    };

    createApplicationMutation.mutate(applicationData);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="status-pending">Under Review</Badge>;
      case "approved":
        return <Badge className="status-approved">Approved</Badge>;
      case "rejected":
        return <Badge className="status-rejected">Query Raised</Badge>;
      default:
        return <Badge className="status-pending">Pending</Badge>;
    }
  };

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
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-8 desktop-container desktop-spacing lg:space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.applicationsTitle}</h1>
        <p className="text-gray-600">{t.applicationsSubtitle}</p>
      </div>

      <Card>
        <Tabs defaultValue="new-application" className="w-full">
          <div className="border-b">
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0">
              <TabsTrigger 
                value="new-application" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </TabsTrigger>
              <TabsTrigger 
                value="track-applications"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                <FileText className="h-4 w-4 mr-2" />
                Track Applications
              </TabsTrigger>
              <TabsTrigger 
                value="completed-applications"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                <Download className="h-4 w-4 mr-2" />
                Completed
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="new-application" className="p-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Select License Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {licenseTypes.map((license) => {
                  const Icon = license.icon;
                  return (
                    <Card 
                      key={license.id} 
                      className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      onClick={() => handleLicenseSelect(license)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 ${license.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                            <Icon className={`h-6 w-6 ${license.iconColor}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{license.name}</h4>
                            <p className="text-sm text-gray-500">{license.processingTime}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{license.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">{license.fee}</span>
                          <Button size="sm" variant="outline">
                            Apply Now →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="track-applications" className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>License Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Expected Completion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications && Array.isArray(applications) && applications.length > 0 ? (
                    applications.map((app: any) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.applicationId}</TableCell>
                        <TableCell>{app.licenseType}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>{app.submittedDate ? new Date(app.submittedDate).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>
                          {app.expectedCompletion ? new Date(app.expectedCompletion).toLocaleDateString() : 'TBD'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {app.status === "approved" && (
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <AlertCircle className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">No applications found</p>
                          <p className="text-sm text-gray-400">Submit your first application to get started</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="completed-applications" className="p-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No completed applications yet</p>
              <p className="text-sm text-gray-400">Approved applications will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Application Dialog */}
      <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {selectedLicense?.name}</DialogTitle>
            <DialogDescription>
              Please fill out the application form below. Processing time: {selectedLicense?.processingTime}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Applicant Name</Label>
              <Input 
                value={businessProfile?.businessName || ""} 
                readOnly 
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label>Business Address</Label>
              <Textarea 
                value={businessProfile?.businessAddress || ""} 
                readOnly 
                className="bg-gray-50"
                rows={2}
              />
            </div>

            <div>
              <Label>Brief Business Activity</Label>
              <Textarea 
                value={applicationForm.businessActivity}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, businessActivity: e.target.value }))}
                placeholder="Describe your main business activities"
                rows={3}
              />
            </div>

            <div>
              <Label>Upload Required Documents</Label>
              <Input 
                type="file" 
                multiple 
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setApplicationForm(prev => ({ ...prev, documents: files }));
                }}
                className="bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload documents like identity proof, address proof, business registration certificate.
              </p>
            </div>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsApplicationDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitApplication}
              disabled={createApplicationMutation.isPending}
            >
              {createApplicationMutation.isPending && (
                <div className="loading-spinner mr-2" />
              )}
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}