import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuMenu, LuGlobe, LuX } from "react-icons/lu";
import { client } from "../lib/sanity";
import { headerQuery } from "../lib/queries";
import { LanguageContext } from "../context/LanguageContext";
import { smootherInstance } from "./ScrollSmoother";
import AnimatedLink from "./AnimatedLink";
import LanguageTransition from "./LanguageTransition";

export default function Header() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [headerData, setHeaderData] = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langTrigger, setLangTrigger] = useState(false);
  const [pendingLang, setPendingLang] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const handleLanguageChange = (lang) => {
    setPendingLang(lang.toUpperCase());
    setLangTrigger(true); // trigger the animation
  };

  const handleLangChange = () => {
    if (pendingLang) {
      setLanguage(pendingLang); // change immediately when overlay covers
      setPendingLang(null);
    }
  };

  // ✅ UNIVERSAL SCROLL FUNCTION (Desktop + Mobile)
  const scrollToTarget = (target) => {
    if (!target) return;

    if (smootherInstance) {
      smootherInstance.scrollTo(target, true);
    } else {
      const el = document.querySelector(target);
      if (el) {
        const headerOffset = -90;
        const y =
          el.getBoundingClientRect().top + window.pageYOffset + headerOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    }
  };

  // ✅ Handle navigation - either scroll on same page or navigate to home first
  const handleNavClick = (e, url) => {
    // Check if we're on the home page
    const isHome = location.pathname === "/" || location.pathname === "";
    
    if (isHome) {
      // Already on home page, just scroll (prevent default and AnimatedLink transition)
      e.preventDefault();
      scrollToTarget(url);
      setMenuOpen(false);
    }
    // If not on home page, don't prevent default - let AnimatedLink handle the page transition
  };

  // ✅ Scroll to section after navigation (when coming from another page)
  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToTarget(location.hash);
      }, 300);
    }
  }, [location]);

  // ✅ Fetch header data
  useEffect(() => {
    async function getHeader() {
      const data = await client.fetch(headerQuery);
      setHeaderData(data);
    }
    getHeader();
  }, []);

  // ✅ Disable scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);

  // ✅ Header scroll effect - FIXED FOR DESKTOP WITH GSAP + MOBILE
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = smootherInstance 
        ? smootherInstance.scrollTop() 
        : window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(scrollY > 50);
    };

    handleScroll(); // check on mount

    // For desktop with ScrollSmoother
    if (smootherInstance) {
      const checkInterval = setInterval(handleScroll, 100);
      return () => clearInterval(checkInterval);
    }

    // For mobile without ScrollSmoother
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, []);

  if (!headerData) return null;

  const navLinks = headerData.navlinks || [];
  const ctaUrl = headerData.mainButton?.url;

  const ctaText =
    language === "EN"
      ? headerData.mainButton?.text_en ?? "Let's Talk"
      : language === "FR"
      ? headerData.mainButton?.text_fr ?? "Parlons-en"
      : headerData.mainButton?.text_ar ?? "فلنتحدث";

  const languages = headerData.availableLanguages || ["EN", "FR", "AR"];

  return (
    <header
      id="main-header"
      data-speed="1"
      className={`fixed top-0 left-0 w-full z-10 transition-all duration-500 h-[90px] lg:h-[100px] ${
        scrolled ? "bg-black shadow-lg" : "bg-transparent"
      }`}
      style={{ position: 'fixed' }}
    >
      <div className="container h-full flex items-center justify-between px-4 mx-auto max-w-[1600px] transition-all duration-500">
        {/* Logo */}
        <AnimatedLink to={"/"} className="inline-block">
          <img
            src={headerData.logo?.asset?.url || ""}
            className={`cursor-pointer transition-all duration-500 ${
              scrolled ? "w-24 lg:w-28" : "w-32 lg:w-40"
            }`}
            alt="Company Logo"
          />
        </AnimatedLink>

        {/* Desktop Nav */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-5 text-white">
            {navLinks.map((link, i) => {
              const label =
                language === "AR"
                  ? link.text_ar
                  : language === "FR"
                  ? link.text_fr
                  : link.text_en;

              return (
                <li key={i} className="relative">
                  <AnimatedLink
                    to={`/${link.url}`}
                    className="group relative text-lg py-2 duration-300 hover:text-primary inline-block"
                    onClick={(e) => handleNavClick(e, link.url)}
                  >
                    {label}
                    <span
                      className={`absolute bottom-0 block h-[1px] w-0 opacity-0 transition-all duration-300 ${
                        language === "AR"
                          ? "right-0 group-hover:w-[50%] group-hover:opacity-100"
                          : "left-0 group-hover:w-[50%] group-hover:opacity-100"
                      } bg-primary`}
                    />
                  </AnimatedLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3 relative">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden rounded-full text-white w-[45px] h-[45px] flex items-center justify-center border border-border"
          >
            {menuOpen ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="rounded-full text-white w-[70px] h-[45px] flex items-center justify-center gap-2 border border-border"
            >
              <LuGlobe size={18} />
              {language}
            </button>

            {langOpen && (
              <ul className="absolute right-0 mt-2 w-24 bg-[#131313] border border-border rounded-md shadow-lg z-50">
                {languages.map((lang) => (
                  <li
                    key={lang}
                    onClick={() => {
                      handleLanguageChange(lang);
                      setLangOpen(false);
                    }}
                    className="cursor-pointer px-4 py-2 hover:bg-primary hover:text-black transition-colors"
                  >
                    {lang.toUpperCase()}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Desktop CTA */}
          <AnimatedLink
            to={`/${ctaUrl}`}
            onClick={(e) => handleNavClick(e, ctaUrl)}
            className="hidden lg:block bg-primary capitalize text-lg text-black font-semibold px-5 py-2 rounded-xl"
          >
            {ctaText}
          </AnimatedLink>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-[9999] bg-black transition-opacity duration-300 flex items-center justify-center h-screen ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-white w-[45px] h-[45px] flex items-center justify-center border border-border rounded-full"
        >
          <LuX size={22} />
        </button>

        <ul
          className={`flex flex-col items-center w-full gap-16 px-6 text-white transition-transform duration-500 ${
            menuOpen ? "scale-100" : "scale-95"
          }`}
        >
          {navLinks.map((link, index) => {
            const label =
              language === "AR"
                ? link.text_ar
                : language === "FR"
                ? link.text_fr
                : link.text_en;

            return (
              <li
                key={index}
                style={{ transitionDelay: `${index * 80}ms` }}
                className={`transition-transform duration-500 ${
                  menuOpen ? "translate-y-0" : "translate-y-6"
                }`}
              >
                <AnimatedLink
                  to={`/${link.url}`}
                  onClick={(e) => handleNavClick(e, link.url)}
                  className="block text-2xl hover:text-primary duration-300"
                >
                  {label}
                </AnimatedLink>
              </li>
            );
          })}

          <AnimatedLink
            to={`/${ctaUrl}`}
            onClick={(e) => handleNavClick(e, ctaUrl)}
            className="bg-primary capitalize text-lg text-black font-semibold px-5 py-2 rounded-xl"
          >
            {ctaText}
          </AnimatedLink>
        </ul>
      </div>

      {/* Language transition overlay */}
      <LanguageTransition
        trigger={langTrigger}
        onLangChange={handleLangChange} // immediate language change
        onComplete={() => setLangTrigger(false)} // hide overlay after exit
      />
    </header>
  );
}