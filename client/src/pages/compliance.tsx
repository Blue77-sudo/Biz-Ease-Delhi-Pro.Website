import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ExclamationTriangleIcon, 
  ClockIcon, 
  InformationCircleIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  BellIcon
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/auth";
import { translations } from "@/lib/translations";

export default function CompliancePage() {
  const { user, language } = useAuthStore();
  const t = translations[language];

  const { data: complianceItems } = useQuery({
    queryKey: ["/api/compliance", user?.id],
    enabled: !!user?.id,
  });

  const upcomingRequirements = [
    {
      type: "urgent",
      title: "GST Return Filing - Q2 2025",
      description: "Due: September 30, 2025 (5 days remaining)",
      penalty: "Late filing penalty: ₹200 per day",
      action: "File Now",
      icon: ExclamationTriangleIcon,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      buttonColor: "bg-red-600 hover:bg-red-700"
    },
    {
      type: "warning",
      title: "Shop & Establishment License Renewal",
      description: "Due: August 25, 2025 (25 days remaining)",
      penalty: "Renewal process takes 7-10 working days",
      action: "Renew Now",
      icon: ClockIcon,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700"
    },
    {
      type: "info",
      title: "Professional Tax Return - Half Yearly",
      description: "Due: December 31, 2025 (90 days remaining)",
      penalty: "Can be filed online through Delhi government portal",
      action: "Prepare Now",
      icon: InformationCircleIcon,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    }
  ];

  const complianceBreakdown = [
    { category: "Tax Compliance", score: 95, color: "text-green-600" },
    { category: "License Compliance", score: 100, color: "text-green-600" },
    { category: "Environmental", score: 80, color: "text-yellow-600" },
    { category: "Labor Compliance", score: 90, color: "text-green-600" }
  ];

  const complianceCalendar = [
    {
      item: "GST Return (GSTR-3B)",
      frequency: "Monthly",
      lastFiled: "Aug 20, 2025",
      nextDue: "Sep 20, 2025",
      status: "Filed",
      statusColor: "status-approved"
    },
    {
      item: "Professional Tax",
      frequency: "Half-yearly",
      lastFiled: "Jun 30, 2025",
      nextDue: "Dec 31, 2025",
      status: "Filed",
      statusColor: "status-approved"
    },
    {
      item: "Environmental Return",
      frequency: "Quarterly",
      lastFiled: "Jul 15, 2025",
      nextDue: "Oct 15, 2025",
      status: "Upcoming",
      statusColor: "status-pending"
    }
  ];

  const overallScore = 92;

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-8 desktop-container desktop-spacing lg:space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.complianceTitle}</h1>
        <p className="text-gray-600">{t.complianceSubtitle}</p>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Requirements */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarDaysIcon className="h-5 w-5" />
                <span>Upcoming Compliance Requirements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingRequirements.map((requirement, index) => {
                const Icon = requirement.icon;
                return (
                  <div
                    key={index}
                    className={`${requirement.bgColor} border ${requirement.borderColor} rounded-lg p-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`h-5 w-5 ${requirement.iconColor}`} />
                        </div>
                        <div>
                          <h4 className={`font-medium ${requirement.textColor}`}>
                            {requirement.title}
                          </h4>
                          <p className={`text-sm mt-1 ${requirement.textColor} opacity-90`}>
                            {requirement.description}
                          </p>
                          <p className={`text-xs mt-2 ${requirement.textColor} opacity-75`}>
                            {requirement.penalty}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className={`${requirement.buttonColor} text-white`}
                      >
                        {requirement.action}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Compliance Score & Breakdown */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5" />
                <span>{t.complianceScore}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="40"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="40"
                    stroke="#10B981"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${(overallScore / 100) * 251.2} 251.2`}
                    className="transition-all duration-500 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-green-600">{overallScore}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{t.excellent} compliance rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.category}</span>
                  <span className={`text-sm font-semibold ${item.color}`}>{item.score}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compliance Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-5 w-5" />
            <span>Annual Compliance Calendar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Compliance Item</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Last Filed</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complianceCalendar.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell>{item.frequency}</TableCell>
                    <TableCell>{item.lastFiled}</TableCell>
                    <TableCell>{item.nextDue}</TableCell>
                    <TableCell>
                      <Badge className={item.statusColor}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        {item.status === "Filed" ? "View Return" : "Prepare"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <p>Receive smart alerts directly on your dashboard and email for all critical compliance deadlines.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}