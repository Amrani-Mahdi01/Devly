import { useEffect, useState, useContext, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smootherInstance } from "../components/ScrollSmoother";
import { LuArrowUpRight } from "react-icons/lu";
import { servicesQuery } from "../lib/queries";
import { client } from "../lib/sanity";
import { LanguageContext } from "../context/LanguageContext";
import Loader from "../components/Loader";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const [servicesData, setServicesData] = useState(null);
  const { language } = useContext(LanguageContext);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    async function fetchServices() {
      const data = await client.fetch(servicesQuery);
      setServicesData(data);
    }
    fetchServices();
  }, []);

  const getText = (obj) => {
    if (!obj) return "";
    if (language === "EN") return obj.en;
    if (language === "FR") return obj.fr;
    if (language === "AR") return obj.ar;
  };

  // GSAP Animations optimized for mobile
useEffect(() => {
  if (!servicesData) return;

  const isDesktop = window.innerWidth > 1024; // mobile check
  if (!isDesktop) return; // skip animation on mobile

  const ctx = gsap.context(() => {
    const fadeEls = sectionRef.current.querySelectorAll(".fade-up");

    fadeEls.forEach((el) => {
      gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });

    ScrollTrigger.refresh();
  }, sectionRef);

  return () => ctx.revert();
}, [servicesData]);


  const renderStyledTitle = (text) => {
    if (!text) return null;

    return text.split("\n").map((line, lineIndex) => (
      <span key={lineIndex}>
        {line.split(/(".*?")/g).map((part, i) => {
          if (part.startsWith('"') && part.endsWith('"')) {
            return (
              <span key={i} className="text-primary">
                {part.replace(/"/g, "")}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
        {lineIndex !== text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  if (!servicesData) return <Loader />;

  return (
    <section
      ref={sectionRef}
      className="py-20"
      id="service"
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        {/* Title */}
        <div ref={titleRef}>
          <span className="block text-center font-medium fade-up">
            {getText(servicesData.subtitle)}
          </span>

          <h1 className="text-center text-white text-2xl lg:text-5xl pt-5 fade-up">
            {renderStyledTitle(getText(servicesData.title))}
          </h1>
        </div>

        {/* Services */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 mx-auto pt-16"
        >
          {servicesData.services?.map((service, i) => (
            <div
              key={i}
              className="fade-up p-5 lg:p-10 group bg-lighter border-[2px] border-border rounded-xl flex gap-2 lg:gap-10 hover:border-primary duration-500"
            >
              <h4 className="text-white font-medium text-lg lg:text-2xl">
                {`0${i + 1}.`}
              </h4>

              <div className="flex items-center justify-between w-full">
                <div>
                  <h1 className="lg:text-2xl text-xl font-medium text-white">
                    {getText(service.title)}
                  </h1>
                  <p className="pt-3 text-sm lg:text-base">{getText(service.description)}</p>
                </div>

                <div
                  className="bg-[#131313] border border-border w-12 h-12 rounded-full flex items-center justify-center
                  group-hover:bg-primary group-hover:border-primary transition duration-300"
                >
                  <LuArrowUpRight className="text-2xl group-hover:text-[#131313] transition duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
