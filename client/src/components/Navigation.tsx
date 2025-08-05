import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  LayoutDashboard,
  Building2,
  FileText,
  Shield,
  Lightbulb,
  FolderOpen,
  Globe,
  UserCheck,
  Bell,
  LogOut
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import LanguageToggle from "./LanguageToggle";
import { translations } from "@/lib/translations";

const navigationItems = [
  { path: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { path: "/profile", icon: Building2, key: "businessProfile" },
  { path: "/applications", icon: FileText, key: "applications", hasNotification: true },
  { path: "/compliance", icon: Shield, key: "compliance" },
  { path: "/schemes", icon: Lightbulb, key: "schemes" },
  { path: "/documents", icon: FolderOpen, key: "documents" },
  { path: "/exim", icon: Globe, key: "exim" },
  { path: "/expert", icon: UserCheck, key: "expert" },
];

export function Navigation() {
  const [location] = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user, logout, language } = useAuthStore();
  const t = translations[language];

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  const NavItems = ({ mobile = false }) => (
    <div className={mobile ? "flex flex-col space-y-2" : "flex flex-col space-y-2"}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.path;

        return (
          <Link key={item.path} href={item.path}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={`${
                mobile
                  ? "w-full justify-start text-white hover:bg-white/10"
                  : "w-full justify-start text-white hover:bg-white/10"
              } ${isActive ? "bg-white/20" : ""} relative`}
              onClick={() => setIsSheetOpen(false)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {t[item.key as keyof typeof t] || item.key}
              {item.hasNotification && (
                <Badge className="ml-2 h-2 w-2 p-0 bg-orange-500" />
              )}
            </Button>
          </Link>
        );
      })}
    </div>
  );

  return (
    <header className="nav-gradient shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              {/* Desktop Sidebar Trigger */}
              <SheetTrigger asChild className="hidden md:block">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              {/* Shared Sidebar Content for Mobile & Desktop */}
              <SheetContent side="left" className="nav-gradient border-r-0 w-64">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold">{t.portalTitle}</h2>
                    <p className="text-blue-100 text-xs">{t.portalSubtitle}</p>
                  </div>
                </div>
                <NavItems mobile />
                <div className="mt-8 pt-4 border-t border-white/20">
                  <LanguageToggle mobile />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-white/10 mt-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">{t.portalTitle}</h1>
                <p className="text-blue-100 text-xs">{t.portalSubtitle}</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Removed (Replaced by Sidebar Only) */}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-orange-500" />
            </Button>
            <div className="hidden md:block">
              <LanguageToggle />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}