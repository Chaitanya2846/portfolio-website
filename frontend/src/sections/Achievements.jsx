import { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaTrophy, FaTimes, FaExternalLinkAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FiAward, FiMaximize2 } from "react-icons/fi"; 

gsap.registerPlugin(ScrollTrigger);

// --- HELPER: Manual Text Highlighter ---
const HighlightText = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g); 
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={i} className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-sm">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState("wins");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  const modalRef = useRef(null);

  // ✅ 1. Added dynamic API URL fallback
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        // ✅ 2. Replaced localhost with dynamic API_URL
        const res = await axios.get(`${API_URL}/api/achievements`);
        setAchievements(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [API_URL]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none none", 
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!loading && achievements.length > 0) {
      const timer = setTimeout(() => {
        const ctx = gsap.context(() => {
          const wrappers = gsap.utils.toArray(".achievement-wrapper");
          gsap.killTweensOf(wrappers);
          gsap.fromTo(wrappers, 
            { autoAlpha: 0, y: 50, scale: 0.95 }, 
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.15,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
                toggleActions: "play none none none" 
              }
            }
          );
        }, gridRef);
        return () => ctx.revert(); 
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab, loading, achievements]);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedImage]);

  const closeModal = () => {
    gsap.to(modalRef.current, { 
        opacity: 0, 
        scale: 0.95,
        duration: 0.3, 
        onComplete: () => setSelectedImage(null) 
    });
  };

  const filteredData = achievements.filter(item => {
    if (activeTab === "wins") return item.competition || item.type === 'win';
    return !item.competition && item.type !== 'win'; 
  });

  const getTagsArray = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) {
      let extracted = [];
      tags.forEach(t => {
          if (t.includes(',')) {
              extracted.push(...t.split(',').map(str => str.trim()).filter(Boolean));
          } else {
              extracted.push(t);
          }
      });
      return extracted;
    }
    if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean);
    return [];
  };

  // ✅ 3. Replaced localhost for dynamic image loading
  const getImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith('http') ? url : `${API_URL}${url}`;
  };

  return (
    <section id="achievements" ref={containerRef} className="min-h-screen py-24 relative bg-[#050505] overflow-hidden">
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADING & TABS */}
        <div ref={headingRef} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
              <span className="text-xs font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 uppercase">Hall of Fame</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Honors & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Awards</span>
            </h2>
          </div>

          <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-sm relative">
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-300 ease-out ${activeTab === "wins" ? "left-1.5" : "left-[calc(50%+3px)]"}`} />
            <button onClick={() => setActiveTab("wins")} className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2 ${activeTab === "wins" ? "text-white" : "text-gray-400 hover:text-white"}`}>
              <FaTrophy className={activeTab === "wins" ? "text-yellow-300" : ""} /> Wins
            </button>
            <button onClick={() => setActiveTab("certifications")} className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2 ${activeTab === "certifications" ? "text-white" : "text-gray-400 hover:text-white"}`}>
              <FiAward size={15} className={activeTab === "certifications" ? "text-blue-300" : ""} /> Certifications
            </button>
          </div>
        </div>

        {/* --- GRID CONTENT --- */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="text-gray-500">Loading honors...</p>
          ) : (
            filteredData.map((item) => {
              const tags = getTagsArray(item.tags);
              const isWin = activeTab === "wins";

              return (
                <div key={item._id} className="achievement-wrapper opacity-0 invisible h-full">
                  
                  <div className="achievement-card group relative rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-purple-500/30 hover:shadow-[0_20px_50px_rgba(147,51,234,0.1)] transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                    
                    {/* FULL WIDTH IMAGE HEADER */}
                    <div className="relative h-56 w-full overflow-hidden shrink-0 cursor-pointer" onClick={() => setSelectedImage(getImageUrl(item.image))}>
                        {item.image ? (
                          <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                        ) : (
                          <div className="w-full h-full bg-[#111] flex items-center justify-center">
                            {isWin ? <FaTrophy size={50} className="text-white/10" /> : <FiAward size={50} className="text-white/10" />}
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80 z-10 pointer-events-none" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                        
                        <div className="absolute bottom-4 right-4 z-30 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                           <div className="p-2.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/80 shadow-2xl">
                              <FiMaximize2 className="text-lg" />
                           </div>
                        </div>

                        {/* Top Right Date Tag */}
                        <div className="absolute top-4 right-4 z-30 bg-yellow-500 text-black font-extrabold px-4 py-1.5 rounded-full text-[10px] uppercase shadow-lg">
                            {item.date}
                        </div>
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="px-6 pb-6 relative z-20 flex flex-col flex-grow">
                        
                        {/* FLOATING ICON */}
                        <div className="w-12 h-12 bg-[#0a0a0a] backdrop-blur-md rounded-xl flex items-center justify-center -mt-6 mb-5 shadow-lg relative z-30 transform group-hover:-translate-y-1 transition-transform duration-500 border border-white/10 shrink-0">
                            {isWin ? <FaTrophy className="text-purple-400/80 text-lg" /> : <FiAward className="text-purple-400/80 text-xl" />}
                        </div>

                        {/* TEXT CONTENT */}
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight tracking-tight group-hover:text-purple-300 transition-colors">
                          {item.title}
                        </h3>
                        
                        {/* INFO LINE: COMPETITION + DIVIDER + LOCATION */}
                        <div className="flex items-center flex-wrap gap-2 mb-4">
                          <p className="text-purple-400 font-bold uppercase tracking-widest text-[11px]">
                            {item.competition || item.issuer}
                          </p>
                          {item.location && (
                            <>
                              <span className="text-white/20 text-[10px]">•</span>
                              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                                <FaMapMarkerAlt className="text-purple-500/80" /> {item.location}
                              </p>
                            </>
                          )}
                        </div>
                        
                        {/* CONDITIONAL DESCRIPTION: Original style with top border */}
                        {isWin && (
                          <p className="text-gray-400 text-sm font-medium leading-relaxed mb-4 border-t border-white/5 pt-4">
                            <HighlightText text={item.description} />
                          </p>
                        )}

                        {/* BOTTOM FOOTER: TAGS & LINKS */}
                        <div className="flex flex-col gap-4 mt-auto pt-2">
                          
                          {/* TECH STACK STYLE TAGS - HIDDEN FOR WINS */}
                          {!isWin && tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-purple-300 text-xs font-semibold tracking-wide transition-colors hover:bg-white/10 hover:text-purple-200 cursor-default"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* LINK BUTTON */}
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-fit flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors group/link mt-2">
                              View Details <FaExternalLinkAlt size={10} className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                            </a>
                          )}
                        </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedImage && (
        <div ref={modalRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4" onClick={closeModal}>
            <button onClick={closeModal} className="absolute top-6 right-6 text-white/50 hover:text-white text-4xl z-[110] transition-colors"><FaTimes /></button>
            <div className="relative max-w-5xl w-full max-h-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)] border border-white/10" onClick={(e) => e.stopPropagation()}>
                <img src={selectedImage} alt="Full View" className="w-full h-full object-contain max-h-[90vh]" />
            </div>
        </div>
      )}
    </section>
  );
}

export default Achievements;