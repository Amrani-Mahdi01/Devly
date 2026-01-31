import Header from "../components/Header";
import Footer from "../components/Footer";
import SubFooter from "../components/SubFooter";
import ScrollSmootherComponent from "../components/ScrollSmoother";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);
  }, [location]);

  return (
    <>
      <ScrollSmootherComponent />
      
      {/* Header OUTSIDE wrapper - stays fixed */}
      <Header />

      <div id="wrapper">
        <div id="content">
          <Outlet /> {/* Pages render here */}
          <Footer />
          <SubFooter />
        </div>
      </div>
    </>
  );
}