// src/components/AnimatedBar.jsx
import React, { useContext, useEffect, useState } from "react";
import { TbNorthStar } from "react-icons/tb";
import { LanguageContext } from "../context/LanguageContext";
import { client } from "../lib/sanity";
import { animatedBarQuery } from "../lib/queries";

export default function AnimatedBar({ rotate }) {
  const { language } = useContext(LanguageContext);
  const [words, setWords] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const isRTL = language === "AR"; // Right-to-left check
  const rotateClass = rotate === 1 ? "rotate-2" : "-rotate-2";

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch words from Sanity
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await client.fetch(animatedBarQuery);
        if (data?.words?.length) {
          const langWords = data.words.map((w) => {
            const key = language.toLowerCase();
            return w[key] || w.en; // fallback to English
          });
          setWords(langWords);
        }
      } catch (err) {
        console.error("Sanity fetch error:", err);
      }
    };
    fetchWords();
  }, [language]);

  if (!words.length) return null;

  // Increase repetitions to fill the space and remove gaps
  const repeatCount = isMobile ? 6 : 12;

  return (
    <div className={`overflow-hidden h-16 flex items-center ${rotateClass}`}>
      <div
        className={`flex whitespace-nowrap ${isRTL ? "flex-row-reverse animate-marquee-rtl" : "flex-row animate-marquee-ltr"}`}
      >
        {[...Array(repeatCount)].flatMap((_, iteration) =>
          words.map((word, index) => (
            <div
              key={`${word}-${index}-${iteration}`}
              className={`flex items-center gap-2 lg:gap-4 px-4 lg:px-6 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <span className="text-white font-semibold uppercase text-2xl lg:text-4xl">
                {word}
              </span>
              <TbNorthStar className="text-primary text-2xl lg:text-4xl" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
