import { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaCalendarAlt, FaMapMarkerAlt, FaExternalLinkAlt } from "react-icons/fa";

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
            <span key={i} className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 drop-shadow-sm">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [activeTab, setActiveTab] = useState("internships");
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const contentRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/experience`);
        const sortedData = res.data.sort((a, b) => a.order - b.order);
        setExperiences(sortedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching experience:", err);
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%" }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".experience-card",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
        );
      }, contentRef);
      return () => ctx.revert();
    }
  }, [activeTab, loading]);

  const filteredData = experiences.filter(exp => 
    activeTab === "internships" ? exp.type === "internship" : exp.type === "committee"
  );

  if (loading) return null;

  return (
    <section id="experience" ref={containerRef} className="min-h-screen py-24 relative bg-[#050505] overflow-hidden">
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div ref={headingRef} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
              <span className="text-xs font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 uppercase">Career Path</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">& Growth</span>
            </h2>
          </div>

          <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-sm relative">
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300 ease-out ${activeTab === "internships" ? "left-1.5" : "left-[calc(50%+3px)]"}`} />
            <button onClick={() => setActiveTab("internships")} className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 min-w-[120px] ${activeTab === "internships" ? "text-white" : "text-gray-400"}`}>Internships</button>
            <button onClick={() => setActiveTab("committees")} className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 min-w-[120px] ${activeTab === "committees" ? "text-white" : "text-gray-400"}`}>Committees</button>
          </div>
        </div>

        <div ref={contentRef} className="grid grid-cols-1 gap-10">
          {filteredData.map((item) => (
            <div key={item._id} className="experience-card group relative p-8 md:p-10 rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 transition-all duration-500 hover:border-purple-500/30 overflow-hidden shadow-2xl">
              
              {activeTab === "internships" ? (
                /* --- INTERNSHIP UI WITH DIVIDER --- */
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10 animate-in fade-in duration-500">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-xl border border-white/10 bg-black/40 p-2 transform group-hover:scale-110 transition-transform duration-500">
                    <img src={item.image} alt={item.company} className="w-full h-full object-contain" />
                  </div>
                  <div className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                      <div>
                        <h3 className="text-xl md:text-3xl font-black text-white tracking-tight mb-1">{item.role}</h3>
                        <p className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 tracking-wide">{item.company}</p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 h-fit">
                        <FaCalendarAlt className="text-purple-500 text-[10px]" />
                        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-gray-400">
                          {item.duration}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-white/5 my-6 w-full" />

                    <ul className="space-y-3 mb-6">
                        {/* FIXED: Now splits by full stop (.) to match admin manager changes */}
                        {(item.description || "").split('.').map((bullet, bIdx) => (
                            bullet.trim() && (
                              <li key={bIdx} className="flex items-start gap-4 text-gray-300 text-sm md:text-base font-light leading-snug">
                                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                                  <span><HighlightText text={bullet.trim()} /></span>
                              </li>
                            )
                        ))}
                    </ul>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-500/30 bg-purple-500/5 text-purple-300 hover:bg-purple-500 hover:text-white transition-all duration-300">
                        View Credential <FaExternalLinkAlt size={9} />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                /* --- COMMITTEE TIMELINE UI --- */
                <div className="animate-in fade-in duration-500 relative z-10">
                  <div className="flex items-center gap-6 mb-10 border-b border-white/5 pb-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shrink-0 shadow-lg flex items-center justify-center p-3 transform group-hover:scale-110 transition-transform duration-500">
                      <img src={item.image} alt={item.company} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">{item.company}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <FaMapMarkerAlt className="text-purple-500 text-[10px]" /> 
                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-[0.1em]">
                          {item.location || "On Campus"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-0">
                    {(item.roles && item.roles.length > 0 ? item.roles : [{ title: item.role, date: item.duration, description: item.description, points: item.points }]).map((role, rIdx, arr) => {
                      {/* FIXED: Now splits by full stop (.) to match admin manager changes */}
                      const pointsArray = Array.isArray(role.points) ? role.points : (role.description || "").split('.').filter(p => p.trim() !== "");
                      
                      return (
                        <div key={rIdx} className="relative pl-12 pb-12 last:pb-0">
                          {rIdx !== arr.length - 1 && (
                              <div className="absolute left-[11px] top-6 w-[2px] h-full bg-gradient-to-b from-purple-500 via-fuchsia-500/40 to-transparent group-hover:from-purple-400 transition-colors duration-500" />
                          )}
                          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110 group-hover:border-fuchsia-400">
                             <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                          </div>
                          <div className="mb-6">
                            <h4 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 tracking-tight">
                              {role.title}
                            </h4>
                            <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 group-hover:border-purple-500/30 transition-colors">
                              <FaCalendarAlt className="text-purple-400 text-[10px]" />
                              <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                {role.date}
                              </span>
                            </div>
                          </div>
                          <ul className="space-y-4">
                            {pointsArray.map((point, pIdx) => (
                              <li key={pIdx} className="text-gray-300 text-sm md:text-base leading-relaxed flex gap-4 font-light">
                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.5)] group-hover:shadow-fuchsia-500/50 transition-all" /> 
                                <span><HighlightText text={point.trim()} /></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;