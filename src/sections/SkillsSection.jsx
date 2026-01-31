import { useEffect, useRef, useState, useContext } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client } from "../lib/sanity";
import { skillsSection } from "../lib/queries";
import { LanguageContext } from "../context/LanguageContext";
import Loader from "../components/Loader";
import { smootherInstance } from "../components/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger);

// ✅ Universal Scroll
const scrollToTarget = (target) => {
  if (!target) return;

  if (smootherInstance) {
    smootherInstance.scrollTo(target, true);
  } else {
    const el = document.querySelector(target);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }
};

export default function SkillsSection() {
  const sectionRef = useRef(null);
  const [skillsData, setSkillsData] = useState(null);
  const { language } = useContext(LanguageContext);
  const lang = language === "AR" ? "ar" : "en";

  useEffect(() => {
    client.fetch(skillsSection).then(setSkillsData);
  }, []);

  // ✅ NORMAL SCROLL ANIMATIONS (PER ELEMENT)
  useEffect(() => {
    if (!skillsData) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      const moveY = isMobile ? 15 : 40;
      const duration = isMobile ? 0.5 : 0.9;

      gsap.utils.toArray(".fade-up").forEach((el) => {
        gsap.fromTo(
          el,
          { y: moveY, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration,
            ease: "power2.out",
            overwrite: true,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [skillsData]);

  if (!skillsData) return <Loader />;

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden bg-black lg:my-20 py-20"
    >
      <div className="container relative z-[9] mx-auto max-w-[1600px]">
        <div className="lg:p-10 flex lg:flex-row flex-col">
          <SectionTextContent data={skillsData} lang={lang} />
          <SectionCards data={skillsData} />
        </div>
      </div>
    </section>
  );
}

function SectionTextContent({ data, lang }) {
  return (
    <div className="w-full p-5">
      <span className="font-medium fade-up">{data.subtitle[lang]}</span>

      <h1 className="text-white font-medium pt-2 2xl:leading-16 text-3xl 2xl:text-5xl fade-up">
        {data.title[lang].split("\n").map((line, i) => (
          <span key={i}>
            {line.split(/"(.*?)"/).map((part, j) =>
              j % 2 ? (
                <span key={j} className="text-primary">{part}</span>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
            <br className="hidden md:block" />
          </span>
        ))}
      </h1>

      <p className="leading-8 pt-6 fade-up">
        {data.description[lang].split("\n").map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </p>

      {data.button && (
        <a
          href={data.button.url}
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("#contact");
          }}
          className="px-10 py-3 fade-up w-full text-center lg:text-start lg:w-auto text-black rounded-2xl bg-primary font-semibold mt-10 inline-block text-[18px]"
        >
          {data.button.text[lang]}
        </a>
      )}
    </div>
  );
}

function SectionCards({ data }) {
  return (
    <div className="p-5 flex justify-center w-full">
      <div className="relative w-full fade-up">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-7">
          {data.cards.map((card, i) => (
            <div
              key={i}
              className="w-full p-5 group hover:border-primary border-[2px] bg-lighter flex items-center flex-col gap-5 justify-center border-border rounded-2xl duration-300 fade-up"
            >
              <img
                loading="lazy"
                className="w-full h-10 xl:h-20 object-contain"
                srcSet={`
                  ${card.image.asset.url}?w=300 300w,
                  ${card.image.asset.url}?w=600 600w,
                  ${card.image.asset.url}?w=1200 1200w
                `}
                sizes="(max-width: 768px) 150px, (max-width: 1024px) 300px, 600px"
                src={`${card.image.asset.url}?w=600`}
                alt={card.title}
              />
              <h1 className="2xl:text-[20px] text-nowrap text-white group-hover:text-primary transition-colors duration-300">
                {card.title}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
