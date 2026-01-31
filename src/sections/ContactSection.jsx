import { useEffect, useState, useContext, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client } from "../lib/sanity";
import { LanguageContext } from "../context/LanguageContext";
import { contactSectionQuery } from "../lib/queries";
import { LuUser, LuMail, LuPhone, LuPenLine, LuCheck } from "react-icons/lu";
import Loader from "../components/Loader";
import { functions, ID } from "../lib/appwrite";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const { language } = useContext(LanguageContext);
  const lang = language === "AR" ? "ar" : "en";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const sectionRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // Validation regex patterns
  const validationRules = {
    fullName: {
      pattern: /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/,
      message: {
        en: "Name must be 2-50 characters (letters only)",
        ar: "يجب أن يكون الاسم من 2-50 حرفًا (أحرف فقط)"
      }
    },
    email: {
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: {
        en: "Please enter a valid email address",
        ar: "الرجاء إدخال بريد إلكتروني صحيح"
      }
    },
    phoneNumber: {
      pattern: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      message: {
        en: "Please enter a valid phone number",
        ar: "الرجاء إدخال رقم هاتف صحيح"
      }
    },
    subject: {
      pattern: /^.{3,100}$/,
      message: {
        en: "Subject must be 3-100 characters",
        ar: "يجب أن يكون الموضوع من 3-100 حرفًا"
      }
    },
    message: {
      pattern: /^.{10,500}$/,
      message: {
        en: "Message must be 10-500 characters",
        ar: "يجب أن تكون الرسالة من 10-500 حرفًا"
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      const res = await client.fetch(contactSectionQuery);
      setData(res);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!data || isMobile) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".fade-up"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [data, isMobile]);

  const validateField = (name, value) => {
    // Skip validation for optional fields if empty
    if ((name === "phoneNumber" || name === "subject") && !value.trim()) {
      return "";
    }

    const rule = validationRules[name];
    if (rule && !rule.pattern.test(value)) {
      return rule.message[lang];
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ["fullName", "email", "message"];
    
    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        newErrors[field] = lang === "ar" 
          ? "هذا الحقل مطلوب" 
          : "This field is required";
      } else {
        const error = validateField(field, form[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    // Optional fields (only validate if filled)
    ["phoneNumber", "subject"].forEach((field) => {
      if (form[field].trim()) {
        const error = validateField(field, form[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      alert(lang === "ar" 
        ? "الرجاء تصحيح الأخطاء في النموذج" 
        : "Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const response = await functions.createExecution(
        '6978d0b60029a4a34da4',
        JSON.stringify(form),
        false
      );



      if (response.statusCode === 200 || response.status === 'completed') {
        alert(lang === "ar" 
          ? "تم إرسال الرسالة بنجاح 🚀" 
          : "Message sent successfully 🚀");
        setForm({ fullName: "", email: "", phoneNumber: "", subject: "", message: "" });
        setErrors({});
      } else {
        console.error('Function error:', response);
        alert(lang === "ar" 
          ? "حدث خطأ ما" 
          : "Something went wrong");
      }
    } catch (err) {
      console.error('Error:', err);
      alert(lang === "ar" 
        ? "حدث خطأ ما" 
        : "Something went wrong");
    }

    setLoading(false);
  };

  const renderTextWithBreaks = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, lineIndex) => (
      <span key={lineIndex}>
        {line}
        {lineIndex !== text.split("\n").length - 1 && (
          <br className="hidden xl:block" />
        )}
      </span>
    ));
  };

  if (!data) return <Loader />;

  return (
    <section
      ref={sectionRef}
      className="py-20"
      id="contact"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 2xl:px-32">
        <div className="flex gap-5 flex-col lg:flex-row">
          <div className="lg:w-[50%] xl:p-5 fade-up">
            <span className="font-medium">{data.badge[lang]}</span>
            <h1 className="2xl:text-[45px] text-3xl lg:text-4xl text-white my-5 leading-[1.2]">
              {renderTextWithBreaks(data.title[lang])}
            </h1>
            <p className="text-gray-400">
              {renderTextWithBreaks(data.description[lang])}
            </p>

            <div className="flex mt-10 flex-col gap-7">
              {data.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-5 fade-up">
                  <div className="flex items-center justify-center h-6 w-6 lg:w-8 lg:h-8 rounded-full bg-primary">
                    <LuCheck className="w-5 h-5 text-black" />
                  </div>
                  <span className="font-medium lg:text-xl">
                    {feature.text[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-full xl:p-5 fade-up">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="flex gap-10 flex-col lg:flex-row">
                <InputField
                  label={data.formLabels.fullName[lang]}
                  placeholder="Richard D. Hammond"
                  Icon={LuUser}
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.fullName}
                  required
                />
                <InputField
                  label={data.formLabels.email[lang]}
                  placeholder="example@email.com"
                  Icon={LuMail}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  required
                />
              </div>

              <div className="flex gap-10 flex-col lg:flex-row">
                <InputField
                  label={data.formLabels.phone[lang]}
                  placeholder="+1 234 567 890"
                  Icon={LuPhone}
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phoneNumber}
                />
                <InputField
                  label={data.formLabels.subject[lang]}
                  placeholder="Project Inquiry"
                  Icon={LuPenLine}
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.subject}
                />
              </div>

              <TextareaField
                label={data.formLabels.message[lang]}
                placeholder="Tell us about your project..."
                name="message"
                value={form.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.message}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-primary w-full lg:w-auto font-semibold text-black px-10 py-3 rounded-xl text-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : data.buttonText[lang]}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputField({ label, placeholder, Icon, type, name, value, onChange, onBlur, error, required }) {
  const { language } = useContext(LanguageContext);
  const dir = language === "AR" ? "rtl" : "ltr";

  return (
    <div className="w-full">
      <label className="text-white mb-3 block text-lg">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <div className={`bg-lighter px-7 flex items-center w-full border-2 rounded-xl focus-within:border-primary transition ${
        error ? "border-red-500" : "border-border"
      }`}>
        <input
          dir={dir}
          className="h-[60px] w-full outline-none bg-transparent"
          placeholder={placeholder}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
        />
        <Icon className="text-lg text-gray-400" />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

function TextareaField({ label, placeholder, name, value, onChange, onBlur, error, required }) {
  return (
    <div>
      <label className="text-white mb-3 block text-lg">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <div className={`bg-lighter px-7 py-4 w-full border-2 rounded-xl focus-within:border-primary transition ${
        error ? "border-red-500" : "border-border"
      }`}>
        <textarea
          rows="5"
          className="w-full outline-none bg-transparent resize-none"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}