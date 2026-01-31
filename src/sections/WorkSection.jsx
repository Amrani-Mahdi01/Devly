import { useEffect, useState, useContext, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smootherInstance } from "../components/ScrollSmoother";

import { LuArrowUpRight } from "react-icons/lu";
import { client, urlFor } from "../lib/sanity";
import { LanguageContext } from "../context/LanguageContext";
import { workQuery } from "../lib/queries";
import Loader from "../components/Loader";
import AnimatedLink from "../components/AnimatedLink";

gsap.registerPlugin(ScrollTrigger);

export default function WorkSection() {
  const [servicesData, setServicesData] = useState(null);
  const { language } = useContext(LanguageContext);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    client.fetch(workQuery).then(setServicesData);
  }, []);

  /* ---------------- LANGUAGE HELPER ---------------- */
  const getText = (obj) => {
    if (!obj) return "";
    return language === "FR" ? obj.fr : language === "AR" ? obj.ar : obj.en;
  };

  /* ---------------- STYLE TITLE (highlight words in "") ---------------- */
  const renderStyledTitle = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/(".*?")/g).map((part, j) =>
          part.startsWith('"') && part.endsWith('"') ? (
            <span key={j} className="text-primary">
              {part.replace(/"/g, "")}
            </span>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
        {i !== text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  /* ---------------- SAFE PROJECTS ---------------- */
  const projects = useMemo(() => {
    return (
      servicesData?.projects
        ?.filter(Boolean)
        .sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999)) || []
    );
  }, [servicesData]);

  /* ---------------- FEATURED PROJECTS ---------------- */
  const featuredProjects = projects.filter((p) => p?.featured);

  /* ---------------- GSAP ANIMATION ---------------- */
  useEffect(() => {
    if (!servicesData || isMobile) return;

    let ctx;
    const wait = setInterval(() => {
      if (smootherInstance && titleRef.current && cardsRef.current) {
        clearInterval(wait);

        ctx = gsap.context(() => {
          gsap.fromTo(
            titleRef.current.querySelectorAll(".fade-up"),
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.2,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
            }
          );

          gsap.fromTo(
            cardsRef.current.querySelectorAll(".fade-up"),
            { y: 80, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.15,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: { trigger: cardsRef.current, start: "top 60%" },
            }
          );

          ScrollTrigger.refresh();
        }, sectionRef);
      }
    }, 50);

    return () => {
      clearInterval(wait);
      ctx && ctx.revert();
    };
  }, [servicesData, isMobile]);

  if (!servicesData) return <Loader />;

  return (
    <section
      ref={sectionRef}
      className="py-20"
      id="project"
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6 2xl:px-32">
        {/* -------- TITLE -------- */}
        <div ref={titleRef}>
          <span className="block text-center font-medium fade-up">
            {getText(servicesData.subtitle)}
          </span>

          <h1 className="text-center text-white text-3xl lg:text-5xl pt-5 fade-up">
            {renderStyledTitle(getText(servicesData.title))}
          </h1>
        </div>

        {/* -------- FEATURED PROJECTS -------- */}
        <div ref={cardsRef} className="flex flex-col lg:gap-20 mt-20">
          {featuredProjects.map((project, index) => {
            const isEven = index % 2 === 1;

            return (
              <div
                key={project._id}
                className={`flex flex-col fade-up lg:flex-row items-center gap-10 ${isEven ? "lg:flex-row-reverse" : ""
                  }`}
              >
                {/* IMAGE */}
                <AnimatedLink to={`/projects/${project._id}`} className="w-full cursor-pointer lg:w-1/2">
                  {project.image && (
                    <img
                      loading="lazy"
                      className="w-full object-cover h-[450px]"
                      src={urlFor(project.image).url()}
                      alt={getText(project.title)}
                    />
                  )}
                </AnimatedLink>

                {/* TEXT */}
                <AnimatedLink
                  to={`/projects/${project._id}`}
                  className="w-full lg:w-1/2 2xl:ps-30"
                >
                  <span className="block text-primary font-medium">
                    {getText(project.category)}
                  </span>

                  <h1 className="text-white lg:leading-16 hover:text-primary font-medium duration-300 cursor-pointer py-5 text-3xl lg:text-5xl">
                    {renderStyledTitle(getText(project.title))}
                  </h1>

                  <p className="lg:mt-5 leading-7">
                    {renderStyledTitle(getText(project.description))}
                  </p>

                  <AnimatedLink
                    to={project?._id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#131313] cursor-pointer border my-10 border-border w-12 h-12 rounded-full flex items-center justify-center
    hover:bg-primary hover:border-primary transition duration-300"
                  >
                    <LuArrowUpRight className="text-2xl transition duration-300" />
                  </AnimatedLink>
                </AnimatedLink>
              </div>
            );
          })}
        </div>

        {/* -------- BUTTON -------- */}
        {servicesData.button?.text && servicesData.button.url && (
          <AnimatedLink
            to={servicesData.button.url}
            className="mx-auto mt-20 flex w-fit items-center justify-center px-6 py-3 bg-primary text-black text-xl font-semibold rounded-lg hover:text-primary hover:bg-white transition"
          >
            {getText(servicesData.button.text)}
          </AnimatedLink>
        )}
      </div>
    </section>
  );
}
