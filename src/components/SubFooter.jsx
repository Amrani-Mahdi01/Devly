import { useEffect, useState, useContext } from "react";
import { client } from "../lib/sanity";
import { LanguageContext } from "../context/LanguageContext";
import { subFooterQuery } from "../lib/queries";
import Loader from "./Loader";

export default function SubFooter() {
  const { language } = useContext(LanguageContext);
  const lang = language.toLowerCase();

  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await client.fetch(subFooterQuery);
      setData(res);
    }
    fetchData();
  }, []);

  const renderTextWithHighlight = (text) => {
  if (!text) return null;

  return text.split(/(".*?")/g).map((part, i) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      return (
        <span key={i} className="text-primary">
          {part.replace(/"/g, "")}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
};


  if (!data) return  <Loader />;

  return (
    <div className="py-2" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6 2xl:px-32 py-10 lg:py-4 flex flex-col gap-4 lg:flex-row items-center justify-between">
<h1 className="lg:text-[18px] text-center lg:text-start text-white">
  {renderTextWithHighlight(data.copyright?.[lang])}
</h1>



        <div className="flex items-center gap-10">
          {data.socials?.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white duration-300"
            >
              {item.label?.[lang]}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
