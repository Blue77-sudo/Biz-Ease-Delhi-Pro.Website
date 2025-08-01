import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/lib/auth";
import { Navigation } from "@/components/Navigation";
import { AIAssistant } from "@/components/AIAssistant";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import ProfilePage from "@/pages/profile";
import ApplicationsPage from "@/pages/applications";
import CompliancePage from "@/pages/compliance";
import SchemesPage from "@/pages/schemes";
import DocumentsPage from "@/pages/documents";
import EximPage from "@/pages/exim";
import ExpertPage from "@/pages/expert";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <AuthPage />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Component />
      <AIAssistant />
    </div>
  );
}

function Router() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={ProfilePage} />
      </Route>
      <Route path="/applications">
        <ProtectedRoute component={ApplicationsPage} />
      </Route>
      <Route path="/compliance">
        <ProtectedRoute component={CompliancePage} />
      </Route>
      <Route path="/schemes">
        <ProtectedRoute component={SchemesPage} />
      </Route>
      <Route path="/documents">
        <ProtectedRoute component={DocumentsPage} />
      </Route>
      <Route path="/exim">
        <ProtectedRoute component={EximPage} />
      </Route>
      <Route path="/expert">
        <ProtectedRoute component={ExpertPage} />
      </Route>
      <Route path="/">
        {isAuthenticated ? <ProtectedRoute component={Dashboard} /> : <AuthPage />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
