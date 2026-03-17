import { useEffect, useState } from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Contact from "./sections/Contact";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Education from "./sections/Education";
import Achievements from "./sections/Achievements";
import Projects from "./sections/Projects";
import ServerLoader from "./sections/ServerLoader"; 

function App() {
  // 1. Initialize state by checking if we ALREADY woke the server in this session
  const [isServerAsleep, setIsServerAsleep] = useState(() => {
    return sessionStorage.getItem("isServerAwake") !== "true";
  });

  // Scroll to top on refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      window.history.replaceState(null, null, window.location.pathname);
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, []);

  // 2. When the loader finishes, save the "awake" status to the browser
  const handleServerAwake = () => {
    sessionStorage.setItem("isServerAwake", "true"); // Save the note
    setIsServerAsleep(false); // Hide the terminal
  };

  return (
    <div className="bg-[#0F0F1A] text-gray-200 min-h-screen">
      
      {/* 3. Pass the new handleServerAwake function to the loader */}
      {isServerAsleep ? (
        <ServerLoader onAwake={handleServerAwake} />
      ) : (
        <>
          <Navbar />
          <Hero />
          <Skills />
          <Projects />  
          <Experience />
          <Education />
          <Achievements />
          <Contact />
        </>
      )}

    </div>
  )
}

export default App;