import { useContext } from "react";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { LanguageContext } from "../context/LanguageContext"; // adjust path if needed
import { Link } from "react-router-dom";
import AnimatedLink from "../components/AnimatedLink";
import SEO from "../components/SEO";

// Multilingual text
const TEXTS = {
  EN: {
    title: "404",
    message: "Oops! Page not found.",
    home: "Go back home",
  },
  FR: {
    title: "404",
    message: "Oups ! Page non trouvée.",
    home: "Retour à l'accueil",
  },
  AR: {
    title: "404",
    message: "عذرًا! الصفحة غير موجودة.",
    home: "العودة إلى الصفحة الرئيسية",
  },
};

export default function NotFound() {
  const { language } = useContext(LanguageContext); // get language from context
  const lang = TEXTS[language] || TEXTS.EN; // fallback to English

  return (
    <>
      {/* SEO - 404 pages should have noindex */}
      <SEO
        title="404 - Page Not Found"
        description="The page you are looking for does not exist. Return to DEVLY homepage to explore our services and projects."
        noindex={true}
      />

      <div
      className={`flex items-center justify-center h-screen text-center p-5 text-white ${
        language === "AR" ? "font-ar" : "font-en"
      }`}
      dir={language === "AR" ? "rtl" : "ltr"} // RTL support
    >
      <div>
        <HiOutlineEmojiSad className="mx-auto mb-10 text-primary text-[150px]" />

        <h1 className="text-6xl font-bold mb-4">{lang.title}</h1>
        <p className="text-xl mb-4">{lang.message}</p>
        <AnimatedLink to="/" className="text-primary hover:underline">
          {lang.home}
        </AnimatedLink>
      </div>
    </div>
    </>
  );
}
