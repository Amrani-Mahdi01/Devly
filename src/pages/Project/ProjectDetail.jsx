import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { client, urlFor } from "../../lib/sanity";
import { LanguageContext } from "../../context/LanguageContext";
import Loader from "../../components/Loader";
import AnimatedLink from "../../components/AnimatedLink";
import { PortableText } from "@portabletext/react";
import ProjectInfoBg from "../../assets/project-info-bg.png"
import { LuFacebook } from "react-icons/lu";
import { LuInstagram } from "react-icons/lu";
import { relatedProjectsQuery } from '../../lib/queries'
import gsap from "gsap";
import { useRef, useLayoutEffect } from "react";
import SEO from "../../components/SEO";
import { breadcrumbSchema, projectSchema } from "../../components/StructuredData";




import { LuCheck, LuDot } from "react-icons/lu";

const ProjectDetail = () => {
    const { id } = useParams(); // get the dynamic :id from URL
    const { language } = useContext(LanguageContext);
    const [project, setProject] = useState(null);
    const portableTextComponents = {
        block: {
            h1: ({ children }) => (
                <h1 className="lg:text-[30px] text-2xl font-medium mb-6 mt-10 leading-tight">
                    {children}
                </h1>
            ),

            normal: ({ children }) => (
                <p className="md:text-lg text-sm text-white/80 leading-relaxed ">
                    {children}
                </p>
            ),
        },
    };
    const [relatedProjects, setRelatedProjects] = useState([]);

    const titleRef = useRef(null);
    const breadcrumbRef = useRef(null);
    const imageRef = useRef(null);
    const containerRef = useRef(null); // Wrap the whole component in this


    useEffect(() => {
        const fetchRelated = async () => {
            const data = await client.fetch(relatedProjectsQuery);
            setRelatedProjects(data?.projects || []);
        };
        fetchRelated();
    }, []);













    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            const query = `*[_type == "project" && _id == "${id}"][0]{
      _id,
      title { en, fr, ar },
      description { en, fr, ar },
      category { en, fr, ar },
      image,
      slug,
      mainImage,
      featured,
      order,

      projectDetails{
        content { en, fr, ar },
        features { en, fr, ar },
        info[]{
          label { en, fr, ar },
          value { en, fr, ar }
        },
        gallery,
        tags
      }
    }`;

            const data = await client.fetch(query);
            setProject(data);
        };

        fetchProject();
    }, [id]);

    useEffect(() => {
        if (!project) return; // wait for project data

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });

            if (titleRef.current) tl.from(titleRef.current, { opacity: 0, y: -50 });
            if (breadcrumbRef.current) tl.from(breadcrumbRef.current, { opacity: 0, y: -20 }, "-=0.5");
            if (imageRef.current) tl.from(imageRef.current, { opacity: 0, scale: 0.9, y: 20 }, "-=0.5");
        }, containerRef); // scope animations to the container

        return () => ctx.revert(); // clean up on unmount
    }, [project]);







    const getText = (obj) => {
        if (!obj) return "";
        return language === "FR" ? obj.fr : language === "AR" ? obj.ar : obj.en;
    };

    if (!project) return <Loader />;

    // SEO Data
    const projectTitle = getText(project.title);
    const projectDescription = getText(project.description) || `Discover ${projectTitle} - a project by DEVLY showcasing our expertise in web development and tech solutions.`;
    const projectImage = project.mainImage ? urlFor(project.mainImage).url() : null;
    const projectCategory = getText(project.category);

    // Breadcrumb structured data
    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Projects", url: "/projects" },
        { name: projectTitle, url: `/projects/${id}` }
    ]);

    // Project structured data
    const projectStructuredData = projectSchema({
        title: projectTitle,
        description: projectDescription,
        image: projectImage,
        slug: project.slug?.current || id,
        id: id,
        tags: project.projectDetails?.tags,
        category: projectCategory,
        publishedDate: new Date().toISOString() // You can add _createdAt from Sanity if available
    });

    // Combine breadcrumbs and project schema
    const combinedSchema = {
        "@context": "https://schema.org",
        "@graph": [breadcrumbs, projectStructuredData]
    };

    return (
        <>
            {/* SEO Meta Tags */}
            <SEO
                title={projectTitle}
                description={projectDescription}
                keywords={`${projectCategory}, ${projectTitle}, web development, portfolio project, DEVLY, ${project.projectDetails?.tags?.join(", ") || ""}`}
                url={`/projects/${id}`}
                type="article"
                image={projectImage}
                structuredData={combinedSchema}
            />

            <div ref={containerRef} className="container overflow-x-hidden max-w-[1300px] mt-40 mx-auto px-6 py-20 text-white">
            <h1 ref={titleRef} className="text-center text-3xl lg:text-[80px] font-medium mb-6">
                {getText(project.title)}
            </h1>
            <div className="flex items-center justify-center ">
                <div ref={breadcrumbRef}
                    className={`flex items-center justify-center gap-3 mt-3 ${language === "AR" ? "flex-row-reverse" : "flex-row"
                        }`}
                >
                    <AnimatedLink
                        to={"/"}
                        className="text-white cursor-pointer hover:text-primary duration-300 text-sm lg:text-lg"
                    >
                        {language === "AR" ? "الرئيسية" : language === "FR" ? "Accueil" : "Home"}
                    </AnimatedLink>

                    <span className="text-white text-3xl">
                        <LuDot />
                    </span>

                    <AnimatedLink
                        to={"/projects"}
                        className="text-white cursor-pointer hover:text-primary duration-300 text-sm lg:text-lg"
                    >
                        {language === "AR" ? "مشاريع" : language === "FR" ? "Projets" : "Projects"}
                    </AnimatedLink>

                    <span className="text-white text-3xl">
                        <LuDot />
                    </span>

                    <AnimatedLink className="text-primary underline text-sm lg:text-lg">
                        {getText(project.title)}
                    </AnimatedLink>
                </div>
            </div>


            {project.mainImage && (
                <img ref={imageRef}
                    src={urlFor(project.mainImage).url()}
                    alt={getText(project.title)}
                    className="w-full object-cover mt-20 h-[450px] lg:h-[750px] mb-16"
                />
            )}



            {/* ================= MAIN SECTION ================= */}
            <div className="flex   flex-col lg:flex-row gap-16 items-start">

                {/* 🔵 BIG LEFT SIDE */}
                <div className="lg:flex-1 w-full lg:w-auto">

                    {/* 📝 RICH TEXT */}
                    <div className="prose prose-invert max-w-none">
                        <PortableText
                            value={getText(project.projectDetails?.content)}
                            components={portableTextComponents}
                        />

                    </div>

                    {/* ✅ FEATURES GRID */}
                    <div className="grid w-[500px]  lg:grid-cols-2 gap-6 mt-12">
                        {getText(project.projectDetails?.features)?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <LuCheck className="text-primary text-lg lg:text-2xl" />
                                <span className="lg:text-xl text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🟣 RIGHT SIDEBAR */}
                <div className="w-[350px] bg-primary flex flex-col gap-5 relative p-8 rounded-xl border border-white/10 space-y-6">
                    <img src={ProjectInfoBg} className="w-full h-full object-cover  absolute left-0 top-0 " alt="" />
                    {project.projectDetails?.info?.map((item, i) => (
                        <div key={i}>
                            <p className="text-sm text-black font-medium  tracking-wider">
                                {getText(item.label)}
                            </p>
                            <p className="text-xl text-black font-semibold mt-1">
                                {getText(item.value)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= GALLERY ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
                {project.projectDetails?.gallery?.map((img, i) => (
                    <img
                        key={i}
                        src={urlFor(img).width(800).url()}
                        className="w-full h-[350px] object-cover "
                        alt="Project"
                    />
                ))}
            </div>

            <div
                className={`flex flex-col  gap-10 md:flex-row items-center border-border border justify-between mt-10 rounded-lg bg-lighter p-5 lg:px-10 `}
            >
                {/* TAGS */}
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <h1 className="text-white ">
                        {language === "AR" ? "الوسوم" : language === "FR" ? "Tags" : "Tags"}
                    </h1>

                    <div className="flex flex-col md:flex-row items-center gap-3 flex-wrap">
                        {project.projectDetails?.tags?.map((tag, i) => (
                            <span
                                key={i}
                                className="px-4 py-2 hover:text-black duration-300 hover:bg-primary bg-border text-white/70 font-medium rounded-lg text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* FOLLOW */}
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <h1 className="text-white font-medium">
                        {language === "AR"
                            ? "تابعنا"
                            : language === "FR"
                                ? "Suivez-nous"
                                : "Follow us"}
                    </h1>

                    <div className="flex items-center gap-2">
                        <a className="bg-black flex items-center border-border border justify-center cursor-pointer hover:bg-primary duration-300 rounded-full h-10 w-10">
                            <LuFacebook className="text-white/70" />
                        </a>

                        {/* FIXED */}
                        <a className="bg-black flex items-center border-border border justify-center cursor-pointer hover:bg-primary duration-300 rounded-full h-10 w-10">
                            <LuInstagram className="text-white/70" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <h1 className="text-center text-5xl text-white font-medium mb-12">
                    {language === "AR"
                        ? "مشاريع ذات صلة"
                        : language === "FR"
                            ? "Projets Similaires"
                            : "Related Projects"}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {relatedProjects.map((proj, i) => (
                        <AnimatedLink to={`/projects/${proj._id}`} key={proj._id} className=" overflow-hidden group cursor-pointer">
                            {/* Image */}
                            {proj.image && (
                                <img
                                    src={urlFor(proj.image).width(600).url()}
                                    alt={getText(proj.title)}
                                    className="w-full h-[350px] object-cover group-hover:opacity-75 duration-300  "
                                />
                            )}

                            {/* Info */}
                            <div className="p-10">
                                <p className=" text-primary mb-5">
                                    {getText(proj.category)}
                                </p>
                                <h3 className="text-white text-2xl font-medium mt-1">
                                    {getText(proj.title)}
                                </h3>
                            </div>
                        </AnimatedLink>
                    ))}
                </div>
            </div>


        </div>
        </>
    );
};

export default ProjectDetail;
