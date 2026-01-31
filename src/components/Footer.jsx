import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { client } from "../lib/sanity";
import { LanguageContext } from "../context/LanguageContext";
import { footerQuery } from "../lib/queries";

import { LuMapPin, LuMail, LuPhone } from "react-icons/lu";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import Loader from "./Loader";
import AnimatedLink from "./AnimatedLink";
import { smootherInstance } from "./ScrollSmoother";

export default function Footer() {
  const { language } = useContext(LanguageContext);
  const lang = language.toLowerCase();
  const location = useLocation();

  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await client.fetch(footerQuery);
      setData(res);
    }
    fetchData();
  }, []);

  // ✅ Scroll to target section
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

  // ✅ Handle link clicks
  const handleLinkClick = (e, url) => {
    const isHome = location.pathname === "/" || location.pathname === "";
    
    if (isHome) {
      // On home page, just scroll
      e.preventDefault();
      scrollToTarget(url);
    }
    // On other pages, let AnimatedLink handle the navigation
  };

  // ✅ Scroll to top handler
  const scrollToTop = () => {
    if (smootherInstance) {
      smootherInstance.scrollTo(0, true);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (!data) return <Loader />;

  return (
    <footer
      className="py-20 bg-black relative"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6 2xl:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Logo */}
          <div>
            {data.logo?.asset?.url && (
              <img
                src={data.logo.asset.url}
                alt="Footer Logo"
                className="w-40"
              />
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h1 className="text-white text-[18px]">
              {data.quickLinksTitle?.[lang]}
            </h1>

            <div className="flex flex-wrap lg:flex-row flex-col gap-6 py-7">
              {data.quickLinks?.map((item, i) => (
                <AnimatedLink
                  key={i}
                  to={`/${item.url}`}
                  onClick={(e) => handleLinkClick(e, item.url)}
                  className="hover:text-primary duration-300 cursor-pointer"
                >
                  {item.label?.[lang]}
                </AnimatedLink>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="xl:ps-20">
            <h1 className="text-white text-[18px]">
              {data.addressTitle?.[lang]}
            </h1>

            <div className="flex flex-col gap-5 pt-5">
              <div className="flex gap-5">
                <LuMapPin className="text-primary mt-1 text-xl" />
                <p className="text-[18px]">
                  {data.addressText?.[lang]}
                </p>
              </div>

              <div className="flex gap-5">
                <LuMail className="text-primary mt-1 text-xl" />
                <p className="text-[18px]">{data.email}</p>
              </div>

              <div className="flex gap-5">
                <LuPhone className="text-primary mt-1 text-xl" />
                <p className="text-[18px]">{data.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <div 
        onClick={scrollToTop}
        className="p-3 cursor-pointer rounded-xl bg-primary absolute -bottom-5 left-1/2 -translate-x-1/2 hover:scale-110 transition-transform duration-300"
      >
        <MdKeyboardDoubleArrowUp className="text-3xl text-black" />
      </div>
    </footer>
  );
}