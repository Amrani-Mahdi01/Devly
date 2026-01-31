import Chatbot from "../components/Chatbot";
import Loader from "../components/Loader";
import HeroSection from "../sections/HeroSection";
import SEO from "../components/SEO";
import { homepageSchema } from "../components/StructuredData";
import { Suspense, lazy } from "react";


const AnimatedBar = lazy(() => import("../sections/AnimatedBar"));
const AboutSection = lazy(() => import("../sections/AboutSection"));
const ServicesSection = lazy(() => import("../sections/ServicesSection"));
const SkillsSection = lazy(() => import("../sections/SkillsSection"));
const WorkSection = lazy(() => import("../sections/WorkSection"));
const ClientsTestimonails = lazy(() => import("../sections/ClientsTestimonails"));
const PricingSection = lazy(() => import("../sections/PricingSection"));
const ContactSection = lazy(() => import("../sections/ContactSection"));

export default function Home() {
  return (
    <>
      {/* SEO Meta Tags & Structured Data */}
      <SEO
        title="DEVLY"
        description="Professional web development agency specializing in custom websites, mobile apps, desktop applications, and complete tech solutions. Transform your ideas into reality with cutting-edge technology."
        keywords="web development, mobile app development, desktop apps, custom software, react development, full stack development, UI/UX design, tech solutions, DEVLY"
        url="/"
        type="website"
        structuredData={homepageSchema}
      />

      {/* HeroSection always loads immediately */}
      <HeroSection />
     

      {/* Below-the-fold sections lazy loaded */}
      <Suspense fallback={<Loader />}>
        <Chatbot />

 
        <AnimatedBar rotate={1} />
        <AboutSection />
        <ServicesSection />
        <SkillsSection />
        <WorkSection />
        <AnimatedBar rotate={2} />
        <ClientsTestimonails />
        <PricingSection />
        <ContactSection />
      </Suspense>
    </>
  );
}
