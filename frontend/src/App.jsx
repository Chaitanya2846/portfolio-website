import { useEffect } from "react"; // <--- 1. Import useEffect
import Navbar from "./sections/Navbar"
import Hero from "./sections/Hero"
import Contact from "./sections/Contact"
import Skills from "./sections/Skills"
import Experience from "./sections/Experience"
import Education from "./sections/Education"
import Achievements from "./sections/Achievements"
import Projects from "./sections/Projects"

function App() {

  // <--- 2. Add this block to force the scroll to the top on refresh --->
  useEffect(() => {
    // Disable the browser's automatic scroll memory
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Remove any #hash from the URL (e.g., changing localhost:5173/#contact to localhost:5173/)
    if (window.location.hash) {
      window.history.replaceState(null, null, window.location.pathname);
    }

    // Force the window to the absolute top instantly
    window.scrollTo(0, 0);

    // A tiny failsafe for stubborn browsers (like Chrome) that try to scroll after rendering
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, []); // The empty array [] means this only runs once when the app starts

  return (
    <div className="bg-[#0F0F1A] text-gray-200">
      <Navbar />
      <Hero />
      <Skills />
      <Projects />  
      <Experience />
      <Education />
      <Achievements />
      <Contact />
    </div>
  )
}

export default App