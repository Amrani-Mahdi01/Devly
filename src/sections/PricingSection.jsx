import { useEffect, useState, useContext, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smootherInstance } from "../components/ScrollSmoother";

import { client } from "../lib/sanity";
import { LanguageContext } from "../context/LanguageContext";
import { pricingQuery } from "../lib/queries";
import Loader from "../components/Loader";

gsap.registerPlugin(ScrollTrigger);

export default function PricingSection() {
  const [servicesData, setServicesData] = useState(null);
  const { language } = useContext(LanguageContext);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // ================= FETCH DATA =================
  useEffect(() => {
    async function fetchData() {
      const data = await client.fetch(pricingQuery);
      setServicesData(data);
    }
    fetchData();
  }, []);

  // ================= LANG HANDLER =================
  const getText = (obj) => {
    if (!obj) return "";
    if (language === "EN") return obj.en;
    if (language === "FR") return obj.fr;
    if (language === "AR") return obj.ar;
    return obj.en;
  };

  // ================= STYLED TITLE =================
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

  // ================= GSAP =================
  useEffect(() => {
    if (!servicesData || isMobile) return; // Skip animations on mobile

    let ctx;

    const wait = setInterval(() => {
      if (smootherInstance && titleRef.current && cardsRef.current) {
        clearInterval(wait);

        ctx = gsap.context(() => {
          // Title animation
          gsap.fromTo(
            titleRef.current.querySelectorAll(".fade-up"),
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.2,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: titleRef.current,
                start: "top 80%",
              },
            }
          );

          // Cards animation
          gsap.fromTo(
            cardsRef.current.querySelectorAll(".fade-up"),
            { y: 80, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.15,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 60%",
              },
            }
          );

          ScrollTrigger.refresh();
        }, sectionRef);
      }
    }, 50);

    return () => {
      clearInterval(wait);
      if (ctx) ctx.revert();
    };
  }, [servicesData, isMobile]);

  if (!servicesData) return <Loader />;

  // ================= RENDER =================
  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-20"
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6 2xl:px-32">

        {/* ===== Title ===== */}
        <div ref={titleRef}>
          <span className="block text-center font-medium fade-up">
            {getText(servicesData.subtitle)}
          </span>

          <h1 className="text-center text-white text-3xl lg:text-5xl pt-5 fade-up">
            {renderStyledTitle(getText(servicesData.title))}
          </h1>
        </div>

        {/* ===== Cards ===== */}
        <div
          ref={cardsRef}
          className="grid pt-10 grid-cols-1 md:grid-cols-3 gap-5"
        >
          {servicesData.cards?.map((card, index) => (
            <div
              key={index}
              className="bg-lighter rounded-xl p-2 pb-4 fade-up"
            >
              {/* Top */}
              <div className="w-full p-10 border border-border bg-[#131313] rounded-xl">
                <div className="bg-border rounded-lg p-3 inline-block">
                  {card.iconType === "svg" && card.iconSvg && (
                    <div
                      className="text-primary [&_svg]:w-8 [&_svg]:h-8"
                      dangerouslySetInnerHTML={{ __html: card.iconSvg }}
                    />
                  )}

                  {card.iconType === "image" && card.iconImage?.asset?.url && (
                    <img
                      src={card.iconImage.asset.url}
                      alt=""
                      className="w-8 h-8 object-contain"
                      loading="lazy"
                    />
                  )}
                </div>

                <h1 className="my-2 text-white text-2xl font-medium">
                  {getText(card.cardTitle)}
                </h1>

                <span className="text-sm text-gray-400">
                  {getText(card.cardSubtitle)}
                </span>
              </div>

              {/* Bottom */}
              <div className="w-full px-3 pt-7">
                <p className="text-gray-400">
                  {getText(card.description)}
                </p>

                <div className="mt-10 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-white block">
                      {language === "AR"
                        ? "السعر"
                        : language === "FR"
                        ? "Prix"
                        : "Price"}
                    </span>
                    <h1 className="text-primary">{card.price}</h1>
                  </div>

                  <div>
                    <span className="text-sm text-white block text-end">
                      {language === "AR"
                        ? "المدة"
                        : language === "FR"
                        ? "Durée"
                        : "Timeline"}
                    </span>
                    <h1 className="text-primary text-end">{card.timeline}</h1>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                   const el = document.querySelector("#contact");
if (el) {
  el.scrollIntoView({ behavior: "smooth" });
}
                  }}
                  className="w-full cursor-pointer hover:bg-white duration-300 bg-primary py-2 mt-5 text-black font-medium text-lg rounded-lg"
                >
                  {language === "AR"
                    ? "اطلب الآن"
                    : language === "FR"
                    ? "Commander Maintenant"
                    : "Order Now"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
