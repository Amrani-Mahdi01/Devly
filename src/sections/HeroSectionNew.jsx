import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { heroQuery } from "../lib/queries";
import { client } from "../lib/sanity";
import { LanguageContext } from "../context/LanguageContext";
import Loader from "../components/Loader";
import BlurText from "../components/animations/BlurText";
import FadeIn from "../components/animations/FadeIn";
import GradientText from "../components/animations/GradientText";
import { LuArrowRight, LuPlay, LuCode2, LuRocket, LuZap } from "react-icons/lu";

export default function HeroSectionNew() {
  const { language } = useContext(LanguageContext);
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    async function fetchHero() {
      const data = await client.fetch(heroQuery);
      setHeroData(data);
    }
    fetchHero();
  }, []);

  const getText = (obj) => {
    if (!obj) return "";
    return language === "FR" ? obj.fr : language === "AR" ? obj.ar : obj.en;
  };

  if (!heroData) return <Loader />;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">

            {/* Badge */}
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <LuZap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {getText(heroData.badge) || "Top Rated Agency"}
                </span>
              </div>
            </FadeIn>

            {/* Main Headline */}
            <div className="space-y-4">
              <BlurText
                text={getText(heroData.headline) || "We Build Digital Products That Scale"}
                className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight"
                delay={0.2}
              />

              <FadeIn delay={0.8}>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                  <GradientText>
                    {getText(heroData.tagline) || "From Concept to Launch"}
                  </GradientText>
                </h2>
              </FadeIn>
            </div>

            {/* Description */}
            <FadeIn delay={1}>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {getText(heroData.description) ||
                  "Full-stack development agency specializing in React, Node.js, and cloud-native solutions. We transform your ideas into scalable, high-performance applications."}
              </p>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={1.2}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
                {(heroData.stats || [
                  { number: "50+", label: { en: "Projects Delivered", fr: "Projets Livrés", ar: "مشروع منجز" } },
                  { number: "30+", label: { en: "Happy Clients", fr: "Clients Satisfaits", ar: "عميل سعيد" } },
                  { number: "5+", label: { en: "Years Experience", fr: "Années d'Expérience", ar: "سنوات خبرة" } }
                ]).map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-primary">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getText(stat.label)}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={1.4}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-black font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                >
                  {getText(heroData.ctaPrimary) || "Start Your Project"}
                  <LuArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  <LuPlay className="w-5 h-5" />
                  {getText(heroData.ctaSecondary) || "View Our Work"}
                </a>
              </div>
            </FadeIn>

            {/* Tech Stack */}
            <FadeIn delay={1.6}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-8 border-t border-white/10">
                <span className="text-sm text-gray-500 uppercase tracking-wider">
                  {getText(heroData.techStackLabel) || "Tech Stack"}
                </span>
                <div className="flex items-center gap-4">
                  {(heroData.techStack || [
                    { name: "React", icon: "⚛️" },
                    { name: "Node.js", icon: "🟢" },
                    { name: "TypeScript", icon: "🔷" },
                    { name: "AWS", icon: "☁️" }
                  ]).map((tech, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-primary/50 transition-colors"
                      whileHover={{ y: -2 }}
                    >
                      <span className="text-lg">{tech.icon}</span>
                      <span className="text-sm text-gray-300">{tech.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Content - 3D Illustration or Image */}
          <FadeIn delay={0.5} direction="right" className="flex-1">
            <div className="relative">
              {/* Floating Cards */}
              <div className="relative w-full max-w-xl mx-auto">

                {/* Main Card - Code Editor */}
                <motion.div
                  className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-gray-500 ml-2">App.jsx</span>
                  </div>

                  {/* Code Preview */}
                  <div className="space-y-2 font-mono text-sm">
                    <div className="text-purple-400">import <span className="text-blue-400">React</span> from <span className="text-green-400">'react'</span></div>
                    <div className="text-purple-400">import <span className="text-blue-400">{"{ DEVLY }"}</span> from <span className="text-green-400">'./agency'</span></div>
                    <div className="h-2" />
                    <div className="text-blue-400">const <span className="text-yellow-400">YourIdea</span> = () => {"{"}</div>
                    <div className="pl-4 text-gray-400">return <span className="text-pink-400">&lt;DEVLY.Build /&gt;</span></div>
                    <div className="text-blue-400">{"}"}</div>
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                </motion.div>

                {/* Floating Metric Card 1 */}
                <motion.div
                  className="absolute -top-10 -right-10 bg-primary/10 backdrop-blur-md border border-primary/30 rounded-xl p-4 shadow-lg"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <LuRocket className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Deployment</div>
                      <div className="text-lg font-bold text-white">99.9% Uptime</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Metric Card 2 */}
                <motion.div
                  className="absolute -bottom-10 -left-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <LuCode2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Code Quality</div>
                      <div className="text-lg font-bold text-white">A+ Grade</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Scroll Indicator */}
        <FadeIn delay={2} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div
            className="flex flex-col items-center gap-2 text-gray-500 cursor-pointer hover:text-primary transition-colors"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <div className="w-5 h-8 border-2 border-current rounded-full flex justify-center p-1">
              <motion.div
                className="w-1 h-1.5 bg-current rounded-full"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
