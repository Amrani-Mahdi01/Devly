import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TransitionProvider } from "./components/TransitionContext";
import { HelmetProvider } from "react-helmet-async";
import MainLayout from "./layout/MainLayout";
import { Suspense, lazy, useState, useEffect } from "react";
import FancyCursor from "./components/FancyCursor";


import AnimatedRoutes from "./components/AnimatedRoutes"; // import it
import Loader from "./components/Loader";

const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Project/Projects"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectDetail = lazy(() => import("./pages/Project/ProjectDetail"));


function App() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth > 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <TransitionProvider>
          {isDesktop && <FancyCursor />}
          <Suspense fallback={<Loader />}>
            {/* Wrap your Routes inside AnimatedRoutes */}
            <AnimatedRoutes>
              <Routes>
                <Route path="/" element={<MainLayout isDesktop={isDesktop} />}>
                  <Route index element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} /> {/* dynamic route */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </AnimatedRoutes>
          </Suspense>
        </TransitionProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
