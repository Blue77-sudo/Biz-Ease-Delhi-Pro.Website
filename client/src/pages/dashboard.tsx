import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Clock, 
  Gift, 
  Shield, 
  CheckCircle, 
  Upload, 
  AlertTriangle,
  Plus,
  Search,
  CreditCard,
  Download,
  Bell,
  Calendar
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { translations } from "@/lib/translations";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, language } = useAuthStore();
  const t = translations[language];

  const { data: applications } = useQuery({
    queryKey: ["/api/applications", user?.id],
    enabled: !!user?.id,
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications", user?.id],
    enabled: !!user?.id,
  });

  const metrics = [
    {
      title: t.activeApplications,
      value: "3",
      description: t.applicationsInProgress,
      icon: FileText,
      color: "metric-primary",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: t.upcomingDeadlines,
      value: "2",
      description: t.dueThisMonth,
      icon: Clock,
      color: "metric-warning",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      title: t.availableSchemes,
      value: "5",
      description: t.eligibleForYou,
      icon: Gift,
      color: "metric-success",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: t.complianceScore,
      value: "92%",
      description: t.excellent,
      icon: Shield,
      color: "metric-info",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600"
    }
  ];

  const recentActivities = [
    {
      icon: CheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      title: "Shop & Establishment License approved",
      time: "2 hours ago"
    },
    {
      icon: Upload,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "GST registration documents uploaded",
      time: "1 day ago"
    },
    {
      icon: AlertTriangle,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
      title: "Query raised for Factory License",
      time: "3 days ago"
    }
  ];

  const urgentAlerts = [
    {
      type: "error",
      title: "GST Return filing due in 5 days",
      description: "Q2 return must be filed by Sep 30, 2025",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-200"
    },
    {
      type: "warning",
      title: "License renewal reminder",
      description: "Shop & Establishment renewal due Aug 25",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200"
    }
  ];

  const quickActions = [
    {
      icon: Plus,
      title: t.newApplication,
      action: () => setLocation("/applications")
    },
    {
      icon: Search,
      title: t.trackApplication,
      action: () => setLocation("/applications")
    },
    {
      icon: CreditCard,
      title: t.payFees,
      action: () => alert("Payment functionality will be integrated with government payment gateway")
    },
    {
      icon: Download,
      title: t.downloadCert,
      action: () => alert("Certificate download functionality")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto container-desktop space-y-6 lg:space-y-8">
      {/* Header */}
        <div className="mb-8 page-header-desktop">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 page-title-desktop">
            {t.dashboardTitle}
          </h1>
          <p className="text-gray-600 lg:text-lg page-subtitle-desktop">
            {t.dashboardSubtitle}
          </p>
        </div>

      {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 mb-8 section-spacing-desktop">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className={`metric-card metric-card-desktop ${metric.color} card-hover transition-all duration-300`}>
              <CardContent className="p-6 lg:p-8">
                <div className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 metric-value">{metric.value}</div>
                <div className="text-sm lg:text-base text-gray-600 metric-label">{metric.title}</div>
                <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="card-hover card-desktop transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 lg:space-x-3">
              <Calendar className="h-5 w-5 lg:h-6 lg:w-6" />
              <span>{t.recentActivity}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 card-content">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Urgent Alerts */}
        <Card className="card-hover card-desktop transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 lg:space-x-3">
              <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
              <span>{t.urgentAlerts}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 card-content">
            {urgentAlerts.map((alert, index) => (
              <div key={index} className={`${alert.bgColor} border ${alert.borderColor} rounded-lg p-4`}>
                <div className="flex items-start space-x-3">
                  <Bell className={`h-5 w-5 mt-1 ${alert.textColor}`} />
                  <div>
                    <p className={`text-sm font-medium ${alert.textColor}`}>{alert.title}</p>
                    <p className={`text-xs mt-1 ${alert.textColor} opacity-80`}>{alert.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-hover card-desktop transition-all duration-300">
        <CardHeader>
          <CardTitle>{t.quickActions}</CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col space-y-2 hover:border-blue-300 hover:bg-blue-50"
                  onClick={action.action}
                >
                  <Icon className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium text-center">{action.title}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}