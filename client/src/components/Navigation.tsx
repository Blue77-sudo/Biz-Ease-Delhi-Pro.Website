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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout, language } = useAuthStore();
  const t = translations[language];

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  const NavItems = ({ mobile = false }) => (
    <div className={mobile ? "flex flex-col space-y-2" : "flex flex-wrap justify-center items-center space-x-1 lg:space-x-3 xl:space-x-4"}>
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
                  : "text-white hover:bg-white/10 lg:px-5 lg:py-3 xl:px-6 xl:py-3 hover:scale-105"
              } ${isActive ? "bg-white/20 shadow-lg" : ""} relative transition-all duration-200 whitespace-nowrap`}
              onClick={() => mobile && setIsMobileOpen(false)}
            >
              <Icon className={`h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 ${mobile ? "mr-3" : "mr-2 lg:mr-3 xl:mr-3"}`} />
              <span className="text-sm lg:text-base xl:text-lg font-medium hidden sm:inline">
                {t[item.key as keyof typeof t] || item.key}
              </span>
              {item.hasNotification && (
                <Badge className="ml-2 h-2 w-2 p-0 bg-orange-500 animate-pulse" />
              )}
            </Button>
          </Link>
        );
      })}
    </div>
  );

  return (
    <header className="nav-gradient shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 lg:h-24 xl:h-28">
          
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 lg:space-x-6 xl:space-x-8 min-w-0 flex-shrink-0">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 transition-all">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="nav-gradient border-r-0 w-80">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                    <Building2 className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">{t.portalTitle}</h2>
                    <p className="text-blue-100 text-sm">{t.portalSubtitle}</p>
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
            
            <Link href="/dashboard" className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-white rounded-xl shadow-md flex items-center justify-center">
                <Building2 className="h-6 w-6 lg:h-8 lg:w-8 xl:h-9 xl:w-9 text-blue-600" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg lg:text-2xl xl:text-3xl leading-tight">
                  {t.portalTitle}
                </h1>
                <p className="text-blue-100 text-xs lg:text-sm xl:text-base leading-tight">
                  {t.portalSubtitle}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 max-w-4xl mx-4 xl:mx-8 justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
              <NavItems />
            </div>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-6 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 relative lg:h-12 lg:w-12 xl:h-14 xl:w-14 hover:scale-105 transition-all"
            >
              <Bell className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
              <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-orange-500 animate-pulse" />
            </Button>
            <div className="hidden md:block">
              <LanguageToggle />
            </div>
            <Button 
              variant="ghost" 
              className="hidden md:flex items-center text-white hover:bg-white/10 lg:px-4 lg:py-2 xl:px-6 xl:py-3 hover:scale-105 transition-all"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 mr-0 lg:mr-2" />
              <span className="hidden lg:inline text-sm xl:text-base font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
