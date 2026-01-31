import { useEffect, useRef, useState, useContext } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client } from "../lib/sanity";
import { clientsTestimonialsQuery } from "../lib/queries";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { LanguageContext } from "../context/LanguageContext";
import Loader from "../components/Loader";


gsap.registerPlugin(ScrollTrigger);

export default function ClientsTestimonials() {
  const sectionRef = useRef(null);
  const [testimonialsData, setTestimonialsData] = useState(null);
  const { language } = useContext(LanguageContext);
  const lang = language === "AR" ? "ar" : "en";

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // Fetch testimonials
  useEffect(() => {
    const fetchData = async () => {
      const data = await client.fetch(clientsTestimonialsQuery);
      setTestimonialsData(data);
    };
    fetchData();
  }, []);

  // GSAP animations (desktop only)
useEffect(() => {
  if (!testimonialsData) return;

  const fadeEls = sectionRef.current.querySelectorAll(".fade-up");

  const ctx = gsap.context(() => {

    // 📱 MOBILE — lighter, smoother, cheaper
    if (isMobile) {
      gsap.from(fadeEls, {
        y: 20,              // smaller movement = less GPU work
        opacity: 0,
        duration: 0.5,      // faster = less frames to calculate
        stagger: 0.03,      // lighter stagger
        ease: "power1.out", // cheaper easing curve
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",  // triggers later = less scroll math
          toggleActions: "play none none none", // no reversing
        },
      });

    } 
    // 💻 DESKTOP — keep cinematic version
    else {
      gsap.from(fadeEls, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }

  }, sectionRef);

  return () => ctx.revert();
}, [testimonialsData, isMobile]);


  if (!testimonialsData) return <Loader />;

  return (
    <section
      ref={sectionRef}
      className="clients-section w-full relative overflow-hidden bg-black lg:my-20 py-14"
    >
      {/* Background */}
      {!isMobile && <div className="clients-bg"></div>}

      <div className="container relative z-[9] mx-auto max-w-[1600px] 2xl:px-4">
        <div className="w-full py-20 lg:py-10 lg:px-20 2xl:p-20 2xl:px-32 flex lg:flex-row flex-col gap-10 items-center">
          <SectionTextContent data={testimonialsData} lang={lang} />
          <SectionCards data={testimonialsData} lang={lang} />
        </div>
      </div>
    </section>
  );
}

function SectionTextContent({ data, lang }) {
  return (
    <div className="w-full p-5">
      <span className="font-medium fade-up">{data.subtitle[lang]}</span>

      <h1 className="text-white font-medium pt-2 2xl:leading-16 text-3xl lg:text-4xl 2xl:text-5xl fade-up">
        {data.title[lang].split("\n").map((line, i) => (
          <span key={i}>
            {line
              .split(/"(.*?)"/)
              .map((part, j) =>
                j % 2 === 1 ? (
                  <span key={j} className="text-primary">{part}</span>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            <br className="hidden xl:block" />
          </span>
        ))}
      </h1>

      <p className="leading-8 pt-6 fade-up">
        {data.description[lang].split("\n").map((line, i) => (
          <span key={i}>
            {line}
            <br className="hidden lg:block" />
          </span>
        ))}
      </p>

      {data.button && (
        <a
          href={data.button.url}
          className="px-10 py-3 text-black rounded-2xl bg-primary font-semibold mt-10 inline-block text-[18px]"
        >
          {data.button.text[lang]}
        </a>
      )}
    </div>
  );
}

function SectionCards({ data, lang }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const isRTL = lang === "ar";
  const slides = isRTL ? [...data.testimonials] : data.testimonials;

  return (
    <div className="p-5 lg:w-[60%] w-full fade-up">
      <Swiper
        key={lang}
        slidesPerView={isMobile ? 1 : 2}
        loop={false}
        slideToClickedSlide={true}
        direction="horizontal"
        rtl={isRTL}
        observer={false} // optimization
        observeParents={false} // optimization
        spaceBetween={isMobile ? 10 : isRTL ? 15 : 30}
        breakpoints={{
          1024: { slidesPerView: 2, spaceBetween: isRTL ? 15 : 30 },
        }}
      >
        {slides.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="group p-5 py-16 h-full border-[1px] hover:bg-[#131313] duration-300 border-border rounded-2xl flex flex-col gap-4">
              <div className="flex relative justify-center mb-5 items-center gap-4">
                {item.avatar?.asset?.url && (
                  <img
                    src={item.avatar.asset.url}
                    alt={item.clientName}
                    loading="lazy"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}

                <div className="bg-[#1f1f1f] group-hover:bg-primary duration-300 me-20 w-16 h-16 flex items-center justify-center rounded-full absolute">
                  <svg
                    className="group-hover:fill-black w-7 h-7 rotate-180 duration-300"
                    fill="#cdf80a"
                    viewBox="0 0 198 198"
                  >
                    <path d="M0,92.905h48.024c-0.821,35-10.748,38.973-23.216,40.107L20,133.608v38.486l5.542-0.297 c16.281-0.916,34.281-3.851,46.29-18.676C82.359,140.125,87,118.893,87,86.3V25.905H0V92.905z"></path>
                    <path d="M111,25.905v67h47.383c-0.821,35-10.427,38.973-22.895,40.107L131,133.608v38.486l5.222-0.297 c16.281-0.916,34.442-3.851,46.451-18.676C193.199,140.125,198,118.893,198,86.3V25.905H111z"></path>
                  </svg>
                </div>
              </div>

              <p className="text-gray-400 text-center leading-7">{item.message}</p>

              <div className="flex flex-col justify-center items-center text-center">
                <h3 className="text-white text-[22px] font-semibold">{item.clientName}</h3>
                <span className="text-[14px] text-primary">{item.projectType}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
