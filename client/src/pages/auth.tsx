import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import LanguageToggle from "@/components/LanguageToggle";
import { translations } from "@/lib/translations";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const { setUser, setBusinessProfile, language } = useAuthStore();
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      const data = await response.json();

      setUser(data.user);
      if (data.businessProfile) {
        setBusinessProfile(data.businessProfile);
      }
      setLocation("/dashboard");
    } catch (error: any) {
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{ 
           background: 'linear-gradient(135deg, hsl(207, 90%, 54%) 0%, hsl(207, 90%, 34%) 100%)',
         }}>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='7' cy='27' r='2'/%3E%3Ccircle cx='7' cy='47' r='2'/%3E%3Ccircle cx='27' cy='7' r='2'/%3E%3Ccircle cx='27' cy='27' r='2'/%3E%3Ccircle cx='27' cy='47' r='2'/%3E%3Ccircle cx='47' cy='7' r='2'/%3E%3Ccircle cx='47' cy='27' r='2'/%3E%3Ccircle cx='47' cy='47' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }} />
      
      <div className="relative z-10 glass-effect rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="absolute top-4 right-4">
          <LanguageToggle />
        </div>
        
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
            {t.welcomeTitle}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t.welcomeSubtitle}
          </CardDescription>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">{t.usernameLabel}</Label>
            <Input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              placeholder={t.usernamePlaceholder}
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              placeholder={t.passwordPlaceholder}
              required
              className="w-full"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="loading-spinner" />
                <span>Logging in...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>{t.loginBtn}</span>
              </div>
            )}
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">
            {t.forgotPasswordLink}
          </a>
        </div>
      </div>
    </div>
  );
}
