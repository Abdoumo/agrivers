import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, getLanguage, setLanguage } from "@/utils/language";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguagState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return getLanguage();
    }
    return "en";
  });

  useEffect(() => {
    const lang = getLanguage();
    if (lang !== language) {
      setLanguagState(lang);
    }
    setLanguage(lang);
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguagState(lang);
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context;
}
