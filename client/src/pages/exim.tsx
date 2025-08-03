import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GlobeAltIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  TruckIcon,
  BuildingOfficeIcon,
  InformationCircleIcon,
  BookOpenIcon,
  LinkIcon
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/auth";
import { translations } from "@/lib/translations";

export default function EximPage() {
  const { language } = useAuthStore();
  const t = translations[language];

  const keyProcedures = [
    {
      title: "Importer-Exporter Code (IEC)",
      description: "Mandatory for all import/export activities",
      icon: BuildingOfficeIcon,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Registration cum Membership Certificate (RCMC)",
      description: "Required for availing export benefits",
      icon: DocumentTextIcon,
      iconColor: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Customs Clearance",
      description: "Bill of Entry (imports) and Shipping Bill (exports)",
      icon: TruckIcon,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Payment Methods",
      description: "Letters of Credit (LC), CAD, and other methods",
      icon: CurrencyDollarIcon,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const eximSchemes = [
    {
      title: "Advance Authorization Scheme",
      description: "Duty-free import of inputs for export production",
      benefits: ["Zero customs duty on imports", "Export obligation compliance", "Used for manufacturing exports"],
      eligibility: "Manufacturing exporters",
      authority: "DGFT"
    },
    {
      title: "EPCG (Export Promotion Capital Goods)",
      description: "Import capital goods at zero customs duty for export obligations",
      benefits: ["Zero duty on capital goods", "Technology upgradation", "Export performance improvement"],
      eligibility: "Exporters with minimum export performance",
      authority: "DGFT"
    },
    {
      title: "RoDTEP Scheme",
      description: "Remission of Duties and Taxes on Exported Products",
      benefits: ["Rebate of embedded taxes", "Replaces MEIS", "Covers central, state, and local levies"],
      eligibility: "All exporters",
      authority: "DGFT"
    },
    {
      title: "Market Access Initiative (MAI)",
      description: "Financial assistance for export promotion activities",
      benefits: ["Trade fair participation", "Market studies", "Export infrastructure development"],
      eligibility: "Export promotion organizations",
      authority: "Department of Commerce"
    }
  ];

  const resources = [
    {
      title: "Directorate General of Foreign Trade (DGFT)",
      description: "Primary authority for India's export-import policy",
      url: "https://dgft.gov.in/",
      icon: BuildingOfficeIcon,
      type: "Government Portal"
    },
    {
      title: "Export-Import Bank of India (EXIM Bank)",
      description: "Principal financial institution for export-import financing",
      url: "https://www.eximbankindia.in/",
      icon: CurrencyDollarIcon,
      type: "Financial Institution"
    },
    {
      title: "Indian Trade Portal",
      description: "Comprehensive information on trade procedures and policies",
      url: "https://indiantradeportal.in/",
      icon: GlobeAltIcon,
      type: "Information Portal"
    },
    {
      title: "ICEGATE",
      description: "Indian Customs EDI Gateway for online customs clearance",
      url: "https://www.icegate.gov.in/",
      icon: TruckIcon,
      type: "Customs Portal"
    }
  ];

  const documentationList = [
    {
      category: "Commercial Documents",
      documents: ["Commercial Invoice", "Packing List", "Bill of Lading/Airway Bill", "Certificate of Origin"]
    },
    {
      category: "Regulatory Documents",
      documents: ["Export License (if required)", "Import License (if required)", "Phytosanitary Certificate", "Quality Certificates"]
    },
    {
      category: "Financial Documents",
      documents: ["Letter of Credit", "Bank Realization Certificate", "Export Declaration Form", "Import General Manifest"]
    },
    {
      category: "Customs Documents",
      documents: ["Shipping Bill (Export)", "Bill of Entry (Import)", "Customs Invoice", "Assessment Order"]
    }
  ];

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-8 desktop-container desktop-spacing lg:space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">EXIM Support: Export-Import Facilitation</h1>
        <p className="text-gray-600">Navigate the complexities of international trade with ease. Find information on export-import procedures, documentation, and government schemes.</p>
      </div>

      <Tabs defaultValue="procedures" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="procedures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpenIcon className="h-5 w-5" />
                <span>Key Procedures & Requirements</span>
              </CardTitle>
              <CardDescription>
                Essential procedures and requirements for import-export business in India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {keyProcedures.map((procedure, index) => {
                  const Icon = procedure.icon;
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 ${procedure.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                          <Icon className={`h-6 w-6 ${procedure.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{procedure.title}</h3>
                          <p className="text-sm text-gray-600">{procedure.description}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Export Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Obtain IEC Number", description: "Apply for Importer-Exporter Code from DGFT" },
                  { step: 2, title: "Register with Export Promotion Council", description: "Get RCMC for your product category" },
                  { step: 3, title: "Find International Buyers", description: "Use trade portals, exhibitions, and business networks" },
                  { step: 4, title: "Negotiate and Finalize Order", description: "Agree on terms, payment methods, and delivery" },
                  { step: 5, title: "Arrange Pre-shipment Finance", description: "Get working capital support from banks" },
                  { step: 6, title: "Manufacture/Procure Goods", description: "Ensure quality standards and export regulations" },
                  { step: 7, title: "Get Quality Certificates", description: "Obtain necessary quality and origin certificates" },
                  { step: 8, title: "Customs Clearance", description: "File shipping bill and complete export formalities" },
                  { step: 9, title: "Shipment and Documentation", description: "Ship goods and submit required documents to bank" },
                  { step: 10, title: "Realize Export Proceeds", description: "Receive payment and complete FIDR/BRC formalities" }
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schemes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GlobeAltIcon className="h-5 w-5" />
                <span>Government EXIM Schemes & Incentives</span>
              </CardTitle>
              <CardDescription>
                Various government schemes to promote exports and ease import procedures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {eximSchemes.map((scheme, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{scheme.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <Badge variant="outline">Authority: {scheme.authority}</Badge>
                          <Badge variant="outline">Eligibility: {scheme.eligibility}</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Benefits:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {scheme.benefits.map((benefit, idx) => (
                          <li key={idx}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline">
                        Apply for Scheme
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DocumentTextIcon className="h-5 w-5" />
                <span>Required Documentation</span>
              </CardTitle>
              <CardDescription>
                Comprehensive list of documents required for export-import operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documentationList.map((category, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">{category.category}</h3>
                    <ul className="space-y-2">
                      {category.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Preparation Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Ensure all documents are properly stamped and signed",
                  "Check for accuracy in product descriptions and quantities",
                  "Verify HS codes and tariff classifications",
                  "Confirm compliance with destination country requirements",
                  "Maintain consistency across all documents",
                  "Keep digital and physical copies for records"
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LinkIcon className="h-5 w-5" />
                <span>Useful Resources</span>
              </CardTitle>
              <CardDescription>
                Important government portals and resources for export-import business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          <Badge variant="outline" className="mb-3">{resource.type}</Badge>
                          <div>
                            <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700">
                              <LinkIcon className="h-4 w-4 mr-1" />
                              Visit Portal
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-medium text-gray-900 mb-2">DGFT Helpline</h4>
                  <p className="text-sm text-gray-600 mb-1">1800-11-3535</p>
                  <p className="text-xs text-gray-500">Monday to Friday, 9 AM - 6 PM</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-900 mb-2">Customs Helpline</h4>
                  <p className="text-sm text-gray-600 mb-1">1800-11-1011</p>
                  <p className="text-xs text-gray-500">24/7 Support Available</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-900 mb-2">Export Helpdesk</h4>
                  <p className="text-sm text-gray-600 mb-1">export@fidr.gov.in</p>
                  <p className="text-xs text-gray-500">Email Support</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Need Expert Assistance?</h4>
                  <p className="text-sm text-blue-800 mb-4">
                    For specific queries regarding export-import procedures, documentation, or scheme applications, 
                    you can use our "Ask an Expert" feature or consult with our AI Assistant "Sathi".
                  </p>
                  <div className="flex space-x-3">
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      Ask an Expert
                    </Button>
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      Chat with Sathi
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}