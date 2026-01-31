import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("EN");

  useEffect(() => {
    if (language === "AR") {
      document.body.setAttribute("dir", "rtl");
      document.body.classList.add("font-ar");
      document.body.classList.remove("font-en");
    } else {
      document.body.setAttribute("dir", "ltr");
      document.body.classList.add("font-en");
      document.body.classList.remove("font-ar");
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
