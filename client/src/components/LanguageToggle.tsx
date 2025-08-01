import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";

export default function LanguageToggle() {
  const { language, setLanguage } = useAuthStore();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="font-medium"
    >
      {language === 'en' ? 'हिंदी' : 'ENG'}
    </Button>
  );
}