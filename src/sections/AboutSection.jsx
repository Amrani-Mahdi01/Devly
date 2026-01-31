import { useContext, useEffect, useState, useRef } from "react";
import { LuCheck, LuMail, LuPhone, LuArrowUpRight } from "react-icons/lu";
import { LanguageContext } from "../context/LanguageContext";
import { client } from "../lib/sanity";
import { aboutQuery } from "../lib/queries";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "../components/Loader";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const { language } = useContext(LanguageContext);
  const [about, setAbout] = useState(null);
  const sectionRef = useRef(null);

  const lang = language.toLowerCase();

  // Fetch About data
  useEffect(() => {
    const fetchData = async () => {
      const data = await client.fetch(aboutQuery);
      setAbout(data);
    };
    fetchData();
  }, []);

  // GSAP fade-up animations
  useEffect(() => {
    if (!about) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const fadeEls = sectionRef.current.querySelectorAll(".fade-up");

      fadeEls.forEach((el) => {
        gsap.from(el, {
          y: isMobile ? 20 : 50, // smaller movement on mobile
          opacity: 0,
          duration: isMobile ? 0.7 : 1.2, // faster on mobile
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });

      // Skip heavy ScrollTrigger refresh on mobile
      if (!isMobile) ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [about]);

  if (!about) return <Loader />;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-black overflow-hidden w-full lg:my-20 py-5 relative"
    >
      <div className="container relative z-[9] 2xl:px-4 mx-auto max-w-[1600px]">
        <div className="w-full p-20 px-4 lg:px-10 2xl:px-16 flex lg:flex-row flex-col justify-between">
          <AboutTextContent about={about} lang={lang} />
          <AboutImageBadges about={about} lang={lang} />
        </div>
      </div>
    </section>
  );
}

function AboutTextContent({ about, lang }) {
  return (
    <div className="w-full 2xlp-5">
      <span className="font-medium fade-up">{about.subtitle[lang]}</span>

      <h1 className="text-white font-medium pt-2 2xl:leading-16 text-3xl 2xl:text-5xl fade-up">
        {about.title[lang].split("\n").map((line, i) => (
          <span key={i}>
            {line
              .split(/"(.*?)"/)
              .map((part, j) =>
                j % 2 === 1 ? (
                  <span key={j} className="text-primary">
                    {part}
                  </span>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            <br className="block" />
          </span>
        ))}
      </h1>

      <p className="lg:leading-8 pt-6 fade-up">
        {about.paragraph[lang].split("\n").map((line, i) => (
          <span key={i}>
            {line}
            <br className="hidden xl:block" />
          </span>
        ))}
      </p>

      <div className="grid 2xl:pt-10 gap-10 pt-5 gap-y-7 text-xl font-medium text-white grid-cols-1 lg:grid-cols-2">
        {about.services.map((service, i) => (
          <span key={i} className="flex items-center gap-2 fade-up">
            <LuCheck className="text-primary text-2xl" />
            {service[lang]}
          </span>
        ))}
      </div>

      <div className="bg-lighter lg:items-center w-full lg:w-auto justify-center gap-10 inline-flex flex-col lg:flex-row p-5 2xl:px-10 rounded-2xl mt-10 border-border border-[1px] fade-up">
        <div className="flex items-center gap-3">
          <span className="p-3 flex items-center justify-center rounded-full bg-primary">
            <LuMail className="text-black 2xl:text-lg text-sm" />
          </span>
          <div>
            <span className="block text-sm 2xl:text-base">{about.contacts.emailLabel[lang]}</span>
            <span className="text-white text-sm 2xl:text-base font-medium hover:text-primary duration-300 cursor-pointer block">
              {about.contacts.email}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="p-3 flex items-center justify-center rounded-full bg-primary">
            <LuPhone className="text-black 2xl:text-lg text-sm" />
          </span>
          <div>
            <span className="block text-sm 2xl:text-base">{about.contacts.phoneLabel[lang]}</span>
            <span dir="ltr" className="text-white text-sm 2xl:text-base font-medium hover:text-primary duration-300 cursor-pointer block">
              {about.contacts.phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutImageBadges({ about, lang }) {
  return (
    <div className="2xl:p-5 mt-10 lg:mt-0 lg:p-0 flex justify-center lg:w-[60%] 2xl:w-full">
      <div className="relative fade-up">
        <img
          src={about.mainImage.asset.url}
          className="object-cover"
          alt="About"
          loading="lazy"
        />

        <div className="absolute lg:-left-[60px] mt-10 lg:mt-0 px-3 flex items-center justify-center gap-2 rounded-full bg-white top-1/2 p-3 -translate-y-1/2 fade-up">
          <span className="w-7">
            <img src={about.badge1.iconImage.asset.url} alt="icon" loading="lazy" />
          </span>
          <span className="text-black font-semibold">{about.badge1.text[lang]}</span>
          <span className="text-black">
            <LuArrowUpRight className="text-xl" />
          </span>
        </div>

        <div className="absolute bottom-26 lg:-left-[100px] px-3 flex items-center justify-center gap-2 rounded-full bg-white lg:bottom-40 2xl:bottom-40 p-3 fade-up">
          <span className="w-7">
            <img src={about.badge2.iconImage.asset.url} alt="icon" loading="lazy" />
          </span>
          <span className="text-black font-semibold">{about.badge2.text[lang]}</span>
          <span className="text-black">
            <LuArrowUpRight className="text-xl" />
          </span>
        </div>
      </div>
    </div>
  );
}
