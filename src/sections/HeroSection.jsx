import { useEffect, useState, useRef, useContext } from "react";
import { heroQuery } from "../lib/queries";
import { client } from "../lib/sanity";
import { LanguageContext } from "../context/LanguageContext";
import { gsap } from "gsap";
import Loader from "../components/Loader";
import Magnet from "../components/Magnet";

export default function HeroSection() {
  const { language } = useContext(LanguageContext);

  // ✅ Always define hooks at the top
  const [heroData, setHeroData] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const helloRef = useRef(null);
  const iAmRef = useRef(null);
  const nameRef = useRef(null);
  const jobRef = useRef(null);
  const typeOfWorkRef = useRef(null);
  const imageRef = useRef(null);
  

  // ✅ Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Fetch hero data
  useEffect(() => {
    async function fetchHero() {
      const data = await client.fetch(heroQuery);
      setHeroData(data);
    }
    fetchHero();
  }, []);

  // ✅ Intro animation
  useEffect(() => {
    if (!heroData) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: isDesktop ? 0.6 : 0.3, ease: "power1.out" },
      });

      tl.from(typeOfWorkRef.current, { opacity: 0 })
        .from(helloRef.current, { opacity: 0 }, "-=0.2")
        .from(iAmRef.current, { opacity: 0 }, "-=0.2")
        .from(nameRef.current, { opacity: 0 }, "-=0.2")
        .from(jobRef.current, { opacity: 0 }, "-=0.2");

      if (isDesktop) {
        gsap.from(imageRef.current, { opacity: 0, scale: 0.95, duration: 0.5 });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [heroData, isDesktop]);

  // 🧲 Magnet effect (desktop only)
  useEffect(() => {
    if (!heroData || !isDesktop) return;

    const elements = [
      helloRef.current,
      iAmRef.current,
      nameRef.current,
      jobRef.current,
      typeOfWorkRef.current,
      imageRef.current,
    ];

    const xTo = elements.map((el) =>
      gsap.quickTo(el, "x", { duration: 0.3, ease: "power1.out" })
    );
    const yTo = elements.map((el) =>
      gsap.quickTo(el, "y", { duration: 0.3, ease: "power1.out" })
    );

    let rect = containerRef.current.getBoundingClientRect();

    const handleResize = () => {
      rect = containerRef.current.getBoundingClientRect();
    };

    const handleMouseMove = (e) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      elements.forEach((el, i) => {
        const strength = 0.02 + i * 0.005;
        xTo[i](deltaX * strength);
        yTo[i](deltaY * strength);
      });
    };

    const handleMouseLeave = () => {
      elements.forEach((el) => {
        gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power1.out" });
      });
    };

    window.addEventListener("resize", handleResize);
    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [heroData, isDesktop]);

  if (!heroData) return <Loader />;

  const getText = (obj) => {
    if (!obj) return "";
    if (language === "EN") return obj.en;
    if (language === "FR") return obj.fr;
    if (language === "AR") return obj.ar;
  };

  // ✅ Optimized images
  const mobileSrc = `${heroData.image.asset.url}?w=400&q=70&auto=format`;
  const tabletSrc = `${heroData.image.asset.url}?w=768&q=75&auto=format`;
  const desktopSrc = `${heroData.image.asset.url}?w=1024&q=80&auto=format`;

  const imgSrc = isMobile ? mobileSrc : isDesktop ? desktopSrc : tabletSrc;

  return (
    <div
      ref={containerRef}
      id="home"
      className="lg:h-[900px] h-[650px] py-10 pt-40 lg:py-20 lg:pt-40 relative overflow-hidden"
      style={{ transform: "translateZ(0)" }}
    >

        
      <div className="container relative h-full px-4 mx-auto max-w-[1300px]">
        <div className="relative w-full uppercase z-[9]">
          <h6 ref={typeOfWorkRef} className="font-semibold text-sm lg:text-base ps-1">
            {getText(heroData.typeOfWork)}
          </h6>

          <Magnet strength={isDesktop ? 0.12 : 0}>
            <h1
              ref={helloRef}
              style={{ willChange: isDesktop ? "transform" : "auto" }}
              className="text-white text-4xl lg:text-[160px] 2xl:text-[190px] lg:leading-[150px] font-bold"
            >
              {getText(heroData.hello)}
            </h1>
          </Magnet>

          <div className="flex lg:-mt-20 items-center justify-end">
            <Magnet strength={isDesktop ? 0.18 : 0}>
              <h3
                ref={iAmRef}
                style={{ willChange: isDesktop ? "transform" : "auto" }}
                className="lg:text-[70px] text-3xl font-bold text-primary lg:pe-90"
              >
                {getText(heroData.iAm)}
              </h3>
            </Magnet>
          </div>

          <div className="flex lg:mt-20 mt-10 items-center justify-end">
            <Magnet strength={isDesktop ? 0.16 : 0}>
              <h3
                ref={nameRef}
                style={{ willChange: isDesktop ? "transform" : "auto" }}
                className="lg:text-[80px] text-3xl border-b-[3px] lg:leading-[70px] font-semibold text-white"
              >
                {getText(heroData.name)}
              </h3>
            </Magnet>
          </div>

          <div
            ref={jobRef}
            className="mt-20 inline-block lg:px-20 px-10 py-4 rounded-full"
            style={{
              backdropFilter: isDesktop ? "blur(20px)" : "blur(2px)",
              WebkitBackdropFilter: isDesktop ? "blur(20px)" : "blur(2px)",
              background: "linear-gradient(94deg, rgba(49,50,52,0.85), rgba(88,77,77,0.85))",
            }}
          >
            <h2 className="lg:text-[80px] text-2xl text-white font-bold">
              {getText(heroData.job)}
            </h2>
          </div>
        </div>

        {/* Hero image */}
        <div className="absolute w-full flex justify-center top-0 lg:bottom-0 left-1/2 -translate-x-1/2">
       <img
  ref={imageRef}
  src={imgSrc}
  srcSet={`${mobileSrc} 400w, ${tabletSrc} 768w, ${desktopSrc} 1024w`}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 50vw"
  alt="Hero"
  className={`object-cover ${isDesktop ? "lg:w-[750px]" : ""}`}
  style={{ willChange: isDesktop ? "transform" : "auto" }}
  fetchPriority="high"
/>

        </div>
      </div>
    </div>
  );
}
