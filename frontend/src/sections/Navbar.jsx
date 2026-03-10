import { useState, useEffect } from "react"
import axios from "axios"
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  // --- NEW: State to hold the dynamic resume URL ---
  const [resumeUrl, setResumeUrl] = useState("")

  const navLinks = [
    { name: "Home", link: "#home" },
    { name: "Skills", link: "#skills" },
    { name: "Projects", link: "#projects" },
    { name: "Experience", link: "#experience" },
    { name: "Education", link: "#education" },
    { name: "Achievements", link: "#achievements" },
    { name: "Contact", link: "#contact" },
  ]

  // --- FETCH DYNAMIC RESUME FROM BACKEND ---
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/profile`);
        if (res.data.length > 0 && res.data[0].resumeUrl) {
          setResumeUrl(res.data[0].resumeUrl);
        }
      } catch (err) {
        console.error("Failed to fetch resume:", err);
      }
    };
    fetchResume();
  }, []);

  // --- UPDATED RELOAD LOGIC ---
  useEffect(() => {
    // 1. Tell the browser NOT to remember scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Clear the hash from the URL so it doesn't jump to a section
    if (window.location.hash) {
      window.history.replaceState(null, null, window.location.pathname);
    }

    // 3. Force scroll to top on load/refresh
    const handleInitialScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      setActiveSection("home");
    };

    // Run immediately and after a tiny delay to catch late renders
    handleInitialScroll();
    const timeoutId = setTimeout(handleInitialScroll, 50);

    return () => clearTimeout(timeoutId);
  }, []);

  // --- DYNAMIC SCROLL SPY ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const screenMiddle = window.innerHeight / 2;
      let currentActive = "home";

      navLinks.forEach((item) => {
        const sectionId = item.link.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          // If the section's top has passed the middle of the screen
          if (rect.top <= screenMiddle) {
            currentActive = sectionId;
          }
        }
      });

      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-[#050505]/70 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl"
          : "bg-transparent py-5" 
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center relative h-full">
        
        {/* LEFT: LOGO */}
        <a href="#home" className="text-2xl md:text-3xl font-black tracking-tighter group shrink-0 z-20">
          <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-transparent bg-clip-text">
            Portfolio
          </span>
          <span className="text-white">.</span>
        </a>

        {/* CENTER: NAV LINKS */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <ul className="flex gap-8 items-center bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-md">
            {navLinks.map((item, index) => {
                const isActive = activeSection === item.link.substring(1); 
                return (
                    <li key={index}>
                        <a
                            href={item.link}
                            className={`relative text-sm font-semibold tracking-wide transition-all duration-300 py-1 inline-block group ${
                                isActive ? "text-white" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {item.name}
                            <span 
                                className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ${
                                    isActive ? "w-full" : "w-0 group-hover:w-full"
                                }`}
                            ></span>
                        </a>
                    </li>
                )
            })}
            </ul>
        </div>

        {/* RIGHT: SOCIALS & RESUME */}
        <div className="hidden lg:flex items-center gap-5 z-20">
            <div className="flex gap-4 border-r border-white/10 pr-5">
                <SocialLink href="https://github.com/Chaitanya2846" icon={<FaGithub />} />
                <SocialLink href="https://linkedin.com/in/chaitanya-shirdhankar-39594b318" icon={<FaLinkedin />} />
                <SocialLink href="https://leetcode.com/Chaitanya2806" icon={<FaCode />} />
            </div>

            {/* --- UPDATED: Dynamic Resume Link with Safety Check --- */}
            <a 
                href={resumeUrl || "#"} // Uses Cloudinary URL, falls back to # if loading
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => {
                    if (!resumeUrl) {
                        e.preventDefault(); // Stop the browser from opening the "#" link
                        alert("Resume is still loading or hasn't been uploaded yet!");
                    }
                }}
                className="px-6 py-2.5 text-sm font-black text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300"
            >
                Resume
            </a>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
            className="lg:hidden text-white relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 z-50"
            onClick={() => setIsOpen(!isOpen)}
        >
            <span className={`block w-7 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-7 h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <span className={`block w-7 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`lg:hidden fixed inset-0 w-full h-screen bg-[#050505] transition-all duration-500 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((item, index) => {
             const isActive = activeSection === item.link.substring(1);
             return (
                <li key={index}>
                <a
                    href={item.link}
                    onClick={() => setIsOpen(false)}
                    className={`text-3xl font-black transition-all duration-300 ${
                        isActive ? "text-purple-500" : "text-white/50 hover:text-white"
                    }`}
                >
                    {item.name}
                </a>
                </li>
             )
          })}
          
          {/* MOBILE: Dynamic Resume Link with Safety Check */}
          <li className="mt-8">
             <a 
                href={resumeUrl || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => {
                    if (!resumeUrl) {
                        e.preventDefault(); // Stop the browser from opening the "#" link
                        alert("Resume is still loading or hasn't been uploaded yet!");
                    }
                }}
                className="px-8 py-3 text-xl font-black text-black bg-white rounded-full hover:bg-gray-200 transition-all duration-300"
            >
                View Resume
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

function SocialLink({ href, icon }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300 text-xl"
        >
            {icon}
        </a>
    )
}

export default Navbar;