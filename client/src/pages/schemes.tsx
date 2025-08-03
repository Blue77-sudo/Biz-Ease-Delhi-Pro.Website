import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Coins,
  Lightbulb,
  Building2,
  Gift,
  Globe,
  Settings,
  Sparkles
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { translations } from "@/lib/translations";

export default function SchemesPage() {
  const { user, language } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const t = translations[language];

  const { data: schemes } = useQuery({
    queryKey: ["/api/schemes"],
    select: (data) => {
      if (selectedCategory === "all") return data;
      return Array.isArray(data) ? data.filter((scheme: any) => scheme.schemeType === selectedCategory) : [];
    }
  });

  const recommendedSchemes = [
    {
      name: "MSME Credit Guarantee",
      description: "Collateral-free loans up to ₹2 crores for manufacturing units",
      match: "90% match",
      icon: Coins,
      bgColor: "bg-white/10",
      action: "Learn More"
    },
    {
      name: "Delhi Startup Policy",
      description: "Seed funding, incubation support, and tax benefits for startups",
      match: "85% match",
      icon: Lightbulb,
      bgColor: "bg-white/10",
      action: "Learn More"
    },
    {
      name: "Delhi Industrial Policy",
      description: "Land subsidies, power incentives, and R&D support",
      match: "75% match",
      icon: Building2,
      bgColor: "bg-white/10",
      action: "Learn More"
    }
  ];

  const allSchemes = [
    {
      title: "PM Employment Generation Programme",
      type: "Central Government Scheme",
      description: "Financial assistance to generate employment opportunities in rural and urban areas through setting up new self-employment ventures.",
      funding: "₹10 lakhs - ₹25 lakhs",
      eligibility: "Eligible",
      icon: Coins,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      badgeColor: "bg-green-100 text-green-800"
    },
    {
      title: "Startup India Seed Fund",
      type: "Central Government Scheme",
      description: "Financial assistance for proof of concept, prototype development, product trials, market entry, and commercialization.",
      funding: "Up to ₹20 lakhs",
      eligibility: "Eligible",
      icon: Lightbulb,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Technology Upgradation Fund",
      type: "Delhi Government Scheme",
      description: "Subsidized loans for technology upgradation in manufacturing and processing industries.",
      funding: "₹1 crore - ₹10 crores",
      eligibility: "Under Review",
      icon: Settings,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      badgeColor: "bg-yellow-100 text-yellow-800"
    },
    {
      title: "Export Promotion Scheme",
      type: "Central Government Scheme",
      description: "Financial assistance for market development, participation in trade fairs, and export infrastructure development.",
      funding: "₹5 lakhs - ₹50 lakhs",
      eligibility: "Eligible",
      icon: Globe,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
      badgeColor: "bg-green-100 text-green-800"
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "financial", label: "Financial Assistance" },
    { value: "technology", label: "Technology" },
    { value: "export", label: "Export Promotion" },
    { value: "skill", label: "Skill Development" }
  ];

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-8 desktop-container desktop-spacing lg:space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.schemesTitle}</h1>
        <p className="text-gray-600">{t.schemesSubtitle}</p>
      </div>

      {/* Recommended Schemes */}
      <div className="nav-gradient rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Recommended For Your Business</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedSchemes.map((scheme, index) => {
            const Icon = scheme.icon;
            return (
              <div key={index} className={`${scheme.bgColor} backdrop-blur-sm rounded-lg p-4`}>
                <div className="flex items-center mb-3">
                  <Icon className="h-8 w-8 mr-3" />
                  <div>
                    <h4 className="font-semibold">{scheme.name}</h4>
                    <p className="text-sm opacity-90">{scheme.match}</p>
                  </div>
                </div>
                <p className="text-sm opacity-80 mb-3">{scheme.description}</p>
                <Button className="bg-white text-blue-600 hover:bg-gray-100 text-sm">
                  {scheme.action}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Schemes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Gift className="h-5 w-5" />
              <span>All Available Schemes</span>
            </CardTitle>
            <div className="flex space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Sparkles className="h-4 w-4 mr-2" />
                Refresh Recommendations
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allSchemes.map((scheme, index) => {
              const Icon = scheme.icon;
              return (
                <Card
                  key={index}
                  className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 ${scheme.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                          <Icon className={`h-6 w-6 ${scheme.iconColor}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{scheme.title}</h4>
                          <p className="text-sm text-gray-500">{scheme.type}</p>
                        </div>
                      </div>
                      <Badge className={scheme.badgeColor}>{scheme.eligibility}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{scheme.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">Funding: </span> 
                        <span className="text-green-600">{scheme.funding}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={scheme.eligibility === "Under Review"}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {scheme.eligibility === "Under Review" ? "Under Review" : "Apply Now →"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Application Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Apply</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Check Eligibility</h4>
              <p className="text-sm text-gray-600">Review the eligibility criteria for each scheme to ensure you qualify</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Prepare Documents</h4>
              <p className="text-sm text-gray-600">Gather all required documents and upload them to your document vault</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Submit Application</h4>
              <p className="text-sm text-gray-600">Complete the online application form and track your application status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}