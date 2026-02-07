import { useLanguage } from "./LanguageProvider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
      className="px-3 py-2 rounded-lg border border-border hover:bg-muted/30 transition-colors text-sm font-medium text-foreground"
      title={language === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      {language === "en" ? "العربية" : "English"}
    </button>
  );
}
