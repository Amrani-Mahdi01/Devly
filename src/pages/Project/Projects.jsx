import { useEffect, useState, useMemo, useContext } from "react";
import AnimatedLink from "../../components/AnimatedLink";
import { LuArrowUpRight, LuDot } from "react-icons/lu";
import { LanguageContext } from "../../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { client, urlFor } from "../../lib/sanity";
import { projectsPageQuery } from "../../lib/queries";
import Loader from "../../components/Loader";
import ContactSection from "../../sections/ContactSection";
import SEO from "../../components/SEO";
import { breadcrumbSchema } from "../../components/StructuredData";

export default function Projects() {
  const [data, setData] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { language } = useContext(LanguageContext);
  const lang = language === "AR" ? "ar" : "en";



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.fetch(projectsPageQuery);

        setData(res);
      } catch (err) {
        console.error("Sanity fetch error:", err);
      }
    };
    fetchData();
  }, []);


  // Reset active filter when language changes
  useEffect(() => {
    setActiveFilter("all");
  }, [lang]);

  // Compute dynamic categories from projects
  const categories = useMemo(() => {
    if (!data?.projects) return ["all"];
    const cats = Array.from(
      new Set(data.projects.map((p) => p.category?.[lang]))
    ).filter(Boolean);
    return ["all", ...cats];
  }, [data, lang]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (!data?.projects) return [];

    const sorted = [...data.projects].sort(
      (a, b) => (a.order ?? 999) - (b.order ?? 999)
    );

    return activeFilter === "all"
      ? sorted
      : sorted.filter((p) => p.category?.[lang] === activeFilter);
  }, [activeFilter, data, lang]);

  if (!data) return <Loader />;

  // SEO metadata based on language
  const seoTitle = lang === "ar" ? "مشاريعنا - عرض الأعمال" : lang === "fr" ? "Nos Projets - Portfolio" : "Our Projects - Portfolio";
  const seoDescription = lang === "ar"
    ? "استكشف مجموعة مشاريعنا المتنوعة في تطوير الويب، تطبيقات الموبايل، والحلول التقنية. شاهد أعمالنا وخبرتنا في تحويل الأفكار إلى منتجات رقمية ناجحة."
    : lang === "fr"
    ? "Découvrez notre portfolio de projets en développement web, applications mobiles et solutions technologiques. Consultez nos réalisations et notre expertise."
    : "Explore our diverse portfolio of web development projects, mobile apps, and tech solutions. See our work and expertise in transforming ideas into successful digital products.";

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" }
  ]);

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="portfolio, web projects, mobile apps, web development showcase, DEVLY projects, case studies, tech solutions"
        url="/projects"
        type="website"
        structuredData={breadcrumbs}
      />

      {/* HERO SECTION */}
      <div className="lg:h-[500px] h-[400px] relative">
        <div className="relative z-[9] w-full h-full flex items-end justify-center container mx-auto px-4 2xl:px-32">
          <div className="text-center">
            <h1 className="text-white text-5xl lg:text-[80px] font-medium">
              {data?.heroTitle?.[lang] || ""}
            </h1>

            <div
              className={`flex items-center justify-center gap-3 mt-3 ${lang === "ar" ? "" : "flex-row"}`}
            >
              <AnimatedLink
                to={"/"}
                className="text-white hover:text-primary duration-300 text-lg"
              >
                {lang === "ar" ? "الرئيسية" : lang === "fr" ? "Accueil" : "Home"}
              </AnimatedLink>

              {/* Dot separator */}
              <span className={`text-white text-3xl ${lang === "ar" ? "" : ""}`}>
                <LuDot />
              </span>

              <AnimatedLink
                to={"/project"}
                className="text-primary underline text-lg"
              >
                {lang === "ar"
                  ? "عرض المشاريع"
                  : lang === "fr"
                    ? "Grille de projets"
                    : "Project Grid View"}
              </AnimatedLink>
            </div>



            {/* FILTER BUTTONS */}
            <div className="mt-20 flex  flex-wrap justify-center gap-10">
              {categories.map((cat) => {
                const isActive = activeFilter === cat;
                const label =
                  cat === "all"
                    ? lang === "en"
                      ? "All"
                      : lang === "ar"
                        ? "الكل"
                        : "Tous"
                    : cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`relative py-1 font-medium lg:text-lg capitalize ${isActive ? "text-primary" : "text-gray-400"
                      }`}
                  >
                    {label}

                    {/* ACTIVE UNDERLINE */}
                    {isActive && (
                      <motion.span
                        layoutId="filterUnderline"
                        className={`absolute -bottom-2 ${lang === "ar" ? "right-0" : "left-0"
                          } h-[2px] bg-primary`}
                        style={{ width: "50%" }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}

                    {/* HOVER UNDERLINE */}
                    {!isActive && (
                      <motion.span
                        className={`absolute -bottom-2 ${lang === "ar" ? "right-0" : "left-0"
                          } h-[2px] bg-primary`}
                        initial={{ width: 0 }}
                        whileHover={{ width: "50%" }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* PROJECT GRID */}
      <div className="container mx-auto px-4 2xl:px-32 py-20">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project._id}

                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.25 },
                  scale: { duration: 0.25 },
                }}
                style={{ willChange: "transform, opacity" }}
                className="relative cursor-pointer overflow-hidden  group"
              >
                {/* IMAGE */}
                <AnimatedLink to={`/projects/${project._id}`} className="w-full h-[450px] relative overflow-hidden">
                  {project.image && (
                    <>
                      <img
                        src={urlFor(project.image).url()}
                        alt={project.title?.[lang] || ""}
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70"
                        loading="lazy"
                      />
                      {/* Arrow icon */}
                      <AnimatedLink to={`/projects/${project._id}`} className="absolute left-1/2 top-1/2 -translate-y-1/2 rounded-full -translate-x-1/2 flex bg-primary text-black items-center w-18 h-18 justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <LuArrowUpRight className="text-black text-3xl" />
                      </AnimatedLink>
                    </>
                  )}
                </AnimatedLink>

                {/* TEXT */}
                <div className="p-10">
                  <p className="text-primary capitalize">
                    {project.category?.[lang]}
                  </p>
                  <h3 className="text-white text-3xl pt-5 font-medium mb-2">
                    {project.title?.[lang]}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
     <div className="w-full bg-black ">

      <ContactSection />
     </div>
    </>
  );
}
